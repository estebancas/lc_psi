import { describe, expect, it } from 'vitest';
import { buildContactMessage, contactEmailHtml, contactEmailText, type ContactFormData } from '../src/worker';

// wrangler.jsonc's generated Env types FROM_EMAIL/RECIPIENT_EMAIL as string
// literals (they're plain `vars`, not secrets) — `as const` keeps this
// object assignable to Pick<Env, 'FROM_EMAIL' | 'RECIPIENT_EMAIL'>.
const env = { FROM_EMAIL: 'contacto@psicologalauracastro.com', RECIPIENT_EMAIL: 'lauracastropsi25@gmail.com' } as const;

const baseData: ContactFormData = {
	nombre: 'Ana',
	email: 'ana@example.com',
	mensaje: 'Hola, quisiera agendar una cita.',
};

// mimetext always RFC2047-encodes the Subject header (base64, even for
// plain ASCII), so tests can't substring-match the raw header line directly.
function decodeSubject(raw: string): string {
	const line = raw.match(/^Subject: (.+)$/m)?.[1]?.trim();
	if (!line) throw new Error('No Subject header found in raw message');
	const encoded = line.match(/^=\?utf-8\?B\?(.+)\?=$/i);
	return encoded ? Buffer.from(encoded[1], 'base64').toString('utf-8') : line;
}

describe('buildContactMessage', () => {
	it('carries the sanitized nombre in the subject', () => {
		const raw = buildContactMessage(baseData, env);
		expect(decodeSubject(raw)).toBe('Nuevo contacto: Ana');
	});

	it('does not let a CR/LF in nombre inject an extra header line', () => {
		const raw = buildContactMessage({ ...baseData, nombre: 'Ana\r\nBcc: evil@example.com' }, env);
		// Scope the check to the header block (before the first blank line) —
		// the sanitized-but-not-header-stripped nombre is expected to still
		// show up verbatim inside the message *body*, which is not a header
		// injection risk, just user-submitted text.
		const headerBlock = raw.split(/\r?\n\r?\n/)[0];
		expect(headerBlock).not.toMatch(/^Bcc:/im);
		// The name still shows up in the subject, just with the newline
		// collapsed to spaces instead of becoming a header break.
		expect(decodeSubject(raw)).toBe('Nuevo contacto: Ana  Bcc: evil@example.com');
	});

	it('sets Reply-To to the submitted email address', () => {
		const raw = buildContactMessage(baseData, env);
		expect(raw).toMatch(/Reply-To:.*ana@example\.com/i);
	});

	it('includes both a text/plain and a text/html part', () => {
		const raw = buildContactMessage(baseData, env);
		expect(raw).toMatch(/Content-Type: text\/plain/i);
		expect(raw).toMatch(/Content-Type: text\/html/i);
	});
});

describe('contactEmailHtml', () => {
	it('escapes a double-quote in the email so it cannot break out of the href attribute', () => {
		const html = contactEmailHtml({ ...baseData, email: 'a"onmouseover=x@b.co' });
		expect(html).not.toContain('href="mailto:a"onmouseover=x@b.co"');
		expect(html).toContain('&quot;onmouseover=x@b.co');
	});

	it('removes a well-formed <img onerror> tag entirely (sanitize strips it before escaping ever runs)', () => {
		const html = contactEmailHtml({ ...baseData, mensaje: '<img src=x onerror=alert(1)>' });
		expect(html).not.toContain('<img');
		expect(html).not.toContain('onerror');
	});

	it('escapes a bare "<" that survives sanitize (no matching ">", so the tag-strip regex leaves it alone)', () => {
		const html = contactEmailHtml({ ...baseData, mensaje: 'Me gusta <3 tu trabajo' });
		expect(html).not.toContain('<3');
		expect(html).toContain('&lt;3');
	});

	it('escapes a quote in nombre as well', () => {
		const html = contactEmailHtml({ ...baseData, nombre: 'Ana "la doctora"' });
		expect(html).toContain('Ana &quot;la doctora&quot;');
	});
});

describe('contactEmailText', () => {
	it('keeps raw punctuation in the plain-text part (no HTML escaping needed there)', () => {
		const text = contactEmailText({ ...baseData, mensaje: 'Preguntas & dudas: "urgente"' });
		expect(text).toContain('Preguntas & dudas: "urgente"');
	});
});

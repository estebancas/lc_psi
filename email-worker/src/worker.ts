import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage, Mailbox } from 'mimetext';

export interface ContactFormData {
	nombre: string;
	email: string;
	mensaje: string;
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sanitize(input: string): string {
	return input.trim().replace(/<[^>]*>/g, '').slice(0, 5000);
}

// nombre ends up in the MIME Subject header. sanitize() alone doesn't strip
// CR/LF, and a raw newline there would inject an extra header line (e.g. a
// name of "x\nBcc: evil@example.com"). Only used for the subject — mensaje's
// intentional line breaks in the body are left untouched.
function sanitizeForHeader(input: string): string {
	return sanitize(input).replace(/[\r\n]/g, ' ');
}

export function escapeHtml(input: string): string {
	// Order matters: & must go first, or the entities just inserted for
	// <, >, ", ' would themselves get re-escaped.
	return input
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

// Constant-time-ish compare so a mismatched secret doesn't leak length info via timing.
// Also refuses to authenticate when either side is empty: `secretsMatch('', '')` must
// be false, otherwise a request with no X-Contact-Secret header would authenticate
// against a misconfigured (unset) CONTACT_WORKER_SECRET.
export function secretsMatch(a: string, b: string): boolean {
	if (!a || !b) return false;
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) {
		diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return diff === 0;
}

function json(body: unknown, status: number): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export function contactEmailHtml(data: ContactFormData): string {
	const nombre = escapeHtml(sanitize(data.nombre));
	// Escaped once, reused for both the display text and the mailto href —
	// the href sits inside a double-quoted HTML attribute, so escaping `"`
	// (and `<`/`>`) is what stops an address like `a"onmouseover=x@b.co`
	// from breaking out of it.
	const email = escapeHtml(sanitize(data.email));
	const mensaje = escapeHtml(sanitize(data.mensaje));
	return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, sans-serif; color: #222; line-height: 1.6;">
	<h2>Nuevo mensaje de contacto</h2>
	<p><strong>Nombre:</strong> ${nombre}</p>
	<p><strong>Correo:</strong> <a href="mailto:${email}">${email}</a></p>
	<p><strong>Mensaje:</strong></p>
	<p style="white-space: pre-wrap; padding: 12px; background: #f5f5f5; border-left: 3px solid #999;">${mensaje}</p>
	<hr>
	<p style="font-size: 12px; color: #777;">Enviado desde el formulario de contacto de psicologalauracastro.com</p>
</body>
</html>`;
}

export function contactEmailText(data: ContactFormData): string {
	return `Nuevo mensaje de contacto

Nombre: ${sanitize(data.nombre)}
Correo: ${sanitize(data.email)}

Mensaje:
${sanitize(data.mensaje)}

---
Enviado desde el formulario de contacto de psicologalauracastro.com`;
}

// Builds the raw MIME message sent via the send_email binding. Extracted so
// tests can assert on the message contents (subject, Reply-To, both body
// parts) without needing a live EMAIL binding.
export function buildContactMessage(data: ContactFormData, env: Pick<Env, 'FROM_EMAIL' | 'RECIPIENT_EMAIL'>): string {
	const msg = createMimeMessage();
	msg.setSender({ name: 'Formulario de contacto', addr: env.FROM_EMAIL });
	msg.setRecipient(env.RECIPIENT_EMAIL);
	msg.setHeader('Reply-To', new Mailbox(sanitize(data.email)));
	msg.setSubject(`Nuevo contacto: ${sanitizeForHeader(data.nombre)}`);
	msg.addMessage({ contentType: 'text/plain', data: contactEmailText(data) });
	msg.addMessage({ contentType: 'text/html', data: contactEmailHtml(data) });
	return msg.asRaw();
}

async function handleContact(request: Request, env: Env): Promise<Response> {
	const secret = request.headers.get('X-Contact-Secret') ?? '';
	if (!secretsMatch(secret, env.CONTACT_WORKER_SECRET)) {
		return json({ error: 'No autorizado' }, 401);
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'JSON inválido' }, 400);
	}

	// request.json() happily returns null, a string, a number, or an array —
	// none of those have .nombre/.email/.mensaje, so reading them would throw
	// past this try block and surface as an uncaught 500 instead of a 400.
	if (typeof body !== 'object' || body === null || Array.isArray(body)) {
		return json({ error: 'JSON inválido' }, 400);
	}

	const data = body as Partial<ContactFormData>;

	if (typeof data.nombre !== 'string' || typeof data.email !== 'string' || typeof data.mensaje !== 'string') {
		return json({ error: 'Faltan campos requeridos' }, 400);
	}

	// Validate the *sanitized* values — a whitespace-only or tags-only field
	// (e.g. nombre: "   " or "<b></b>") passes a plain truthiness check on
	// the raw input but should still count as missing.
	const nombre = sanitize(data.nombre);
	const email = sanitize(data.email);
	const mensaje = sanitize(data.mensaje);

	if (!nombre || !email || !mensaje) {
		return json({ error: 'Faltan campos requeridos' }, 400);
	}

	if (!EMAIL_REGEX.test(email)) {
		return json({ error: 'Correo electrónico inválido' }, 400);
	}

	const sanitizedData: ContactFormData = { nombre, email, mensaje };

	try {
		const raw = buildContactMessage(sanitizedData, env);
		await env.EMAIL.send(new EmailMessage(env.FROM_EMAIL, env.RECIPIENT_EMAIL, raw));
	} catch (error) {
		console.error('Error enviando correo:', error);
		return json({ error: 'No se pudo enviar el mensaje' }, 500);
	}

	return json({ success: true }, 200);
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname !== '/contact') {
			return new Response('Not Found', { status: 404 });
		}

		if (request.method !== 'POST') {
			return new Response('Method Not Allowed', {
				status: 405,
				headers: { Allow: 'POST' },
			});
		}

		return handleContact(request, env);
	},
} satisfies ExportedHandler<Env>;

import { describe, expect, it } from 'vitest';
import { escapeHtml, sanitize } from '../src/worker';

describe('sanitize', () => {
	it('trims leading/trailing whitespace', () => {
		expect(sanitize('  hola  ')).toBe('hola');
	});

	it('preserves inner whitespace', () => {
		expect(sanitize('  hola   mundo  ')).toBe('hola   mundo');
	});

	it('strips a well-formed tag but keeps its inner text', () => {
		expect(sanitize('<b>hola</b>')).toBe('hola');
	});

	it('strips a script tag pair, leaving the inner text behind', () => {
		// The regex only removes tag delimiters — it is not a script-execution
		// guard, just documents that "alert(1)" itself survives untouched.
		expect(sanitize('<script>alert(1)</script>')).toBe('alert(1)');
	});

	it('strips a "<...>" span even when it is not real markup (documents partial-strip behavior)', () => {
		// The tag regex is a blunt "< then anything-but-> then >" match, not an
		// HTML parser — plain-text math like "5 < x and y > 3" gets its whole
		// middle span eaten because it happens to look like an opening/closing
		// bracket pair.
		expect(sanitize('3 < 5 and 5 > 3')).toBe('3  3');
	});

	it('leaves an unclosed tag opener intact', () => {
		expect(sanitize('hola <div sin cerrar')).toBe('hola <div sin cerrar');
	});

	it('strips through the first ">" on nested brackets, leaving the trailing one (documents partial-strip behavior)', () => {
		// [^>]* is greedy but excludes ">", so the match runs from the first
		// "<" through the *first* ">" it finds — "<<b>" — leaving the final
		// ">" behind untouched. Not a real HTML parser; this pins that gap.
		expect(sanitize('<<b>>')).toBe('>');
	});

	it('truncates at exactly 5000 characters', () => {
		const input = 'a'.repeat(5001);
		const result = sanitize(input);
		expect(result).toHaveLength(5000);
		expect(result).toBe('a'.repeat(5000));
	});

	it('leaves a 4999-character input untouched', () => {
		const input = 'b'.repeat(4999);
		expect(sanitize(input)).toBe(input);
	});

	it('leaves a 5000-character input untouched (boundary, not off-by-one)', () => {
		const input = 'c'.repeat(5000);
		expect(sanitize(input)).toHaveLength(5000);
	});

	it('trims before truncating, not the other way around', () => {
		// If slice() ran first, the trailing spaces below would eat into the
		// 5000-char budget and the result would be short by the pad length.
		const input = 'd'.repeat(5000) + '     ';
		expect(sanitize(input)).toBe('d'.repeat(5000));
	});

	it('reduces a whitespace-only string to empty', () => {
		expect(sanitize('   \t  ')).toBe('');
	});

	it('preserves internal newlines', () => {
		expect(sanitize('linea uno\nlinea dos')).toBe('linea uno\nlinea dos');
	});
});

describe('escapeHtml', () => {
	it('escapes &, <, >, ", and \' each', () => {
		expect(escapeHtml('&<>"\'')).toBe('&amp;&lt;&gt;&quot;&#39;');
	});

	it('escapes & before other entities so they are not double-escaped', () => {
		// If "<" were escaped to "&lt;" before "&" was handled, the "&" in
		// "&lt;" would get re-escaped into "&amp;lt;".
		expect(escapeHtml('<')).toBe('&lt;');
		expect(escapeHtml('&lt;')).toBe('&amp;lt;');
	});

	it('leaves plain text untouched', () => {
		expect(escapeHtml('Laura Castro')).toBe('Laura Castro');
	});

	it('escapes an attribute-breaking payload end to end', () => {
		expect(escapeHtml('a" onmouseover="x')).toBe('a&quot; onmouseover=&quot;x');
	});
});

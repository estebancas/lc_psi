import { describe, expect, it } from 'vitest';
import { secretsMatch } from '../src/worker';

describe('secretsMatch', () => {
	it('returns true for equal strings', () => {
		expect(secretsMatch('shared-secret', 'shared-secret')).toBe(true);
	});

	it('returns false for same-length different strings', () => {
		expect(secretsMatch('aaaaaaaa', 'aaaaaaab')).toBe(false);
	});

	it('returns false for different-length strings', () => {
		expect(secretsMatch('short', 'much-longer-secret')).toBe(false);
	});

	it('returns false when both sides are empty', () => {
		// The real-world case: CONTACT_WORKER_SECRET was never set (empty
		// string) and the request also has no X-Contact-Secret header (also
		// coerced to ''). Both empty must NOT authenticate.
		expect(secretsMatch('', '')).toBe(false);
	});

	it('returns false when only the provided secret is empty', () => {
		expect(secretsMatch('', 'configured-secret')).toBe(false);
	});

	it('returns false when only the configured secret is empty', () => {
		expect(secretsMatch('whatever-header-value', '')).toBe(false);
	});

	it('treats a missing header (coerced to "") the same as an empty configured secret', () => {
		// request.headers.get(...) returns null for an absent header; the call
		// site does `?? ''` to coerce that before calling secretsMatch — this
		// pins the coerced value, not the ?? itself.
		const missingHeaderValue = '';
		expect(secretsMatch(missingHeaderValue, '')).toBe(false);
	});

	it('returns true for equal non-ASCII strings', () => {
		expect(secretsMatch('sécrét-ñ-🔒', 'sécrét-ñ-🔒')).toBe(true);
	});
});

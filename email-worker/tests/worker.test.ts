import { describe, expect, it, vi } from 'vitest';
import worker from '../src/worker';

// A plain object matching the Env shape, not the Miniflare-provided `env`
// from `cloudflare:test` — this test only needs a real workerd runtime for
// `cloudflare:email`/EmailMessage, not a live send_email binding, so EMAIL
// is a vi.fn() stub instead of wiring the real binding through wrangler.jsonc.
function makeEnv(overrides: Partial<Env> = {}): Env {
	return {
		EMAIL: { send: vi.fn().mockResolvedValue(undefined) } as unknown as Env['EMAIL'],
		FROM_EMAIL: 'contacto@psicologalauracastro.com',
		RECIPIENT_EMAIL: 'lauracastropsi25@gmail.com',
		CONTACT_WORKER_SECRET: 'test-secret',
		...overrides,
	};
}

function contactRequest(body: unknown, opts: { secret?: string; method?: string; path?: string } = {}): Request {
	const { secret = 'test-secret', method = 'POST', path = '/contact' } = opts;
	return new Request(`https://worker.example${path}`, {
		method,
		headers: {
			'Content-Type': 'application/json',
			...(secret !== undefined && secret !== null ? { 'X-Contact-Secret': secret } : {}),
		},
		body: method === 'GET' ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
	});
}

const validBody = { nombre: 'Ana', email: 'ana@example.com', mensaje: 'Hola, quisiera agendar una cita.' };

describe('routing', () => {
	it('returns 404 for an unknown path', async () => {
		const res = await worker.fetch(contactRequest(validBody, { path: '/otro' }), makeEnv());
		expect(res.status).toBe(404);
	});

	it('returns 405 with an Allow header for GET /contact', async () => {
		const res = await worker.fetch(contactRequest(undefined, { method: 'GET' }), makeEnv());
		expect(res.status).toBe(405);
		expect(res.headers.get('Allow')).toBe('POST');
	});

	it('returns 405 for OPTIONS /contact', async () => {
		const res = await worker.fetch(contactRequest(undefined, { method: 'OPTIONS' }), makeEnv());
		expect(res.status).toBe(405);
	});
});

describe('authentication', () => {
	it('rejects a wrong secret with 401 and never calls send', async () => {
		const env = makeEnv();
		const res = await worker.fetch(contactRequest(validBody, { secret: 'wrong-secret' }), env);
		expect(res.status).toBe(401);
		expect(env.EMAIL.send).not.toHaveBeenCalled();
	});

	it('rejects a missing X-Contact-Secret header with 401', async () => {
		const req = new Request('https://worker.example/contact', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(validBody),
		});
		const res = await worker.fetch(req, makeEnv());
		expect(res.status).toBe(401);
	});

	it('rejects with 401, not 200, when CONTACT_WORKER_SECRET is unset (empty string)', async () => {
		// Regression guard for the auth-bypass fix: an unconfigured secret
		// must not authenticate a request that also sends no header.
		const req = new Request('https://worker.example/contact', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(validBody),
		});
		const env = makeEnv({ CONTACT_WORKER_SECRET: '' });
		const res = await worker.fetch(req, env);
		expect(res.status).toBe(401);
		expect(env.EMAIL.send).not.toHaveBeenCalled();
	});
});

describe('request body validation', () => {
	it('returns 400 for malformed JSON', async () => {
		const res = await worker.fetch(contactRequest('{not valid json'), makeEnv());
		expect(res.status).toBe(400);
	});

	it.each([
		['null', 'null'],
		['a bare string', '"abc"'],
		['an array', '[]'],
		['a number', '42'],
	])('returns 400 instead of crashing when the JSON body is %s', async (_label, raw) => {
		const res = await worker.fetch(contactRequest(raw), makeEnv());
		expect(res.status).toBe(400);
		const body = (await res.json()) as { error?: string };
		expect(body.error).toBeTruthy();
	});

	it('returns 400 when a field is present but not a string', async () => {
		const res = await worker.fetch(contactRequest({ ...validBody, nombre: 123 }), makeEnv());
		expect(res.status).toBe(400);
	});

	it.each(['nombre', 'email', 'mensaje'] as const)('returns 400 when %s is missing', async (field) => {
		const body = { ...validBody };
		delete (body as Record<string, unknown>)[field];
		const res = await worker.fetch(contactRequest(body), makeEnv());
		expect(res.status).toBe(400);
	});

	it('returns 400 when nombre is whitespace-only', async () => {
		const res = await worker.fetch(contactRequest({ ...validBody, nombre: '   ' }), makeEnv());
		expect(res.status).toBe(400);
	});

	it('returns 400 when nombre sanitizes to empty (tags-only)', async () => {
		const res = await worker.fetch(contactRequest({ ...validBody, nombre: '<b></b>' }), makeEnv());
		expect(res.status).toBe(400);
	});
});

describe('email validation', () => {
	it.each(['a@b', 'a b@c.co', '@b.co', 'a@.co', 'a@b.co\r\nBcc:x@y.co'])(
		'rejects invalid email "%s" with 400',
		async (email) => {
			const res = await worker.fetch(contactRequest({ ...validBody, email }), makeEnv());
			expect(res.status).toBe(400);
		},
	);

	it('accepts a well-formed email', async () => {
		const env = makeEnv();
		const res = await worker.fetch(contactRequest(validBody), env);
		expect(res.status).toBe(200);
	});
});

describe('success path', () => {
	it('returns 200 with success:true and calls send once', async () => {
		const env = makeEnv();
		const res = await worker.fetch(contactRequest(validBody), env);
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ success: true });
		expect(env.EMAIL.send).toHaveBeenCalledTimes(1);
	});

	it('sends from FROM_EMAIL to RECIPIENT_EMAIL', async () => {
		const env = makeEnv();
		await worker.fetch(contactRequest(validBody), env);
		const sendMock = env.EMAIL.send as unknown as ReturnType<typeof vi.fn>;
		const message = sendMock.mock.calls[0][0] as { from: string; to: string };
		expect(message.from).toBe(env.FROM_EMAIL);
		expect(message.to).toBe(env.RECIPIENT_EMAIL);
	});

	it('accepts and truncates an over-long mensaje instead of rejecting it', async () => {
		const env = makeEnv();
		const res = await worker.fetch(contactRequest({ ...validBody, mensaje: 'x'.repeat(6000) }), env);
		expect(res.status).toBe(200);
	});
});

describe('send failure', () => {
	it('returns 500 when env.EMAIL.send rejects, and still only calls it once', async () => {
		const env = makeEnv({
			EMAIL: { send: vi.fn().mockRejectedValue(new Error('boom')) } as unknown as Env['EMAIL'],
		});
		const res = await worker.fetch(contactRequest(validBody), env);
		expect(res.status).toBe(500);
		const body = (await res.json()) as { error: string };
		expect(body.error).toBe('No se pudo enviar el mensaje');
		expect(env.EMAIL.send).toHaveBeenCalledTimes(1);
	});
});

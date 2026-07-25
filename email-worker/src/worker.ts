import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage, Mailbox } from 'mimetext';

interface ContactFormData {
	nombre: string;
	email: string;
	mensaje: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(input: string): string {
	return input.trim().replace(/<[^>]*>/g, '').slice(0, 5000);
}

// Constant-time-ish compare so a mismatched secret doesn't leak length info via timing.
function secretsMatch(a: string, b: string): boolean {
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

function contactEmailHtml(data: ContactFormData): string {
	const nombre = sanitize(data.nombre);
	const email = sanitize(data.email);
	const mensaje = sanitize(data.mensaje);
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

function contactEmailText(data: ContactFormData): string {
	return `Nuevo mensaje de contacto

Nombre: ${sanitize(data.nombre)}
Correo: ${sanitize(data.email)}

Mensaje:
${sanitize(data.mensaje)}

---
Enviado desde el formulario de contacto de psicologalauracastro.com`;
}

async function handleContact(request: Request, env: Env): Promise<Response> {
	const secret = request.headers.get('X-Contact-Secret') ?? '';
	if (!secretsMatch(secret, env.CONTACT_WORKER_SECRET)) {
		return json({ error: 'No autorizado' }, 401);
	}

	let data: ContactFormData;
	try {
		data = await request.json();
	} catch {
		return json({ error: 'JSON inválido' }, 400);
	}

	if (!data.nombre || !data.email || !data.mensaje) {
		return json({ error: 'Faltan campos requeridos' }, 400);
	}

	if (!EMAIL_REGEX.test(data.email)) {
		return json({ error: 'Correo electrónico inválido' }, 400);
	}

	const msg = createMimeMessage();
	msg.setSender({ name: 'Formulario de contacto', addr: env.FROM_EMAIL });
	msg.setRecipient(env.RECIPIENT_EMAIL);
	msg.setHeader('Reply-To', new Mailbox(data.email));
	msg.setSubject(`Nuevo contacto: ${sanitize(data.nombre)}`);
	msg.addMessage({ contentType: 'text/plain', data: contactEmailText(data) });
	msg.addMessage({ contentType: 'text/html', data: contactEmailHtml(data) });

	try {
		await env.EMAIL.send(new EmailMessage(env.FROM_EMAIL, env.RECIPIENT_EMAIL, msg.asRaw()));
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

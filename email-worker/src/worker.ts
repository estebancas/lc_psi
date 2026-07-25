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

function corsHeaders(origin: string): HeadersInit {
	return {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Max-Age': '86400',
	};
}

function json(body: unknown, status: number, origin: string): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json',
			...corsHeaders(origin),
		},
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
	const origin = env.ALLOWED_ORIGIN;

	let data: ContactFormData;
	try {
		data = await request.json();
	} catch {
		return json({ error: 'JSON inválido' }, 400, origin);
	}

	if (!data.nombre || !data.email || !data.mensaje) {
		return json({ error: 'Faltan campos requeridos' }, 400, origin);
	}

	if (!EMAIL_REGEX.test(data.email)) {
		return json({ error: 'Correo electrónico inválido' }, 400, origin);
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
		return json({ error: 'No se pudo enviar el mensaje' }, 500, origin);
	}

	return json({ success: true }, 200, origin);
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const origin = env.ALLOWED_ORIGIN;

		if (url.pathname !== '/contact') {
			return new Response('Not Found', { status: 404 });
		}

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders(origin) });
		}

		if (request.method !== 'POST') {
			return new Response('Method Not Allowed', {
				status: 405,
				headers: { Allow: 'POST, OPTIONS', ...corsHeaders(origin) },
			});
		}

		return handleContact(request, env);
	},
} satisfies ExportedHandler<Env>;

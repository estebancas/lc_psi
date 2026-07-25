# lc-psi email worker

Cloudflare Worker that sends the site's contact-form notifications via
[Email Routing](https://developers.cloudflare.com/email-routing/)'s free
`send_email` binding (raw MIME via `EmailMessage` + `mimetext`) — Cloudflare's
newer Email Sending product requires a paid plan; this route doesn't.

## Setup

```bash
npm install
npx wrangler login
npx wrangler email routing enable psicologalauracastro.com
npm run cf-typegen   # generates worker-configuration.d.ts with the real Env types
```

`FROM_EMAIL` in `wrangler.jsonc` must use a domain onboarded to Email Routing
(the command above). Update `RECIPIENT_EMAIL` and `ALLOWED_ORIGIN` there too
if they change.

## Dev

```bash
npm run dev
```

Emails in local dev are saved to `.wrangler/tmp/email/*.eml` instead of being
sent. POST to `http://localhost:8788/contact`:

```json
{ "nombre": "Ana", "email": "ana@example.com", "mensaje": "Hola, quisiera agendar una cita." }
```

## Deploy

```bash
npm run deploy
```

Copy the deployed Worker URL into `web/.env.local` as
`NEXT_PUBLIC_CONTACT_WORKER_URL` (see `web/app/components/ContactForm.tsx`).

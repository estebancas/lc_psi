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
npx wrangler secret put CONTACT_WORKER_SECRET   # generate with: openssl rand -hex 32
```

`FROM_EMAIL` in `wrangler.jsonc` must use a domain onboarded to Email Routing
(the command above). Update `RECIPIENT_EMAIL` there too if it changes.

`CONTACT_WORKER_SECRET` is a shared secret, not a `vars` entry — it's set via
`wrangler secret put` so it never lands in the committed `wrangler.jsonc`. The
worker only calls a request "from our site" if the `X-Contact-Secret` header
matches this value (see `handleContact` in `src/worker.ts`); this is what the
Next app's server action sends (`web/lib/actions/contact.ts`). There is no
browser-facing CORS check anymore — the worker is only ever called
server-to-server, so `Origin` isn't a meaningful signal.

## Dev

```bash
npm run dev
```

Create `.dev.vars` (gitignored) with the same secret used above:

```
CONTACT_WORKER_SECRET=<value>
```

Emails in local dev are saved to `.wrangler/tmp/email/*.eml` instead of being
sent. POST to `http://localhost:8788/contact`:

```json
{ "nombre": "Ana", "email": "ana@example.com", "mensaje": "Hola, quisiera agendar una cita." }
```

with header `X-Contact-Secret: <value>` — requests without it get `401`.

## Deploy

```bash
npm run deploy
```

Copy the deployed Worker URL into `web/.env.local` (and the Next host's
dashboard) as `CONTACT_WORKER_URL`, plus the matching `CONTACT_WORKER_SECRET`.
See `web/lib/actions/contact.ts`.

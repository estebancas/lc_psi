# lc-psi

```
                    _.--""--._
                _.-'          `-._
              .'                  `.
             /    MASLOW'S HAMMER   \
            |   "if all you have    |
            |    is a hammer..."    |
             \                    /
              `._              _.'
                 `-.        .-'
                    \      /
                     \    /
                      \  /
                       ||
                    ___||___
                   /        \
                  |  ▓▓▓▓▓▓  |
                  |  ▓▓▓▓▓▓  |
                   \________/
                       ||
                       ||
                      /  \
                     /____\

        "...everything looks like a nail."
```

Site for **Laura Castro Cordero**, psicóloga. All user-facing text is Spanish — no exceptions.

## Workspaces

npm workspaces monorepo. Install once from repo root — single hoisted `node_modules`, one root `package-lock.json` for all three packages.

```
npm install
```

| Path            | Package               | What it is                                                                                    | Dev                   |
| --------------- | --------------------- | ---------------------------------------------------------------------------------------------- | --------------------- |
| `web/`          | `lc-psi`              | Next.js 16 App Router frontend — the public site. Cache Components on.                          | `npm run dev:web`     |
| `studio/`       | `lcpsi`               | Sanity Studio — content editing for blog posts, services, and profile copy. Project `c3ikd5qa`, dataset `production`. | `npm run dev:studio`  |
| `email-worker/` | `lc-psi-email-worker` | Cloudflare Worker behind the contact form. Sends via Email Routing's `send_email` binding, authenticated with `CONTACT_WORKER_SECRET`. | `npm run dev:worker`  |

Each workspace keeps its own `tsconfig.json` and eslint config — different runtimes (browser/Next, Studio, workerd), not unified on purpose.

## Root scripts

```
npm run dev:web         # Next.js dev server
npm run dev:studio       # Sanity Studio dev server
npm run dev:worker       # wrangler dev for the email worker
npm run build:web        # next build
npm run build:studio     # sanity build
npm run deploy:studio    # sanity build + deploy schema + wrangler deploy (Cloudflare Pages)
npm run lint             # eslint across all workspaces (--if-present)
npm run typecheck        # tsc across all workspaces (--if-present)
```

## Architecture: fast initial load

Frontend optimizes for fast first paint over full-page freshness. Static shell prerenders via Next.js Cache Components (Partial Prerendering); only genuinely request-time or per-request-fresh content streams in behind `<Suspense>`.

Sanity content (blog posts, services copy) fetched with a short revalidation window (`revalidate: 30`), not `"use cache"` — expected to go stale within seconds of an editor publishing in Studio, so it streams instead of baking into the static shell at build time. Content freshness after publish is a product requirement, not an oversight — don't move these fetches to a longer-lived cache without checking with the user first.

Full rendering strategy and rationale: [`web/AGENTS.md`](web/AGENTS.md).

## Environment

`web/` needs a `.env.local` (see `web/.env.example`):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
CONTACT_WORKER_URL=
CONTACT_WORKER_SECRET=
```

`CONTACT_WORKER_SECRET` must match the value set in `email-worker/` via:

```
npx wrangler secret put CONTACT_WORKER_SECRET
```

## Deployment

- **web** — Next.js site (host per current setup).
- **studio** — static SPA build deployed to Cloudflare Pages at `studio.psicologalauracastro.com` via `npm run deploy:studio`.
- **email-worker** — Cloudflare Worker, `npx wrangler deploy` from `email-worker/`. Local dev writes emails to `.wrangler/tmp/email/*.eml` instead of sending.

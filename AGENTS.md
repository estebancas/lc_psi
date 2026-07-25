# lc-psi

Site for Laura Castro Cordero, psicóloga. All user-facing text is Spanish — no exceptions.

## Workspaces

npm workspaces monorepo. Install once from the repo root (`npm install`) — a single hoisted `node_modules` and one root `package-lock.json` serve all three packages.

| Path            | Package name          | What it is                                                                                                                   | Dev                  |
| --------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `web/`          | `lc-psi`               | Next.js 16 App Router frontend — the public site. Cache Components on; see `web/AGENTS.md` for the rendering strategy.        | `npm run dev:web`    |
| `studio/`       | `lcpsi`                | Sanity Studio — content editing for blog posts, services, and profile copy. Sanity project `c3ikd5qa`, dataset `production`. | `npm run dev:studio` |
| `email-worker/` | `lc-psi-email-worker`  | Cloudflare Worker behind the contact form. Sends mail via Email Routing's `send_email` binding; authenticated with `CONTACT_WORKER_SECRET`. | `npm run dev:worker` |

Each workspace keeps its own `tsconfig.json` and eslint config — they target different runtimes (browser/Next, Studio, workerd) and should not be unified.

## Architecture focus: fast initial load

The frontend is optimized for fast first paint over full-page freshness. Concretely: static shell prerenders (Next.js Cache Components / Partial Prerendering), only genuinely request-time or per-request-fresh content streams in behind `<Suspense>`. Details and rationale: `web/AGENTS.md`.

Sanity content (blog posts, services copy) is fetched with a short revalidation window (`revalidate: 30`), not `"use cache"` — this data is expected to go stale within seconds of an editor publishing in Studio, so it must stream rather than bake into the static shell at build time. Don't move these fetches to a longer-lived cache without checking with the user first; content freshness after publish is a product requirement here, not an oversight.

## E2E tests: no real network

`web/tests/e2e` — Playwright, run via `npm run test:e2e` (root or `web/`). Zero dependency on real Sanity or the real contact worker: a zero-dependency Node stub server stands in for both, and `web/lib/sanity/client.ts` redirects to it via `SANITY_API_HOST` (inert unless set — normal dev/prod untouched). Runs against a real `next build && next start`, not `next dev`, so Cache Components/PPR behavior is genuinely exercised. Stack, rationale, and the `apiHost` gotcha that made this non-trivial: `web/AGENTS.md`.

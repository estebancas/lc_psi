<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Rendering strategy: Cache Components + streamed Sanity content

`cacheComponents: true` is on (`next.config.ts`). Every route prerenders a static shell at build/deploy time; anything reading request-time data or content that can't be baked in streams in behind `<Suspense>`.

**Why Sanity content streams instead of caching into the shell:** `lib/posts.ts` fetches use `{ next: { revalidate: 30 } }`, not `"use cache"`. Blog posts and copy are edited live in Sanity Studio (`studio/`) and expected to reflect within ~30s — a `"use cache"` boundary here would mean a build/redeploy to see edits, defeating the point of a CMS. If you're adding a new Sanity-backed fetch, default to the same `revalidate` pattern, not a cache directive, unless the content is genuinely static (e.g. site chrome, not editorial content).

**Two known sync-IO / request-time reads already handled — copy the pattern, don't regress it:**
- `app/components/Footer.tsx` — copyright year uses `await connection()` inside a `<Suspense>`-wrapped child component, not a bare `new Date()` at module/render scope (sync IO blocks the whole build under Cache Components, even for routes opted out of validation).
- `app/blog/[slug]/page.tsx` — `params` is awaited inside a `<Suspense>`-wrapped child, not at the top of the page body, so `generateStaticParams`-known routes still resolve to a fully static shell at build time (verified: prerendered HTML already contains the real `<h1>`, nothing streams there — only the Footer year streams, sitewide).

Route table check: `next build` should show every route as `◐` (Partial Prerender) with `/blog/[slug]` fully resolved at build time. If a route reverts to blocking (`ƒ`) or a build error names `new Date()`/`Math.random()`/`cookies()`/`headers()` outside `<Suspense>`, that's this pattern breaking — fix inline, don't opt the route out, unless the read is genuinely new and needs its own product decision.

Next.js is pinned to 16.2.x (16.3, needed for Partial Prefetching / `export const instant` tooling, isn't stable yet — only on `canary`). Don't jump to canary without checking with the user; this is a live client site.

## E2E tests: no real network

`tests/e2e/` (Playwright, run via `npm run test:e2e`) never hits real Sanity or the real contact worker. The app makes zero client-side fetches — Sanity queries (`lib/posts.ts`, `lib/services.ts`, `lib/profile.ts`) and the contact worker call (`lib/actions/contact.ts`) all happen server-side, in the Node/Next process — so Playwright's `page.route()` can't intercept any of it; that only sees browser traffic.

Instead, `tests/e2e/serve.mjs` starts a zero-dependency stub HTTP server (`tests/e2e/stub/server.mjs`, fixtures in `tests/e2e/stub/fixtures.mjs`) on `127.0.0.1:4010`, then runs `next build && next start` with env vars pointed at it — real HTTP, fake host, no interception library. This also has to cover build time: `app/blog/[slug]/page.tsx`'s `generateStaticParams()` hits Sanity during `next build`, not just at request time, so the stub must be listening before the build starts (why this is one orchestrator process, not Playwright's `webServer` array, which starts entries concurrently).

The Sanity side needs `lib/sanity/client.ts` to redirect at the local stub via `SANITY_API_HOST` (see `playwright.config.ts`'s `webServer.env`). **`apiHost` alone does not work** — `@sanity/client`'s default `useProjectHostname: true` splices `projectId` in as a subdomain (`http://test.127.0.0.1:4010`, broken). Both `apiHost` and `useProjectHostname: false` have to be set together. Don't "simplify" that pair later without checking `node_modules/@sanity/client/dist/index.browser.js`'s URL-building logic first.

If a client-side fetch gets added to the app in the future, this stub-server approach won't catch it (different runtime) — it'll need `page.route()` in the relevant spec, or a browser-side MSW worker if it grows past a couple of one-offs.

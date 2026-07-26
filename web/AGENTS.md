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

Blog routes (`app/blog/page.tsx`, `app/blog/[slug]/page.tsx`) show a layout-matching skeleton
(`app/components/PostListSkeleton.tsx`, `app/components/PostSkeleton.tsx`) as the `<Suspense>`
fallback whenever they genuinely stream. These stay inline `<Suspense>` boundaries, not
`loading.tsx` — a route-level `loading.js` would truncate prefetch to "layout to first loading
boundary" (client cache TTL off by default) and turn today's fully-static `/blog/[slug]` shell into
a full-page fallback on every navigation. See `node_modules/next/dist/docs/01-app/02-guides/streaming.md`
("When to use `loading.js` vs `<Suspense>`") before converting.

Next.js is pinned to 16.2.x (16.3, needed for Partial Prefetching / `export const instant` tooling, isn't stable yet — only on `canary`). Don't jump to canary without checking with the user; this is a live client site.

## E2E tests

`tests/e2e/` (Playwright, run via `npm run test:e2e`) never hits real Sanity or the real contact worker — see the `e2e-testing` skill (`web/.claude/skills/e2e-testing/`) for the stub-server architecture and the `apiHost` gotcha in `lib/sanity/client.ts`. Same skill also has the locator rule: target by role/label/testid, never a structural CSS path.

## Unit tests

`tests/unit/` (Vitest, run via `npm run test:unit` from the repo root, or `vitest run --project web`) covers `lib/**` — the Sanity query wrappers (`lib/posts.ts`, `lib/services.ts`, `lib/profile.ts`), the contact server action (`lib/actions/contact.ts`), and the Sanity client's `apiHost`/`useProjectHostname` env-gating (`lib/sanity/client.ts`). Plain `environment: "node"`, no DOM/React rendering — that's e2e's job. One regression guard worth knowing about: `tests/unit/sanity-queries.test.ts` asserts every query wrapper passes `{ next: { revalidate: 30 } }`, so a future switch to `"use cache"` on these fetches (see this file's "Rendering strategy" section above) fails loudly here, not silently in prod. See root `AGENTS.md`'s "Unit tests" section for the coverage-provider constraint shared with `email-worker/`.

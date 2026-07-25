---
name: e2e-testing
description: Playwright e2e test architecture for lc-psi's web app — a zero-dependency local stub server stands in for both Sanity and the contact worker, so tests never touch real network. Use when adding or debugging e2e tests, extending stub fixtures, touching tests/e2e/, or wondering why a Sanity/contact-worker fetch isn't reaching the real service during a test run. Also the source of truth for how to target elements in a spec — role/label/testid, never structural CSS paths.
---

`tests/e2e/` (Playwright, run via `npm run test:e2e`) never hits real Sanity or the real contact worker. The app makes zero client-side fetches — Sanity queries (`lib/posts.ts`, `lib/services.ts`, `lib/profile.ts`) and the contact worker call (`lib/actions/contact.ts`) all happen server-side, in the Node/Next process — so Playwright's `page.route()` can't intercept any of it; that only sees browser traffic.

Instead, `tests/e2e/serve.mjs` starts a zero-dependency stub HTTP server (`tests/e2e/stub/server.mjs`, fixtures in `tests/e2e/stub/fixtures.mjs`) on `127.0.0.1:4010`, then runs `next build && next start` with env vars pointed at it — real HTTP, fake host, no interception library. This also has to cover build time: `app/blog/[slug]/page.tsx`'s `generateStaticParams()` hits Sanity during `next build`, not just at request time, so the stub must be listening before the build starts (why this is one orchestrator process, not Playwright's `webServer` array, which starts entries concurrently).

The Sanity side needs `lib/sanity/client.ts` to redirect at the local stub via `SANITY_API_HOST` (see `playwright.config.ts`'s `webServer.env`). **`apiHost` alone does not work** — `@sanity/client`'s default `useProjectHostname: true` splices `projectId` in as a subdomain (`http://test.127.0.0.1:4010`, broken). Both `apiHost` and `useProjectHostname: false` have to be set together — this is also called out as an inline comment at the call site in `lib/sanity/client.ts`, so the warning survives even when this skill isn't loaded. Don't "simplify" that pair later without checking `node_modules/@sanity/client/dist/index.browser.js`'s URL-building logic first.

If a client-side fetch gets added to the app in the future, this stub-server approach won't catch it (different runtime) — it'll need `page.route()` in the relevant spec, or a browser-side MSW worker if it grows past a couple of one-offs.

## Locators

Target elements the way a user or assistive tech would, not by DOM shape. Priority order: `getByRole(name)` first, then `getByLabel` / `getByText`, then `getByTestId` as the fallback. Never `page.locator()` with a structural CSS path — an id used for `scroll-mt-20` anchor nav (`#servicios`, `#blog-preview`), a `div:nth-child(...)` chain, a bare tag (`footer`, `article`), or a class name. All of those break on a refactor that changes nothing about behavior. `getByPlaceholder` doesn't count as accessible either — placeholder text is presentational copy, not a semantic handle; if a field only has a placeholder, that's a product gap, not something to work around in the spec.

Scope to a sectional container first, then find the item inside it, instead of one long selector string:

```ts
const productCard = page.locator('article.product-card');   // ❌ structural path
const productCard = page.getByRole('article', { name: 'Producto X' }); // ✅ scoped by role+name
await productCard.getByRole('button', { name: 'Add to cart' }).click();
```

When nothing accessible fits cleanly, that's a signal to add an explicit contract rather than force a role/text match: give the component a `data-testid` and use `page.getByTestId('submit-checkout-form')`. `playwright.config.ts` sets no `testIdAttribute`, so Playwright's `data-testid` default already applies — no config change needed to start using it.

Repo-specific shapes already in use:
- `<section>` only exposes `role="region"` once it has an accessible name — `Services.tsx` and `BlogPreview.tsx` pair `aria-labelledby` on the section with an `id` on its `<h2>` so `getByRole("region", { name: "Servicios" })` / `"Blog"` work.
- `<footer>` at the layout root is `role="contentinfo"`; `<article>` is `role="article"`. Neither needs an explicit `role` attribute.
- `ContactForm.tsx` pairs each input with a real `<label htmlFor>` styled `sr-only` (visually hidden, still in the accessibility tree) — placeholders stay for sighted users, `getByLabel` is the test hook.
- Making a target reachable this way is part of writing the test, not a follow-up: if a role/label path isn't there, add it (accessible name, real label, or `data-testid`) rather than reaching for a cleverer selector.
- Role names are Spanish — all user-facing copy in this repo is (`AGENTS.md`), so that's what ends up in the accessibility tree.

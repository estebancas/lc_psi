# lc-psi

Site for Laura Castro Cordero, psicóloga. All user-facing text is Spanish — no exceptions.

## Layout

- `web/` — Next.js 16 (App Router) frontend. See `web/AGENTS.md` for its architecture and rendering strategy.
- `studio/` — Sanity Studio, content editing for blog posts and site copy.

## Architecture focus: fast initial load

The frontend is optimized for fast first paint over full-page freshness. Concretely: static shell prerenders (Next.js Cache Components / Partial Prerendering), only genuinely request-time or per-request-fresh content streams in behind `<Suspense>`. Details and rationale: `web/AGENTS.md`.

Sanity content (blog posts, services copy) is fetched with a short revalidation window (`revalidate: 30`), not `"use cache"` — this data is expected to go stale within seconds of an editor publishing in Studio, so it must stream rather than bake into the static shell at build time. Don't move these fetches to a longer-lived cache without checking with the user first; content freshness after publish is a product requirement here, not an oversight.

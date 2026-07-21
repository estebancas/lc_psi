# lc-psi

Hybrid landing page + dynamic blog/content feed for **Laura Castro Cordero**, psicóloga.

## Purpose

- SEO-optimized site to rank in Google searches → drive contact/hire leads.
- Present Laura's psychology services and info.
- Let Laura publish blog posts / short Twitter-like updates herself.

## Language

**All site text content must be in Spanish** (target audience is Spanish-speaking). Code, comments, variable names, commit messages stay in English as usual — only user-facing copy (UI text, blog posts, metadata, SEO titles/descriptions) goes in Spanish.

## Stack

- **Next.js** (App Router, v16 — see note below)
- **Tailwind CSS** (v4)
- **Sanity.io** — headless CMS, planned for blog/posts content. Not wired up yet.

## Status

Bootstrapped via `create-next-app`. No custom pages, components, or Sanity integration built yet.

## Important: Next.js version note

This repo runs **Next.js 16**, which has breaking changes vs. older Next.js knowledge (APIs, conventions, file structure may differ). Before writing Next.js code, check `node_modules/next/dist/docs/` for current APIs and heed deprecation notices. (See `AGENTS.md`.)

## Dev

```bash
npm run dev    # start dev server → http://localhost:3000
npm run build
npm run start
npm run lint
```

## Roadmap (not yet built)

- [ ] Landing page: services, about, contact (SEO metadata, structured data)
- [ ] Sanity.io schema + client setup for blog posts / short updates
- [ ] Blog/feed UI (list + detail pages)
- [ ] Admin/auth flow for Laura to post content (likely via Sanity Studio)
- [ ] Contact form / lead capture

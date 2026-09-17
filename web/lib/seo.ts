import type { Metadata } from "next";

// Shared per-route metadata helpers. Both functions return relative paths
// for `alternates.canonical` and `openGraph.url` — Next composes these
// against `metadataBase` (set once in app/layout.tsx), so the domain never
// needs repeating here.
export const SITE_NAME = "Laura Castro Cordero";
const LOCALE = "es_CR";

// Single source of truth for the canonical domain — app/layout.tsx's
// metadataBase, app/sitemap.ts, and app/robots.ts each used to hardcode this
// string independently. Centralized here so it can't drift.
export const SITE_URL = "https://psicologalauracastro.com";

/** Resolves a route path to an absolute URL against the site's canonical domain. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/**
 * The root layout applies `title.template: "%s | Laura Castro Cordero"` to
 * the document `<title>`, but Next does not apply that template to
 * `openGraph.title` — social previews read the OG tag directly. Use this to
 * keep the two in sync without hardcoding the suffix on every page.
 */
export function withSiteSuffix(title: string): string {
  return `${title} | ${SITE_NAME}`;
}

// Next's file-convention `opengraph-image.png` (app/opengraph-image.png)
// only auto-attaches to a route's resolved metadata when that route doesn't
// define its own `openGraph` object — Next replaces the whole `openGraph`
// field rather than deep-merging it once a segment sets one (verified: a
// child route setting openGraph without `images` measurably drops the
// inherited og:image/twitter:image, even though the file convention is
// still there). Every route below sets its own `openGraph`, so each has to
// re-declare this default explicitly until posts/services get their own
// images (tracked in #25/#26).
const DEFAULT_IMAGE = { url: "/opengraph-image.png", width: 1200, height: 630 };

type PageSeoInput = {
  /** Route path, e.g. "/blog". Resolved against metadataBase. */
  path: string;
  /** Fully resolved title, as it will appear in <title> and social previews — pass through withSiteSuffix(). */
  title: string;
  description: string;
};

/** Canonical URL + `website`-type OpenGraph for a static route. */
export function pageSeo({ path, title, description }: PageSeoInput): Pick<Metadata, "alternates" | "openGraph"> {
  return {
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: LOCALE,
      images: [DEFAULT_IMAGE],
    },
  };
}

type ArticleSeoInput = PageSeoInput & {
  publishedTime: string;
  modifiedTime?: string;
  authorName: string;
};

/** Canonical URL + `article`-type OpenGraph for a blog post. */
export function articleSeo({
  path,
  title,
  description,
  publishedTime,
  modifiedTime,
  authorName,
}: ArticleSeoInput): Pick<Metadata, "alternates" | "openGraph"> {
  return {
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: LOCALE,
      images: [DEFAULT_IMAGE],
      publishedTime,
      modifiedTime,
      authors: [authorName],
    },
  };
}

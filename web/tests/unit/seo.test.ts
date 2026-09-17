import { describe, expect, it } from "vitest";
import { SITE_NAME, SITE_URL, absoluteUrl, articleSeo, pageSeo, withSiteSuffix } from "@/lib/seo";

describe("absoluteUrl", () => {
  it("resolves a relative path against the canonical site domain", () => {
    expect(absoluteUrl("/blog")).toBe(`${SITE_URL}/blog`);
  });

  it("resolves the root path", () => {
    expect(absoluteUrl("/")).toBe(`${SITE_URL}/`);
  });
});

describe("withSiteSuffix", () => {
  it("appends the site name to a page title", () => {
    expect(withSiteSuffix("Blog")).toBe(`Blog | ${SITE_NAME}`);
  });
});

describe("pageSeo", () => {
  it("builds a relative canonical and a website-type OpenGraph object", () => {
    const result = pageSeo({
      path: "/blog",
      title: "Blog | Laura Castro Cordero",
      description: "Artículos y actualizaciones.",
    });

    expect(result.alternates).toEqual({ canonical: "/blog" });
    expect(result.openGraph).toMatchObject({
      type: "website",
      title: "Blog | Laura Castro Cordero",
      description: "Artículos y actualizaciones.",
      url: "/blog",
      siteName: SITE_NAME,
      locale: "es_CR",
    });
  });

  it("includes the site's default OG image, since Next doesn't inherit the file-convention image once a route sets its own openGraph object", () => {
    const result = pageSeo({ path: "/blog", title: "Blog", description: "..." });
    expect((result.openGraph as { images?: unknown[] }).images).toEqual([
      { url: "/opengraph-image.png", width: 1200, height: 630 },
    ]);
  });
});

describe("articleSeo", () => {
  it("builds an article-type OpenGraph object with publish/modified times and an author", () => {
    const result = articleSeo({
      path: "/blog/mi-post",
      title: "Mi post | Laura Castro Cordero",
      description: "Resumen del post.",
      publishedTime: "2026-07-15T00:00:00Z",
      modifiedTime: "2026-08-01T00:00:00Z",
      authorName: SITE_NAME,
    });

    expect(result.alternates).toEqual({ canonical: "/blog/mi-post" });
    expect(result.openGraph).toMatchObject({
      type: "article",
      url: "/blog/mi-post",
      publishedTime: "2026-07-15T00:00:00Z",
      modifiedTime: "2026-08-01T00:00:00Z",
      authors: [SITE_NAME],
    });
  });

  it("omits modifiedTime when not provided, rather than passing an explicit undefined key oddly", () => {
    const result = articleSeo({
      path: "/blog/mi-post",
      title: "Mi post",
      description: "Resumen.",
      publishedTime: "2026-07-15T00:00:00Z",
      authorName: SITE_NAME,
    });

    expect(result.openGraph).toMatchObject({ publishedTime: "2026-07-15T00:00:00Z" });
    expect((result.openGraph as { modifiedTime?: string }).modifiedTime).toBeUndefined();
  });
});

import { test, expect } from "./fixtures";
import { profile, posts } from "./stub/fixtures.mjs";

// JSON-LD blocks aren't reachable via role/label locators (they're inert
// <script> tags), so these read the script content directly and parse it —
// the closest equivalent to targeting by role for this kind of markup.
async function readJsonLd(page: import("@playwright/test").Page, index = 0) {
  const raw = await page.locator('script[type="application/ld+json"]').nth(index).textContent();
  return JSON.parse(raw ?? "null");
}

test.describe("structured data", () => {
  test("home emits a Psychologist + Person + WebSite @graph matching the profile fixture", async ({
    page,
  }) => {
    await page.goto("/");
    const data = await readJsonLd(page);

    expect(data["@context"]).toBe("https://schema.org");
    const graph: Record<string, unknown>[] = data["@graph"];

    const psychologist = graph.find((n) => n["@type"] === "Psychologist");
    expect(psychologist).toMatchObject({ name: profile.name });
    expect(psychologist!.address).toMatchObject({
      "@type": "PostalAddress",
      streetAddress: profile.address.calle,
      addressLocality: profile.address.ciudad,
    });
    expect(psychologist!.geo).toMatchObject({
      "@type": "GeoCoordinates",
      latitude: profile.geo.lat,
      longitude: profile.geo.lng,
    });

    const person = graph.find((n) => n["@type"] === "Person");
    expect(person).toMatchObject({ name: profile.name });

    const website = graph.find((n) => n["@type"] === "WebSite");
    expect(website).toBeTruthy();
  });

  test("a blog post emits a BlogPosting node matching the post fixture", async ({ page }) => {
    const [post] = posts;
    await page.goto(`/blog/${post.slug}`);

    const scripts = page.locator('script[type="application/ld+json"]');
    await expect(scripts).toHaveCount(2);

    const contents = await scripts.allTextContents();
    const parsed = contents.map((c) => JSON.parse(c));
    const blogPosting = parsed.find((n) => n["@type"] === "BlogPosting");

    expect(blogPosting).toMatchObject({
      headline: post.title,
      datePublished: post.date,
    });
  });

  test("/blog emits a 2-item BreadcrumbList", async ({ page }) => {
    await page.goto("/blog");
    const data = await readJsonLd(page);

    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement).toHaveLength(2);
    expect(data.itemListElement[1]).toMatchObject({ position: 2, name: "Blog" });
  });

  test("a blog post emits a 3-item BreadcrumbList ending in the post title", async ({ page }) => {
    const [post] = posts;
    await page.goto(`/blog/${post.slug}`);

    const scripts = page.locator('script[type="application/ld+json"]');
    const contents = await scripts.allTextContents();
    const parsed = contents.map((c) => JSON.parse(c));
    const breadcrumb = parsed.find((n) => n["@type"] === "BreadcrumbList");

    expect(breadcrumb.itemListElement).toHaveLength(3);
    expect(breadcrumb.itemListElement[2]).toMatchObject({ position: 3, name: post.title });
  });
});

import { test, expect } from "./fixtures";
import { posts } from "./stub/fixtures.mjs";

// Each route used to inherit the homepage's canonical-less, root-level
// OpenGraph block wholesale — sharing a blog post looked identical to
// sharing the homepage. These assert every route now carries its own
// self-referencing canonical and the right og:type.
test.describe("per-route metadata", () => {
  test("home has a self-referencing canonical and og:type website", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://psicologalauracastro.com",
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
  });

  test("/blog has its own canonical and title, not the homepage's", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://psicologalauracastro.com/blog",
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /^Blog \|/,
    );
  });

  test("a blog post has og:type article, its own canonical, and article:published_time", async ({
    page,
  }) => {
    const [post] = posts;
    await page.goto(`/blog/${post.slug}`);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://psicologalauracastro.com/blog/${post.slug}`,
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      new RegExp(`^${post.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\|`),
    );
    await expect(page.locator('meta[property="article:published_time"]')).toHaveCount(1);
  });

  test("an unknown post slug is marked noindex instead of inheriting the homepage's metadata", async ({
    page,
  }) => {
    await page.goto("/blog/does-not-exist");
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/,
    );
  });
});

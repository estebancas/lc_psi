import { test, expect } from "./fixtures";
import { posts, postsBySlug } from "./stub/fixtures.mjs";

test.describe("blog", () => {
  test("lists every fixture post", async ({ page }) => {
    await page.goto("/blog");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Blog");
    for (const post of posts) {
      await expect(page.getByText(post.title)).toBeVisible();
    }
  });

  test("navigates to a post detail page", async ({ page }) => {
    const [firstPost] = posts;
    await page.goto("/blog");

    await page.getByText(firstPost.title).click();

    await expect(page).toHaveURL(`/blog/${firstPost.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(firstPost.title);
    const detail = postsBySlug[firstPost.slug];
    await expect(page.getByRole("article")).toContainText(detail.body[0].children[0].text);
  });

  test("404s on an unknown slug", async ({ page }) => {
    // Not asserting response.status() here: under Cache Components/PPR, the
    // static <article> shell's 200 headers are already flushed before
    // BlogPostContent's Suspense boundary resolves and calls notFound(), so
    // the HTTP status stays 200 even though the correct not-found UI renders
    // (verified: page shows Next's default "404" / "This page could not be
    // found." headings). Assert on rendered content instead.
    await page.goto("/blog/does-not-exist");
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "This page could not be found." }),
    ).toBeVisible();
  });
});

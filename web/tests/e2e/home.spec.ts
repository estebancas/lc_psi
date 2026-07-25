import { test, expect } from "./fixtures";
import { profile, services, posts } from "./stub/fixtures.mjs";

test.describe("home page", () => {
  test("renders hero, services, and blog preview from the stub fixtures", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(profile.heroTitle);

    const servicesSection = page.getByRole("region", { name: "Servicios" });
    for (const service of services) {
      await expect(servicesSection.getByText(service.title)).toBeVisible();
    }

    const blogPreview = page.getByRole("region", { name: "Blog" });
    for (const post of posts.slice(0, 3)) {
      await expect(blogPreview.getByText(post.title)).toBeVisible();
    }
    // Type label branch: at least one of each kind in the fixture. Two posts
    // are "articulo" in the fixture, so .first() avoids a strict-mode
    // violation on the duplicate match.
    await expect(blogPreview.getByText("Artículo").first()).toBeVisible();
    await expect(blogPreview.getByText("Actualización").first()).toBeVisible();
  });

  test("streams the footer copyright year behind Suspense", async ({ page }) => {
    await page.goto("/");

    const year = String(new Date().getFullYear());
    const footer = page.getByRole("contentinfo");
    await expect(footer).toContainText(year);
    await expect(footer).toContainText(profile.name);
  });
});

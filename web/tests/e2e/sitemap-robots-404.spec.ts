import { test, expect } from "./fixtures";
import { posts } from "./stub/fixtures.mjs";

test.describe("robots.txt and sitemap.xml", () => {
  test("robots.txt allows crawling and points at the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.ok()).toBe(true);
    const body = await response.text();
    expect(body).toContain("Allow: /");
    expect(body).toContain("Sitemap: https://psicologalauracastro.com/sitemap.xml");
  });

  test("sitemap.xml lists the static routes and every fixture post", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);
    const body = await response.text();

    for (const path of ["https://psicologalauracastro.com", "/blog", "/agendar"]) {
      expect(body).toContain(path);
    }
    for (const post of posts) {
      expect(body).toContain(`/blog/${post.slug}`);
    }
  });
});

test.describe("catch-all 404", () => {
  test("an unmatched route shows the Spanish not-found page, not Next's English default", async ({
    page,
  }) => {
    await page.goto("/this-route-does-not-exist-at-all");

    await expect(page.getByRole("heading", { name: "Página no encontrada" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Volver al inicio" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ver el blog" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Agendar una cita" })).toBeVisible();
  });
});

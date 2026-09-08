import { test, expect } from "./fixtures";

test.describe("agendar page", () => {
  test("header Agendar button (desktop) links to /agendar", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("banner")
      .getByRole("link", { name: "Agendar", exact: true })
      .click();
    await expect(page).toHaveURL("/agendar");
  });

  test("header Agendar button (mobile menu) links to /agendar", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByTestId("mobile-menu-toggle").click();
    await page
      .getByRole("banner")
      .getByRole("link", { name: "Agendar", exact: true })
      .click();
    await expect(page).toHaveURL("/agendar");
  });

  test("renders the booking iframe and a contact fallback link", async ({ page }) => {
    await page.goto("/agendar");

    await expect(page.getByRole("heading", { level: 1, name: "Agendar una cita" })).toBeVisible();
    await expect(page.frameLocator("iframe").locator("body")).toContainText("stub booking");
    await expect(page.getByRole("link", { name: "ir a la sección de contacto" })).toHaveAttribute(
      "href",
      "/#contacto",
    );
  });
});

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

  test("renders a contact fallback link and opens the booking calendar in a new tab", async ({
    page,
    context,
  }) => {
    await page.goto("/agendar");

    await expect(page.getByRole("heading", { level: 1, name: "Agendar una cita" })).toBeVisible();
    await expect(page.getByRole("link", { name: "ir a la sección de contacto" })).toHaveAttribute(
      "href",
      "/#contacto",
    );

    const bookingLink = page.getByRole("link", { name: "Abrir calendario y agendar" });
    await expect(bookingLink).toHaveAttribute("target", "_blank");

    const [popup] = await Promise.all([context.waitForEvent("page"), bookingLink.click()]);
    await popup.waitForLoadState();
    await expect(popup.getByText("stub booking calendar")).toBeVisible();
  });
});

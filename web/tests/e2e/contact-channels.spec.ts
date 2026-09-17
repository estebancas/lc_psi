import { test, expect } from "./fixtures";
import { profile } from "./stub/fixtures.mjs";

// Regression coverage for a dead WhatsApp link: profile.whatsapp must reach
// the page as a full international number (country code + number, no
// separators) since https://wa.me/<number> silently fails — showing a
// generic "start chatting" screen instead of Laura's contact — when the
// country code is missing.
test.describe("contact channel links", () => {
  test("WhatsApp, phone, and email links use the full contact values", async ({ page }) => {
    await page.goto("/#contacto");

    await expect(page.getByRole("link", { name: /WhatsApp/i })).toHaveAttribute(
      "href",
      `https://wa.me/${profile.whatsapp}`,
    );
    // tel: URIs must not contain whitespace, even though profile.phone is
    // stored in a human-readable, space-separated format for display.
    await expect(page.getByRole("link", { name: profile.phone })).toHaveAttribute(
      "href",
      `tel:${profile.phone.replace(/\s+/g, "")}`,
    );
    await expect(page.getByRole("link", { name: profile.email })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
  });

  // NAP (Name/Address/Phone) consistency: the address rendered on-page must
  // match the JSON-LD (see structured-data.spec.ts) and link out to the same
  // coordinates, not just to a text search.
  test("the consultorio address is visible and links to the coordinates on Google Maps", async ({
    page,
  }) => {
    await page.goto("/#contacto");

    const addressLink = page.getByRole("link", { name: new RegExp(profile.address.calle) });
    await expect(addressLink).toBeVisible();
    await expect(addressLink).toHaveAttribute(
      "href",
      `https://www.google.com/maps?q=${profile.geo.lat},${profile.geo.lng}`,
    );
  });
});

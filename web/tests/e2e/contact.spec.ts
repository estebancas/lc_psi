import { test, expect } from "./fixtures";

async function fillContactForm(
  page: import("@playwright/test").Page,
  values: { nombre: string; email: string; mensaje: string },
) {
  await page.getByPlaceholder("Nombre").fill(values.nombre);
  await page.getByPlaceholder("Correo electrónico").fill(values.email);
  await page.getByPlaceholder("Mensaje").fill(values.mensaje);
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
}

test.describe("contact form", () => {
  test("happy path replaces the form with a thank-you message", async ({ page }) => {
    await page.goto("/#contacto");

    await fillContactForm(page, {
      nombre: "Ana Pérez",
      email: "ana@example.com",
      mensaje: "Quisiera agendar una consulta.",
    });

    await expect(
      page.getByText("¡Gracias por tu mensaje! Te responderé pronto."),
    ).toBeVisible();
    await expect(page.getByPlaceholder("Nombre")).toHaveCount(0);
  });

  test("worker error keeps the form and echoes back typed values", async ({ page }) => {
    await page.goto("/#contacto");

    await fillContactForm(page, {
      nombre: "Beto Gómez",
      email: "error@test.com",
      mensaje: "Este envío debería fallar.",
    });

    await expect(page.getByText("No se pudo enviar el mensaje")).toBeVisible();
    await expect(page.getByPlaceholder("Nombre")).toHaveValue("Beto Gómez");
    await expect(page.getByPlaceholder("Mensaje")).toHaveValue("Este envío debería fallar.");
  });

  test("worker 401 shows the generic message, not the auth detail", async ({ page }) => {
    await page.goto("/#contacto");

    await fillContactForm(page, {
      nombre: "Carla Ruiz",
      email: "unauthorized@test.com",
      mensaje: "Otro intento.",
    });

    await expect(page.getByText("No se pudo enviar el mensaje")).toBeVisible();
    await expect(page.getByText("No autorizado")).toHaveCount(0);
  });
});

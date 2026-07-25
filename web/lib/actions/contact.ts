"use server";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  // Echoed back on error so the form doesn't wipe what the user typed.
  values?: { nombre: string; email: string; mensaje: string };
};

const GENERIC_ERROR = "No se pudo enviar el mensaje";
const UNAVAILABLE_ERROR = "El formulario no está disponible en este momento.";

export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    nombre: String(formData.get("nombre") ?? ""),
    email: String(formData.get("email") ?? ""),
    mensaje: String(formData.get("mensaje") ?? ""),
  };

  // Read at request time (inside the action), not module scope — under
  // cacheComponents module scope is evaluated during prerender, which would
  // bake an empty/build-time value in instead of the real runtime config.
  const workerUrl = process.env.CONTACT_WORKER_URL;
  const workerSecret = process.env.CONTACT_WORKER_SECRET;

  if (!workerUrl || !workerSecret) {
    console.error("CONTACT_WORKER_URL or CONTACT_WORKER_SECRET is not configured");
    return { status: "error", message: UNAVAILABLE_ERROR, values };
  }

  try {
    const response = await fetch(`${workerUrl}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Contact-Secret": workerSecret,
      },
      body: JSON.stringify(values),
      cache: "no-store",
    });

    if (!response.ok) {
      // A 401 here means our own secret is misconfigured, not something the
      // visitor did — don't leak that detail, just log and show the generic
      // message.
      if (response.status === 401) {
        console.error("Contact worker rejected our secret (401)");
        return { status: "error", message: GENERIC_ERROR, values };
      }

      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      return { status: "error", message: body?.error || GENERIC_ERROR, values };
    }

    return { status: "success" };
  } catch (error) {
    console.error("Error calling contact worker:", error);
    return { status: "error", message: GENERIC_ERROR, values };
  }
}

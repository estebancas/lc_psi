import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submitContact, type ContactState } from "@/lib/actions/contact";

const initialState: ContactState = { status: "idle" };

function formData(values: Partial<{ nombre: string; email: string; mensaje: string }> = {}) {
  const fd = new FormData();
  if (values.nombre !== undefined) fd.set("nombre", values.nombre);
  if (values.email !== undefined) fd.set("email", values.email);
  if (values.mensaje !== undefined) fd.set("mensaje", values.mensaje);
  return fd;
}

const validValues = { nombre: "Ana", email: "ana@example.com", mensaje: "Hola" };

describe("submitContact", () => {
  const originalEnv = { ...process.env };
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    process.env.CONTACT_WORKER_URL = "https://worker.example";
    process.env.CONTACT_WORKER_SECRET = "test-secret";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = { ...originalEnv };
  });

  describe("missing configuration", () => {
    it("returns the unavailable message and never calls fetch when both env vars are missing", async () => {
      delete process.env.CONTACT_WORKER_URL;
      delete process.env.CONTACT_WORKER_SECRET;
      const result = await submitContact(initialState, formData(validValues));
      expect(result.status).toBe("error");
      expect(result.message).toBe("El formulario no está disponible en este momento.");
      expect(result.values).toEqual(validValues);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("returns the unavailable message when only CONTACT_WORKER_URL is set", async () => {
      delete process.env.CONTACT_WORKER_SECRET;
      const result = await submitContact(initialState, formData(validValues));
      expect(result.status).toBe("error");
      expect(result.message).toBe("El formulario no está disponible en este momento.");
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("returns the unavailable message when only CONTACT_WORKER_SECRET is set", async () => {
      delete process.env.CONTACT_WORKER_URL;
      const result = await submitContact(initialState, formData(validValues));
      expect(result.status).toBe("error");
      expect(result.message).toBe("El formulario no está disponible en este momento.");
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("request shape", () => {
    it("posts to <workerUrl>/contact with the secret header, JSON body, and no-store cache", async () => {
      fetchMock.mockResolvedValue(new Response(null, { status: 200 }));
      await submitContact(initialState, formData(validValues));

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("https://worker.example/contact");
      expect(init.method).toBe("POST");
      expect(init.headers["Content-Type"]).toBe("application/json");
      expect(init.headers["X-Contact-Secret"]).toBe("test-secret");
      expect(init.cache).toBe("no-store");
      expect(JSON.parse(init.body)).toEqual(validValues);
    });

    it("defaults missing form fields to empty strings, never the literal 'null'/'undefined'", async () => {
      fetchMock.mockResolvedValue(new Response(null, { status: 200 }));
      await submitContact(initialState, formData({}));
      const [, init] = fetchMock.mock.calls[0];
      expect(JSON.parse(init.body)).toEqual({ nombre: "", email: "", mensaje: "" });
    });

    it("carries unicode and newlines through to the JSON body untouched", async () => {
      fetchMock.mockResolvedValue(new Response(null, { status: 200 }));
      const values = { nombre: "José Ángel", email: "jose@example.com", mensaje: "Línea uno\nLínea dos — ¿cómo estás?" };
      await submitContact(initialState, formData(values));
      const [, init] = fetchMock.mock.calls[0];
      expect(JSON.parse(init.body)).toEqual(values);
    });
  });

  describe("responses", () => {
    it("returns success with no echoed values on 200 (so the form clears)", async () => {
      fetchMock.mockResolvedValue(new Response(null, { status: 200 }));
      const result = await submitContact(initialState, formData(validValues));
      expect(result).toEqual({ status: "success" });
    });

    it("returns the generic message on 401, even if the body carries a specific error, and echoes values", async () => {
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ error: "Secreto incorrecto en el servidor" }), { status: 401 }),
      );
      const result = await submitContact(initialState, formData(validValues));
      expect(result.status).toBe("error");
      expect(result.message).toBe("No se pudo enviar el mensaje");
      expect(result.values).toEqual(validValues);
    });

    it("surfaces a specific error message from a non-401 error body", async () => {
      fetchMock.mockResolvedValue(new Response(JSON.stringify({ error: "Correo electrónico inválido" }), { status: 400 }));
      const result = await submitContact(initialState, formData(validValues));
      expect(result.message).toBe("Correo electrónico inválido");
    });

    it("falls back to the generic message when the error body isn't valid JSON", async () => {
      fetchMock.mockResolvedValue(new Response("<html>Internal Server Error</html>", { status: 500 }));
      const result = await submitContact(initialState, formData(validValues));
      expect(result.message).toBe("No se pudo enviar el mensaje");
    });

    it("falls back to the generic message when error is an empty string", async () => {
      fetchMock.mockResolvedValue(new Response(JSON.stringify({ error: "" }), { status: 500 }));
      const result = await submitContact(initialState, formData(validValues));
      expect(result.message).toBe("No se pudo enviar el mensaje");
    });

    it("falls back to the generic message when the error body has no error field", async () => {
      fetchMock.mockResolvedValue(new Response(JSON.stringify({}), { status: 500 }));
      const result = await submitContact(initialState, formData(validValues));
      expect(result.message).toBe("No se pudo enviar el mensaje");
    });

    it("returns the generic message when fetch itself rejects (network error)", async () => {
      fetchMock.mockRejectedValue(new TypeError("fetch failed"));
      const result = await submitContact(initialState, formData(validValues));
      expect(result.status).toBe("error");
      expect(result.message).toBe("No se pudo enviar el mensaje");
      expect(result.values).toEqual(validValues);
    });
  });
});

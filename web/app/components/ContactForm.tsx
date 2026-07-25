"use client";

import { useState, type FormEvent } from "react";

const WORKER_URL = process.env.NEXT_PUBLIC_CONTACT_WORKER_URL;

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!WORKER_URL) {
      setStatus("error");
      setErrorMessage("El formulario no está disponible en este momento.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      nombre: String(formData.get("nombre") ?? ""),
      email: String(formData.get("email") ?? ""),
      mensaje: String(formData.get("mensaje") ?? ""),
    };

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch(`${WORKER_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || "No se pudo enviar el mensaje");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "No se pudo enviar el mensaje");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-lg border border-black/15 px-4 py-6 text-sm dark:border-white/20">
        ¡Gracias por tu mensaje! Te responderé pronto.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        required
        disabled={status === "sending"}
        className="rounded-lg border border-black/15 bg-transparent px-4 py-3 text-sm dark:border-white/20"
      />
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        required
        disabled={status === "sending"}
        className="rounded-lg border border-black/15 bg-transparent px-4 py-3 text-sm dark:border-white/20"
      />
      <textarea
        name="mensaje"
        placeholder="Mensaje"
        rows={4}
        required
        disabled={status === "sending"}
        className="rounded-lg border border-black/15 bg-transparent px-4 py-3 text-sm dark:border-white/20"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-foreground px-6 py-3 text-sm text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {status === "sending" ? "Enviando..." : "Enviar mensaje"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
    </form>
  );
}

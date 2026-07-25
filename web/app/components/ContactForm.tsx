"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/lib/actions/contact";

const initialState: ContactState = { status: "idle" };

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <p className="rounded-lg border border-black/15 px-4 py-6 text-sm dark:border-white/20">
        ¡Gracias por tu mensaje! Te responderé pronto.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        required
        disabled={isPending}
        defaultValue={state.values?.nombre}
        className="rounded-lg border border-black/15 bg-transparent px-4 py-3 text-sm dark:border-white/20"
      />
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        required
        disabled={isPending}
        defaultValue={state.values?.email}
        className="rounded-lg border border-black/15 bg-transparent px-4 py-3 text-sm dark:border-white/20"
      />
      <textarea
        name="mensaje"
        placeholder="Mensaje"
        rows={4}
        required
        disabled={isPending}
        defaultValue={state.values?.mensaje}
        className="rounded-lg border border-black/15 bg-transparent px-4 py-3 text-sm dark:border-white/20"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-foreground px-6 py-3 text-sm text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Enviar mensaje"}
      </button>
      {state.status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
      )}
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/lib/actions/contact";

const initialState: ContactState = { status: "idle" };

const fieldClass =
  "border-[1.5px] border-ink bg-transparent px-4 py-3 text-sm placeholder:text-ink-35 focus:outline-none";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <p className="tile-2 p-6 text-sm">¡Gracias por tu mensaje! Te responderé pronto.</p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label htmlFor="contact-nombre" className="sr-only">
        Nombre
      </label>
      <input
        id="contact-nombre"
        type="text"
        name="nombre"
        placeholder="Nombre"
        required
        disabled={isPending}
        defaultValue={state.values?.nombre}
        className={fieldClass}
      />
      <label htmlFor="contact-email" className="sr-only">
        Correo electrónico
      </label>
      <input
        id="contact-email"
        type="email"
        name="email"
        placeholder="Correo electrónico"
        required
        disabled={isPending}
        defaultValue={state.values?.email}
        className={fieldClass}
      />
      <label htmlFor="contact-mensaje" className="sr-only">
        Mensaje
      </label>
      <textarea
        id="contact-mensaje"
        name="mensaje"
        placeholder="Mensaje"
        rows={4}
        required
        disabled={isPending}
        defaultValue={state.values?.mensaje}
        className={fieldClass}
      />
      <button
        type="submit"
        disabled={isPending}
        className="pill pill--solid disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Enviar mensaje"}
      </button>
      {state.status === "error" && (
        <p className="text-sm text-red-700">{state.message}</p>
      )}
    </form>
  );
}

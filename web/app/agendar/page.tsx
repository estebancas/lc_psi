import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agendar una cita | Laura Castro Cordero",
  description: "Agenda una cita con Laura Castro Cordero directamente desde Google Calendar.",
};

// Falls back to a placeholder until Laura's real Google Appointment
// Scheduler link/embed arrives (see issue #13's "open items").
const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "https://calendar.google.com/";

export default function AgendarPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-[var(--space-section)]">
      <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase">
        Agendar una cita
      </h1>
      <p className="mt-4 max-w-xl text-ink-60">
        Elige el horario que mejor te acomode desde el calendario de disponibilidad. Si prefieres
        escribir antes de agendar, también puedes{" "}
        <Link href="/#contacto" className="ink-underline">
          ir a la sección de contacto
        </Link>
        .
      </p>

      <div className="mt-10 border border-ink bg-paper shadow-[4px_4px_0_0_var(--ink)]">
        <iframe
          src={bookingUrl}
          title="Calendario de disponibilidad para agendar una cita"
          className="h-[720px] w-full"
          frameBorder={0}
        />
      </div>

      <p className="mt-6 text-sm text-ink-60">
        ¿El calendario no carga bien en tu navegador?{" "}
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="ink-underline">
          Ábrelo en una pestaña nueva
        </a>
        .
      </p>
    </section>
  );
}

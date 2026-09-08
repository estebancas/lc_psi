import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agendar una cita | Laura Castro Cordero",
  description: "Agenda una cita con Laura Castro Cordero directamente desde Google Calendar.",
};

// Falls back to a placeholder until Laura's real Google Appointment
// Scheduler link arrives (see issue #13's "open items"). Google's booking
// pages send X-Frame-Options: sameorigin, so this can't be embedded in an
// iframe — it opens in a new tab instead.
const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "https://calendar.google.com/";

export default function AgendarPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-[var(--space-section)]">
      <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase">
        Agendar una cita
      </h1>
      <p className="mt-4 max-w-xl text-ink-60">
        Abre el calendario de disponibilidad de Laura para elegir el horario que mejor te acomode.
        Se abrirá en una pestaña nueva de Google Calendar. Si prefieres escribir antes de agendar,
        también puedes{" "}
        <Link href="/#contacto" className="ink-underline">
          ir a la sección de contacto
        </Link>
        .
      </p>

      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pill pill--solid mt-10 inline-flex px-6 py-3 text-sm"
      >
        Abrir calendario y agendar
      </a>
    </section>
  );
}

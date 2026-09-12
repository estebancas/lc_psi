import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import type { Metadata } from "next";
import { pageSeo, withSiteSuffix } from "@/lib/seo";

const TITLE = "Agendar una cita";
const DESCRIPTION = "Agenda una cita con Laura Castro Cordero directamente desde Google Calendar.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  ...pageSeo({ path: "/agendar", title: withSiteSuffix(TITLE), description: DESCRIPTION }),
};

// Read at request time via connection(), not module scope — under Cache
// Components module scope evaluates during the build-time prerender, which
// has no access to the Cloudflare Worker's runtime env vars and would bake
// in the placeholder permanently. No NEXT_PUBLIC_ prefix: this is
// server-only (never sent to the client bundle), same as CONTACT_WORKER_URL.
//
// Falls back to a placeholder until Laura's real Google Appointment
// Scheduler link arrives (see issue #13's "open items"). Google's booking
// pages send X-Frame-Options: sameorigin, so this can't be embedded in an
// iframe — it opens in a new tab instead.
async function BookingLink() {
  await connection();
  const bookingUrl = process.env.BOOKING_URL || "https://calendar.google.com/";

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="pill pill--solid mt-10 inline-flex px-6 py-3 text-sm"
    >
      Abrir calendario y agendar
    </a>
  );
}

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

      <Suspense fallback={null}>
        <BookingLink />
      </Suspense>
    </section>
  );
}

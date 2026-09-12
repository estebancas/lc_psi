import Link from "next/link";
import type { Metadata } from "next";

// Next's default not-found UI is English ("404" / "This page could not be
// found.") — this file overrides it for every route, per AGENTS.md's
// Spanish-only rule.
export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-[var(--space-section)] text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="font-display mt-3 text-[clamp(1.75rem,4vw,2.75rem)] uppercase">
        Página no encontrada
      </h1>
      <p className="mt-4 text-ink-60">
        La página que buscas no existe o fue movida. Puedes volver al inicio, leer el blog o
        agendar una cita.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="pill pill--solid px-6 py-3 text-sm">
          Volver al inicio
        </Link>
        <Link href="/blog" className="ink-underline text-sm">
          Ver el blog
        </Link>
        <Link href="/agendar" className="ink-underline text-sm">
          Agendar una cita
        </Link>
      </div>
    </section>
  );
}

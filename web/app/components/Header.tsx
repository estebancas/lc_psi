import Link from "next/link";
import { getProfile } from "@/lib/profile";

const links = [
  { label: "Inicio", href: "/" },
  { label: "Sobre mí", href: "/#sobre-mi" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/#contacto" },
];

export default async function Header() {
  const profile = await getProfile();
  const name = profile?.name || "Laura Castro Cordero";

  return (
    <header className="ink-rule sticky top-0 z-50 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg">
          {name}
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="ink-underline">
              {link.label}
            </Link>
          ))}
          <Link href="/#contacto" className="pill pill--solid px-5 py-2.5 text-sm">
            Agendar
          </Link>
        </nav>

        <details className="relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center p-1 [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Menú</span>
            <svg viewBox="0 0 28 20" className="ink-mark h-5 w-7" aria-hidden="true">
              <path d="M2,2 L26,3" />
              <path d="M2,10 L22,10" />
              <path d="M2,18 L26,17" />
            </svg>
          </summary>
          <nav className="ink-rule absolute right-0 mt-3 flex w-48 flex-col gap-4 border border-ink bg-paper p-5 text-sm shadow-[4px_4px_0_0_var(--ink)]">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="ink-underline">
                {link.label}
              </Link>
            ))}
            <Link href="/#contacto" className="pill pill--solid py-2.5 text-sm">
              Agendar
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

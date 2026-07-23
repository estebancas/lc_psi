import Link from "next/link";

const links = [
  { label: "Inicio", href: "/" },
  { label: "Sobre mí", href: "/#sobre-mi" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/#contacto" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[var(--background)]/90 backdrop-blur dark:border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold">
          Laura Castro Cordero
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:opacity-70">
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contacto"
            className="rounded-full bg-foreground px-4 py-2 text-background transition-opacity hover:opacity-80"
          >
            Agendar
          </Link>
        </nav>

        <details className="md:hidden">
          <summary className="cursor-pointer list-none text-sm">Menú</summary>
          <nav className="absolute right-6 mt-2 flex flex-col gap-3 rounded-lg border border-black/10 bg-[var(--background)] p-4 text-sm shadow-lg dark:border-white/10">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:opacity-70">
                {link.label}
              </Link>
            ))}
            <Link href="/#contacto" className="font-medium">
              Agendar
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

import Link from "next/link";
import { getProfile } from "@/lib/profile";
import MobileNav from "./MobileNav";

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
          <Link href="/agendar" className="pill pill--solid px-5 py-2.5 text-sm">
            Agendar
          </Link>
        </nav>

        <MobileNav links={links} />
      </div>
    </header>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";

export default function MobileNav({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const close = () => {
    if (detailsRef.current) detailsRef.current.open = false;
  };

  return (
    <details ref={detailsRef} className="relative md:hidden">
      <summary
        data-testid="mobile-menu-toggle"
        className="flex cursor-pointer list-none items-center p-1 [&::-webkit-details-marker]:hidden"
      >
        <span className="sr-only">Menú</span>
        <svg viewBox="0 0 28 20" className="ink-mark h-5 w-7" aria-hidden="true">
          <path d="M2,2 L26,3" />
          <path d="M2,10 L22,10" />
          <path d="M2,18 L26,17" />
        </svg>
      </summary>
      <nav className="ink-rule absolute right-0 mt-3 flex w-48 flex-col gap-4 border border-ink bg-paper p-5 text-sm shadow-[4px_4px_0_0_var(--ink)]">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="ink-underline" onClick={close}>
            {link.label}
          </Link>
        ))}
        <Link href="/agendar" className="pill pill--solid py-2.5 text-sm" onClick={close}>
          Agendar
        </Link>
      </nav>
    </details>
  );
}

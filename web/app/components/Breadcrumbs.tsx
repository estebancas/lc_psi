import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/schema";

// Visible breadcrumb trail. Pass the same `items` array to buildBreadcrumbSchema()
// at the call site so the visible markup and the JSON-LD can never drift apart.
export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-ink-60">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {isLast ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.path} className="ink-underline">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

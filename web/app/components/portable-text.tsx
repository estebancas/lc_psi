import type { PortableTextComponents } from "@portabletext/react";

// Shared rich-text styling for Sanity block content (bio, blog posts).
// `.prose` was a no-op — `@tailwindcss/typography` was never installed — so
// headings, lists, and links rendered with only Preflight applied. This
// replaces it with explicit components in the site's own type system
// instead of pulling in the typography plugin.
export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-display mt-10 text-2xl first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display mt-8 text-xl first:mt-0">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mt-4 leading-relaxed text-ink-60 first:mt-0">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="ink-rule mt-6 pt-4 italic text-ink">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 flex flex-col gap-2 text-ink-60">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 flex list-decimal flex-col gap-2 pl-5 text-ink-60">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3 leading-relaxed">
        <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ink" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="ink-underline font-medium text-ink"
      >
        {children}
      </a>
    ),
  },
};

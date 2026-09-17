// Renders a JSON-LD structured-data block. JSON.stringify does not sanitize
// XSS payloads on its own, so any "<" in editor-authored strings (profile
// bio, post titles, etc.) is escaped to its unicode equivalent before the
// script tag is written — see
// node_modules/next/dist/docs/01-app/02-guides/json-ld.md.
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

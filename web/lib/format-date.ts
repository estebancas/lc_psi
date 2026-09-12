// Shared Spanish (Costa Rica) date formatting for Sanity `publishedAt`
// values. Kept as a module-scope Intl.DateTimeFormat instance — this is
// pure, deterministic formatting of a value passed in by the caller, not a
// sync-IO read like `new Date()`/`Date.now()`, so it's safe to use from
// anywhere, including inside a prerendered static shell under Cache
// Components (see web/AGENTS.md).
const formatter = new Intl.DateTimeFormat("es-CR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Formats an ISO date/datetime string (Sanity `publishedAt`) as a
 * human-readable Spanish date, e.g. "15 de julio de 2026". Fixed to UTC so
 * a date-only Sanity value (parsed as UTC midnight) renders the same day
 * regardless of the server's local timezone.
 */
export function formatDate(iso: string): string {
  return formatter.format(new Date(iso));
}

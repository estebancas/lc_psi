import { describe, expect, it } from "vitest";
import { formatDate } from "@/lib/format-date";

describe("formatDate", () => {
  it("formats a date-only ISO string as a long Spanish (Costa Rica) date", () => {
    expect(formatDate("2026-07-15")).toBe("15 de julio de 2026");
  });

  it("formats a full ISO datetime string on the same UTC day", () => {
    expect(formatDate("2026-09-02T21:24:00.000Z")).toBe("2 de septiembre de 2026");
  });

  it("stays on the UTC calendar day regardless of the host's local timezone", () => {
    // A near-midnight UTC timestamp would roll to the previous/next day if
    // the formatter used the host's local timezone instead of a fixed UTC.
    expect(formatDate("2026-01-01T00:30:00.000Z")).toBe("1 de enero de 2026");
  });
});

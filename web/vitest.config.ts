import { defineProject } from "vitest/config";
import path from "node:path";

// Plain Node environment: everything under test here is server-side TS
// (data-fetch wrappers, the contact server action, Sanity client config) —
// no React rendering, no DOM. Component/streaming behavior is e2e's job
// (tests/e2e/, see AGENTS.md's Cache Components section).
export default defineProject({
  test: {
    name: "web",
    root: __dirname,
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    // tests/e2e is Playwright-only — never let Vitest try to collect it.
    exclude: ["tests/e2e/**", "node_modules/**"],
    // lib/sanity/client.ts reads these at module scope (createClient() runs
    // on import), so they need to exist before any test file's top-level
    // imports run — a per-test beforeEach is too late for that first import.
    // sanity-client.test.ts overrides these per-test via its own
    // resetModules + dynamic import for the cases that vary the value.
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: "c3ikd5qa",
      NEXT_PUBLIC_SANITY_DATASET: "production",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});

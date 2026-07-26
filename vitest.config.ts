import { defineConfig } from "vitest/config";

// Root config only fans out to per-workspace projects. Coverage provider is
// pinned to istanbul (not the v8 default) at this top level because
// @cloudflare/vitest-pool-workers does not support native V8 coverage — see
// email-worker/vitest.config.ts and AGENTS.md. A single Vitest run has one
// coverage provider shared across all projects, so it has to be set here,
// not per-project.
export default defineConfig({
  test: {
    projects: ["./web/vitest.config.ts", "./email-worker/vitest.config.ts"],
    coverage: {
      provider: "istanbul",
      reporter: ["text-summary", "json-summary", "html"],
      reportsDirectory: "./coverage",
      include: ["web/lib/**/*.ts", "email-worker/src/**/*.ts"],
      exclude: ["**/*.d.ts", "**/tests/**", "**/*.config.*"],
    },
  },
});

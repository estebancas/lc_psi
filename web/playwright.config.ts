import { defineConfig, devices } from "@playwright/test";

// e2e runs against a production build, pointed at the local stub server
// (tests/e2e/stub/server.mjs) instead of real Sanity / the contact worker —
// see AGENTS.md "E2E tests: no real network" for why. All of it starts
// through one orchestrator process (tests/e2e/serve.mjs) so the stub is
// guaranteed live before `next build` runs (blog/[slug]'s
// generateStaticParams hits Sanity at build time).
//
// Note on env precedence: web/.env.local holds the real project ID and
// worker URL for local dev, but it defines no SANITY_API_HOST — and Next
// does not let .env files override variables already present in
// process.env — so the stub host below always wins here regardless.
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Flakiness here should fail loudly, not get papered over by a retry —
  // that's the whole point of removing the network dependency.
  retries: 0,
  reporter: [["html", { open: "on-failure" }]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    // retries: 0 means "on-first-retry" would never fire — capture on
    // failure directly instead, and drop the artifact for passing tests.
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "node tests/e2e/serve.mjs",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000, // next build can take a while
    // Playwright's default silently swallows webServer stdout — pipe it so
    // `next build`'s route table (the ◐/ƒ check in AGENTS.md) is visible.
    stdout: "pipe",
    stderr: "pipe",
    env: {
      SANITY_API_HOST: "http://127.0.0.1:4010",
      NEXT_PUBLIC_SANITY_PROJECT_ID: "test",
      NEXT_PUBLIC_SANITY_DATASET: "test",
      CONTACT_WORKER_URL: "http://127.0.0.1:4010/worker",
      CONTACT_WORKER_SECRET: "test-secret",
    },
  },
});

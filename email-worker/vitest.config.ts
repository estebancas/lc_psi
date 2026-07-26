import { defineConfig } from "vitest/config";
import { cloudflareTest } from "@cloudflare/vitest-pool-workers";

// Runs tests inside real workerd (Miniflare), not a Node shim — the worker
// imports `cloudflare:email` and needs `nodejs_compat` for mimetext, neither
// of which exist under plain Node. Coverage here is istanbul-only: v8
// coverage isn't supported under this pool (root vitest.config.ts sets the
// provider globally for this reason).
export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.jsonc" },
    }),
  ],
  test: {
    name: "email-worker",
    include: ["tests/**/*.test.ts"],
  },
});

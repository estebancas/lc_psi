import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";

// Bare defineCloudflareConfig() defaults incrementalCache/queue to "dummy" —
// nothing is ever cached, so the prerendered PPR shell and the 30s-revalidate
// Sanity fetches (lib/profile.ts, lib/services.ts, lib/posts.ts) get
// discarded and every request re-renders from scratch. R2 (not KV) because
// KV's ~60s global write propagation would blow the ~30s post-publish
// freshness commitment in AGENTS.md; regionalCache adds a Cache API layer in
// front of R2 for warm-region reuse without weakening that freshness — its
// defaultLongLivedTtlSec only applies when no revalidate is set, and every
// fetch here sets one. queue: "direct" is required alongside the cache, or
// revalidation silently never fires.
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
  queue: "direct",
  // Moves route-module loading off the cold-start critical path — this is
  // what the ~1.3s cold vs ~0.5s warm TTFB gap (issue #6) is paying for.
  routePreloadingBehavior: "withWaitUntil",
  // Stays false (the default): unsupported alongside cacheComponents/PPR,
  // which this app has on (next.config.ts).
  enableCacheInterception: false,
});

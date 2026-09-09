import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    // Default ("100 MB") makes Next ask node:zlib's inflateSync for a 500MB
    // (5x) output allowance when resuming a postponed PPR render. Workerd's
    // nodejs_compat zlib shim hard-caps maxOutputLength at 128MB, so every
    // single request was throwing "Failed to parse postponed state: RangeError
    // ... Received 524288000" (verified via `wrangler tail` against prod) and
    // silently discarding the resume data cache — plus fanning out redundant
    // R2 cache writes for every concurrent request on the same route. 20MB
    // keeps the 5x allowance (100MB) safely under that 128MB ceiling.
    maxPostponedStateSize: "20 MB",
  },
  images: {
    // Sanity already serves resized/optimized URLs (@sanity/image-url query
    // params) — skip Next's Image Optimization API so deploy doesn't need a
    // Cloudflare Images binding for this one Hero photo.
    unoptimized: true,
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

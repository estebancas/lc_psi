import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
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

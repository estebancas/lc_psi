import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Overrides Cloudflare's managed robots.txt (the AI content-signals
// boilerplate served by default) — that file has no actual directives (no
// User-agent, no Sitemap line), so nothing is lost by owning this in code.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

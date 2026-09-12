import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Deliberately kept as "middleware.ts" (Next 16's deprecated-but-supported
// name for this file — the new name is "proxy.ts") with an explicit
// experimental-edge runtime, NOT the new default. Verified two ways:
//   1. Next 16's proxy.ts docs (node_modules/next/dist/docs/.../proxy.md)
//      say the runtime config option isn't available on that convention —
//      it's Node.js-only, no way to opt into edge.
//   2. @opennextjs/cloudflare 1.20.2 hard-fails the build with "Node.js
//      middleware is not currently supported. Consider switching to Edge
//      Middleware." (see its dist/cli/build/build.js) whenever it detects
//      Node-runtime middleware in the manifest.
// So on this stack, a plain proxy.ts (Node-only) cannot ship at all — this
// file has to stay on the legacy name + explicit edge runtime until
// @opennextjs/cloudflare adds Node-middleware support. Re-check this note
// before ever "modernizing" this file to proxy.ts.
//
// www.psicologalauracastro.com is provisioned as a second custom domain on
// the same Worker (wrangler.jsonc) purely so it doesn't dead-end —
// psicologalauracastro.com (apex, no www) is the one canonical host: it's
// what metadataBase, every canonical URL, and the sitemap use.
const WWW_HOST = "www.psicologalauracastro.com";
const CANONICAL_HOST = "psicologalauracastro.com";

export function middleware(request: NextRequest) {
  const { hostname } = request.nextUrl;

  // Matching only the specific www host (not "anything that isn't the
  // canonical host") matters: this also runs against localhost during
  // `next dev`/e2e tests and against Cloudflare's *.workers.dev preview
  // URL — neither should ever redirect.
  if (hostname === WWW_HOST) {
    const url = request.nextUrl.clone();
    url.hostname = CANONICAL_HOST;
    // Permanent: tells search engines to consolidate ranking signals onto
    // the apex instead of treating www as a separate, duplicate site.
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  runtime: "experimental-edge",
  // Skip static assets and the Next internals — nothing under these paths
  // needs a hostname redirect, and matching them would add pointless
  // middleware overhead to every asset request.
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};

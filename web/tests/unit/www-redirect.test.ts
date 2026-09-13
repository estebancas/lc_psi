import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

// This exercises the middleware function's logic directly (constructing a
// NextRequest rather than going through a running server) because the
// cross-domain behavior itself can't be reproduced locally: `next start`
// doesn't reconstruct request.nextUrl from the incoming Host header at
// all, and `wrangler dev` normalizes the Host header to the first
// configured route regardless of what's sent — both verified by hand while
// building this. Only a real deploy, with both custom domains actually
// provisioned on Cloudflare's network, can prove the end-to-end redirect;
// see wrangler.jsonc's two "routes" entries. Post-deploy smoke test:
//   curl -I https://www.psicologalauracastro.com/  # expect 308 -> apex
describe("middleware (www -> apex redirect)", () => {
  it("308-redirects www to the canonical apex host, preserving path", () => {
    const request = new NextRequest("https://www.psicologalauracastro.com/blog/mi-post");
    const response = middleware(request);

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "https://psicologalauracastro.com/blog/mi-post",
    );
  });

  it("leaves the canonical apex host untouched", () => {
    const request = new NextRequest("https://psicologalauracastro.com/blog");
    const response = middleware(request);

    expect(response.status).not.toBe(308);
    expect(response.headers.get("location")).toBeNull();
  });

  it("leaves other hosts (localhost, *.workers.dev preview) untouched", () => {
    for (const url of ["http://localhost:3000/", "https://lc-psi-web.workers.dev/"]) {
      const response = middleware(new NextRequest(url));
      expect(response.headers.get("location")).toBeNull();
    }
  });
});

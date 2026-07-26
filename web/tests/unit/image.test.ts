import { describe, expect, it } from "vitest";
import { urlForImage } from "@/lib/sanity/image";

// NEXT_PUBLIC_SANITY_PROJECT_ID / DATASET come from web/vitest.config.ts's
// test.env — lib/sanity/client.ts reads them at module-import time, before
// any per-test hook could set them.
const assetRef = {
  _type: "image",
  asset: { _ref: "image-abc123def-800x600-jpg", _type: "reference" },
};

describe("urlForImage", () => {
  it("builds a CDN url containing the project id, dataset, and asset id", () => {
    const url = urlForImage(assetRef).url();
    expect(url).toContain("c3ikd5qa");
    expect(url).toContain("production");
    expect(url).toContain("abc123def-800x600.jpg");
  });

  it("appends a width parameter when .width() is chained", () => {
    const url = urlForImage(assetRef).width(400).url();
    expect(url).toContain("w=400");
  });
});

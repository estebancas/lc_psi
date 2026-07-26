import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// client.ts reads process.env at module scope (createClient() runs on
// import), so every test needs a fresh module instance after mutating env —
// vi.resetModules() + a dynamic import per test, not a static top-level one.

const originalEnv = { ...process.env };

async function loadClient() {
  const mod = await import("@/lib/sanity/client");
  return mod.client;
}

beforeEach(() => {
  vi.resetModules();
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "c3ikd5qa";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
  delete process.env.SANITY_API_HOST;
});

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("sanity client config", () => {
  it("does not set apiHost when SANITY_API_HOST is unset", async () => {
    const client = await loadClient();
    const config = client.config();
    // @sanity/client's real defaults — asserting the exact value, not just
    // "not the stub host", so a future default-hostname bump doesn't get
    // masked by mixing it up with the stub override.
    expect(config.apiHost).toBe("https://api.sanity.io");
    expect(config.useProjectHostname).toBe(true);
  });

  it("sets apiHost and useProjectHostname:false together when SANITY_API_HOST is set", async () => {
    process.env.SANITY_API_HOST = "http://127.0.0.1:4010";
    const client = await loadClient();
    const config = client.config();
    // Both must be set together: apiHost alone gets projectId spliced in as
    // a subdomain and the stub URL breaks (documented gotcha in client.ts).
    expect(config.apiHost).toBe("http://127.0.0.1:4010");
    expect(config.useProjectHostname).toBe(false);
  });

  it("treats an empty-string SANITY_API_HOST as unset", async () => {
    process.env.SANITY_API_HOST = "";
    const client = await loadClient();
    const config = client.config();
    expect(config.apiHost).toBe("https://api.sanity.io");
    expect(config.useProjectHostname).toBe(true);
  });

  it("reads projectId and dataset from NEXT_PUBLIC_* env vars", async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "some-project";
    process.env.NEXT_PUBLIC_SANITY_DATASET = "staging";
    const client = await loadClient();
    const config = client.config();
    expect(config.projectId).toBe("some-project");
    expect(config.dataset).toBe("staging");
  });

  it("pins apiVersion and enables the CDN", async () => {
    const client = await loadClient();
    const config = client.config();
    expect(config.apiVersion).toBe("2026-07-22");
    expect(config.useCdn).toBe(true);
  });
});

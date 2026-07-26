import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-07-22",
  // apicdn.sanity.io purges on publish, so this is no staler than the
  // revalidate:30 window on the fetches that use this client (lib/profile.ts,
  // lib/services.ts, lib/posts.ts) — and it measured ~150ms faster than
  // api.sanity.io in production. useProjectHostname:false (E2E, below) forces
  // cdnUrl back to the plain url, so the stub server is unaffected.
  useCdn: true,
  // E2E only: point at the local Playwright stub server instead of the real
  // Sanity API. Both options are required together — with the default
  // useProjectHostname: true, apiHost alone gets projectId spliced in as a
  // subdomain (http://test.127.0.0.1:4010) and the URL breaks.
  ...(process.env.SANITY_API_HOST && {
    apiHost: process.env.SANITY_API_HOST,
    useProjectHostname: false,
  }),
});

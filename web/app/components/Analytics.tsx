import Script from "next/script";
import { connection } from "next/server";

// Cloudflare Web Analytics: cookieless, no consent banner needed. The
// beacon token isn't secret — it's visible in every page's source — but the
// site still has to be created once in the Cloudflare dashboard (Web
// Analytics -> Add a site) to get one; see wrangler.jsonc's CF_BEACON_TOKEN
// comment. Renders nothing until that token is set, so this is a no-op
// rather than a broken script tag in the meantime.
//
// Read at request time via connection(), same as BookingLink in
// app/agendar/page.tsx: module scope only sees the build-time env, not the
// Cloudflare Worker's runtime vars, so a build before the token exists
// would otherwise bake in "unset" permanently.
export default async function Analytics() {
  await connection();
  const token = process.env.CF_BEACON_TOKEN;

  if (!token) return null;

  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
      strategy="afterInteractive"
    />
  );
}

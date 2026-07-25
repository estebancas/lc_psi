// Zero-dependency stand-in for the real Sanity API + the contact email
// worker, used only by Playwright e2e runs (see tests/e2e/serve.mjs and
// playwright.config.ts). Real network is never reached: lib/sanity/client.ts
// points at this host via SANITY_API_HOST, and CONTACT_WORKER_URL is pointed
// here directly.
//
// Any request that doesn't match a known route gets a 501 and a console.error
// — that's the "fail loud" guard: a new fetch added later without a stub
// route surfaces immediately in CI instead of silently hitting real network.

import { createServer } from "node:http";
import { profile, services, posts, postsBySlug } from "./fixtures.mjs";

// Read from env (set by playwright.config.ts's webServer.env) rather than
// hardcoding, so there's one source of truth for the test secret.
const TEST_CONTACT_SECRET = process.env.CONTACT_WORKER_SECRET ?? "test-secret";

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function resolveSanityResult(query, params) {
  // Order matters: the by-slug query also contains `_type == "post"`, so it
  // must be checked before the plain posts-list query.
  if (query.includes('_type == "post"') && query.includes("slug.current == $slug")) {
    const slug = params?.slug;
    return postsBySlug[slug] ?? null;
  }
  if (query.includes('_type == "post"')) {
    return posts;
  }
  if (query.includes('_type == "service"')) {
    return services;
  }
  if (query.includes('_type == "profile"')) {
    return profile;
  }
  return undefined; // signals "unknown query" to the caller
}

async function handleSanityQuery(req, res, url) {
  let query;
  let params = {};

  if (req.method === "GET") {
    query = url.searchParams.get("query") ?? "";
    for (const [key, value] of url.searchParams) {
      if (key.startsWith("$")) {
        try {
          params[key.slice(1)] = JSON.parse(value);
        } catch {
          params[key.slice(1)] = value;
        }
      }
    }
  } else if (req.method === "POST") {
    const raw = await readBody(req);
    try {
      const body = JSON.parse(raw || "{}");
      query = body.query ?? "";
      params = body.params ?? {};
    } catch {
      sendJson(res, 400, { error: "Invalid JSON body" });
      return;
    }
  } else {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const result = resolveSanityResult(query, params);
  if (result === undefined) {
    console.error(`[e2e stub] Unrecognized Sanity query, no fixture matched:\n${query}`);
    res.writeHead(501);
    res.end();
    return;
  }

  sendJson(res, 200, { ms: 0, query, result });
}

async function handleContactWorker(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const secret = req.headers["x-contact-secret"];
  if (secret !== TEST_CONTACT_SECRET) {
    sendJson(res, 401, { error: "No autorizado" });
    return;
  }

  const raw = await readBody(req);
  let body;
  try {
    body = JSON.parse(raw || "{}");
  } catch {
    sendJson(res, 400, { error: "JSON inválido" });
    return;
  }

  // Sentinel emails give tests deterministic control over the response
  // without any IPC between the Playwright process and this server.
  if (body.email === "error@test.com") {
    sendJson(res, 500, { error: "No se pudo enviar el mensaje" });
    return;
  }
  if (body.email === "unauthorized@test.com") {
    sendJson(res, 401, { error: "No autorizado" });
    return;
  }

  sendJson(res, 200, { success: true });
}

export function startStub(port) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);

    if (/^\/v[^/]+\/data\/query\/[^/]+$/.test(url.pathname)) {
      handleSanityQuery(req, res, url).catch((error) => {
        console.error("[e2e stub] Error handling Sanity query:", error);
        res.writeHead(500);
        res.end();
      });
      return;
    }

    if (url.pathname === "/worker/contact") {
      handleContactWorker(req, res).catch((error) => {
        console.error("[e2e stub] Error handling contact worker request:", error);
        res.writeHead(500);
        res.end();
      });
      return;
    }

    console.error(`[e2e stub] Unhandled request: ${req.method} ${url.pathname}`);
    res.writeHead(501);
    res.end();
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

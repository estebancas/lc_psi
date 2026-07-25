// Playwright's single webServer entry point for e2e runs.
//
// Playwright starts webServer array entries concurrently, which would race
// `next build` against the stub server coming up — and the build needs the
// stub live already, since app/blog/[slug]/page.tsx's generateStaticParams
// hits Sanity at build time. Running everything from one orchestrator
// process removes that race: stub first, then build, then start.
//
// Set E2E_SKIP_BUILD=1 to reuse an existing .next build for fast local
// iteration on the specs themselves.

import { spawn } from "node:child_process";
import { startStub } from "./stub/server.mjs";

const STUB_PORT = 4010;

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    let shuttingDown = false;

    const forward = (signal) => {
      shuttingDown = true;
      child.kill(signal);
    };
    process.once("SIGINT", forward);
    process.once("SIGTERM", forward);

    child.once("exit", (code, signal) => {
      process.off("SIGINT", forward);
      process.off("SIGTERM", forward);
      if (shuttingDown) {
        // Playwright tearing down the webServer at the end of a run — this
        // is the expected way `next start` stops, not a failure.
        resolve();
      } else if (signal) {
        reject(new Error(`${command} ${args.join(" ")} exited via signal ${signal}`));
      } else if (code !== 0) {
        reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
      } else {
        resolve();
      }
    });
    child.once("error", reject);
  });
}

async function main() {
  await startStub(STUB_PORT);
  console.log(`[e2e] stub server listening on http://127.0.0.1:${STUB_PORT}`);

  if (!process.env.E2E_SKIP_BUILD) {
    console.log("[e2e] running next build...");
    await run("npx", ["next", "build"]);
  } else {
    console.log("[e2e] E2E_SKIP_BUILD set, reusing existing .next build");
  }

  console.log("[e2e] starting next start...");
  // This one keeps running until Playwright tears the process down — no
  // await-to-completion, that's the point of `next start`.
  await run("npx", ["next", "start"]);
}

main().catch((error) => {
  console.error("[e2e] serve.mjs failed:", error);
  process.exit(1);
});

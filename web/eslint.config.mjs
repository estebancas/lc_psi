import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Gitignored OpenNext/Cloudflare build artifact — not covered by
    // eslint-config-next's default ignores, so it gets linted whenever
    // `npm run preview`/`deploy:cf` has produced it on disk.
    ".open-next/**",
  ]),
]);

export default eslintConfig;

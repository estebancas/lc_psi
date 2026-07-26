#!/usr/bin/env node
// Turns coverage/coverage-summary.json (produced by `vitest run --coverage`,
// istanbul's json-summary reporter) into a markdown table for the CI job
// summary. Report-only — this does not gate the job on a threshold, see
// AGENTS.md's "Unit tests" section for why.
import { readFileSync } from "node:fs";
import path from "node:path";

const SUMMARY_PATH = path.join(process.cwd(), "coverage", "coverage-summary.json");
const METRICS = ["statements", "branches", "functions", "lines"];

function pct(entry, metric) {
  return entry?.[metric]?.pct ?? 0;
}

function formatRow(label, entry) {
  const cells = METRICS.map((metric) => `${pct(entry, metric).toFixed(2)}%`);
  return `| ${label} | ${cells.join(" | ")} |`;
}

let raw;
try {
  raw = readFileSync(SUMMARY_PATH, "utf-8");
} catch (error) {
  console.log("## Coverage\n");
  console.log(`_No coverage report found at \`${SUMMARY_PATH}\`._`);
  console.log(`\n<details><summary>Error</summary>\n\n\`\`\`\n${error.message}\n\`\`\`\n</details>`);
  process.exit(0);
}

const data = JSON.parse(raw);
const { total, ...files } = data;
const repoRoot = path.resolve(process.cwd());

const lines = [];
lines.push("## Coverage\n");
lines.push(`| File | ${METRICS.map((m) => m[0].toUpperCase() + m.slice(1)).join(" | ")} |`);
lines.push(`| --- | ${METRICS.map(() => "---").join(" | ")} |`);
lines.push(formatRow("**All files**", total));

for (const [filePath, entry] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
  const relative = path.relative(repoRoot, filePath);
  lines.push(formatRow(relative, entry));
}

console.log(lines.join("\n"));

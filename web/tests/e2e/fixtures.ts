import { test as base } from "@playwright/test";

// Belt-and-braces: the profile fixture (tests/e2e/stub/fixtures.mjs)
// deliberately omits heroPhoto so Hero.tsx never emits a cdn.sanity.io URL,
// but this guarantees no accidental leak to the real CDN if that changes.
export const test = base.extend({
  // Named runFixture, not Playwright's conventional `use` — eslint-plugin-
  // react-hooks otherwise misreads it as a call to React's `use()` hook.
  page: async ({ page }, runFixture) => {
    await page.route("**://cdn.sanity.io/**", (route) => route.abort());
    await runFixture(page);
  },
});

export { expect } from "@playwright/test";

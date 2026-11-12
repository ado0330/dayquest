import { test as base, expect, type Page } from "@playwright/test";

export const STORAGE_KEY = "dayquest:state";

export const onboardedState = {
  version: 1,
  profile: { nickname: "Robin", avatar: "frog", onboarded: true },
  settings: {},
  progress: {},
};

/** Seeds saved state once per test (not on every navigation, so reloads keep real progress). */
export async function seed(page: Page, state: object = onboardedState) {
  await page.addInitScript(
    ([key, value]) => {
      if (!sessionStorage.getItem("__seeded")) {
        localStorage.setItem(key, value);
        sessionStorage.setItem("__seeded", "1");
      }
    },
    [STORAGE_KEY, JSON.stringify(state)] as const,
  );
}

/** Fails the test on any console error or uncaught exception. */
export const test = base.extend<{ consoleErrors: string[]; allowNetworkErrors: boolean }>({
  // Set with test.use() where failed requests are expected (404 pages, offline mode).
  allowNetworkErrors: [false, { option: true }],
  consoleErrors: [
    async ({ page, allowNetworkErrors }, use) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() !== "error") return;
        if (allowNetworkErrors && msg.text().startsWith("Failed to load resource")) return;
        errors.push(msg.text());
      });
      page.on("pageerror", (err) => errors.push(err.message));
      await use(errors);
      expect(errors, "browser console errors").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

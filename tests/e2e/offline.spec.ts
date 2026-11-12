import { expect, seed, test } from "./fixtures";

test.describe("offline support (PWA)", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "service worker tests run in Chromium");

  test("serves a valid web app manifest and icons", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.ok()).toBe(true);
    const manifest = await res.json();
    expect(manifest).toMatchObject({ name: "DayQuest", start_url: "/", display: "standalone" });
    for (const icon of manifest.icons) {
      expect((await request.get(icon.src)).ok(), icon.src).toBe(true);
    }
    expect((await request.get("/sw.js")).ok()).toBe(true);
  });

  test("missions keep working with no network after the first visit", async ({ page, context }) => {
    await seed(page);
    await page.goto("/");
    // Wait for the worker to install (precaching the whole app) and take control.
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await page.reload();
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

    await context.setOffline(true);

    // A full page load of a mission the child never opened before, straight from the cache.
    await page.goto("/missions/preparing-for-bedtime/");
    await expect(page.getByRole("heading", { level: 1, name: "Preparing for Bedtime" })).toBeVisible();
    await page.getByRole("button", { name: "Let's go!" }).click();
    await page.getByRole("button", { name: "I'm all clean" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 2 of 6");
    await expect(page.getByRole("status").filter({ hasText: "You're offline" })).toHaveCount(0); // focus screen has no banner

    // Client-side navigation between screens also works offline.
    await page.goto("/");
    await expect(page.getByRole("status").filter({ hasText: "You're offline" })).toBeVisible();
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: /Adventures/ }).filter({ visible: true }).first().click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("adventures");
    await expect(page.getByRole("heading", { name: "Keep going" })).toBeVisible();

    // A page that doesn't exist falls back to the offline page instead of the browser error.
    await page.goto("/some/uncached/page");
    await expect(page.getByRole("heading", { name: "You're offline" })).toBeVisible();

    await context.setOffline(false);
  });
});

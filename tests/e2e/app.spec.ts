import { STORAGE_KEY, expect, onboardedState, seed, test } from "./fixtures";

const MISSIONS = [
  ["getting-ready-for-school", "Getting Ready for School"],
  ["brushing-teeth", "Brushing Your Teeth"],
  ["washing-hands", "Washing Your Hands"],
  ["packing-school-bag", "Packing Your School Bag"],
  ["cleaning-up-toys", "Cleaning Up Your Toys"],
  ["preparing-for-bedtime", "Preparing for Bedtime"],
] as const;

test("first visit shows onboarding, which personalises the app", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/welcome\/$/);
  await expect(page.getByRole("heading", { name: "Welcome to DayQuest!" })).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByText("Bunny", { exact: true }).click();
  await page.getByRole("button", { name: "Bunny it is!" }).click();
  await page.getByLabel(/Nickname/).fill("Ava");
  await page.getByRole("button", { name: "Let's go!" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ava!");

  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ava!");
});

test("onboarding can be skipped", async ({ page }) => {
  await page.goto("/welcome/");
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page.getByRole("link", { name: "Start Adventure" })).toBeVisible();
});

test("every mission card opens its own mission", async ({ page }) => {
  await seed(page);
  for (const [id, title] of MISSIONS) {
    await page.goto("/missions/");
    await page.getByRole("link", { name: new RegExp(`^Start: ${title}`) }).click();
    await expect(page).toHaveURL(new RegExp(`/missions/${id}/$`));
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  }
});

test("complete a mission, see the celebration and keep the badge after reload", async ({ page }) => {
  await seed(page);
  await page.goto("/missions/brushing-teeth/");
  await page.getByRole("button", { name: "Let's go!" }).click();

  await page.getByRole("button", { name: "Hairbrush" }).click();
  await expect(page.getByText(/A hairbrush is for your hair/)).toBeVisible();
  await page.getByRole("button", { name: "Toothbrush" }).click();
  await page.getByRole("button", { name: "Next" }).click();

  await page.getByRole("button", { name: "A pea-sized dot" }).click();
  await page.getByRole("button", { name: "Next" }).click();

  await page.getByRole("button", { name: "Start timer" }).click();
  await expect(page.getByText("Brush your top teeth on one side.")).toBeVisible();
  await page.getByRole("button", { name: "Pause" }).click();
  await page.getByRole("button", { name: "I already did it" }).click();
  await page.getByRole("button", { name: "Next" }).click();

  for (const label of ["Tongue done", "I spat it out", "All put away"]) {
    await page.getByRole("button", { name: label }).click();
    await page.getByRole("button", { name: label === "All put away" ? "Finish" : "Next" }).click();
  }

  await expect(page.getByRole("heading", { level: 1, name: "Sparkly clean!" })).toBeVisible();
  await expect(page.getByText("Sparkle Smile badge earned!")).toBeVisible();

  await page.getByRole("link", { name: "More adventures" }).click();
  await expect(page.getByRole("link", { name: /Play again: Brushing Your Teeth, completed/ })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("link", { name: /Brushing Your Teeth, completed/ })).toBeVisible();
  await page.goto("/progress/");
  await expect(page.getByText("1 of 6 badges collected", { exact: false })).toBeVisible();
});

test("an unfinished mission can be resumed after closing the page", async ({ page }) => {
  await seed(page);
  await page.goto("/missions/packing-school-bag/");
  await page.getByRole("button", { name: "Let's go!" }).click();
  await page.getByRole("button", { name: "Bag is open" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Sports shoes" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 3 of 6");

  await page.getByRole("button", { name: /break/i }).click();
  await page.getByRole("button", { name: "Leave for now" }).click();
  await expect(page).toHaveURL(/\/missions\/$/);
  await expect(page.getByRole("link", { name: /Keep going: Packing Your School Bag, on step 3 of 6/ })).toBeVisible();

  await page.reload();
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Continue Adventure" })).toHaveAttribute("href", "/missions/packing-school-bag/");
  await page.getByRole("link", { name: "Continue Adventure" }).click();
  await expect(page.getByText("Welcome back! You were on step 3 of 6.")).toBeVisible();
  await page.getByRole("button", { name: "Keep going" }).click();
  await expect(page.getByRole("heading", { level: 2 })).toContainText("Pack the things you need every day");
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByRole("button", { name: "Sports shoes" })).toHaveAttribute("aria-pressed", "true");
});

test("the grown-ups area is gated and reset needs confirmation", async ({ page }) => {
  await seed(page, {
    version: 1,
    profile: { nickname: "Robin", avatar: "frog", onboarded: true },
    settings: {},
    progress: { "washing-hands": { completions: 2, lastCompletedAt: "2026-10-20T08:00:00.000Z" } },
  });
  await page.goto("/parents/");
  await expect(page.getByRole("heading", { name: "For grown-ups" })).toBeVisible();
  await page.getByRole("button", { name: "I'm a grown-up" }).click();
  const question = (await page.locator("label[for=gate-answer]").textContent()) ?? "";
  const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  const [, a, b] = question.match(/What is (\w+) times (\w+)\?/)!;
  await page.getByRole("textbox").fill(String(words.indexOf(a) * words.indexOf(b)));
  await page.getByRole("button", { name: "Open" }).click();

  await expect(page.getByRole("heading", { name: "Progress & settings" })).toBeVisible();
  await expect(page.getByRole("row", { name: /Washing Your Hands Completed 2×/ })).toBeVisible();

  await page.getByRole("radio", { name: "Extra large" }).check({ force: true });
  await expect(page.locator("html")).toHaveAttribute("data-text-size", "x-large");

  await page.getByRole("button", { name: "Reset progress" }).click();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByRole("row", { name: /Washing Your Hands Completed 2×/ })).toBeVisible();
  await page.getByRole("button", { name: "Reset progress" }).click();
  await page.getByRole("button", { name: "Yes, reset progress" }).click();
  await expect(page.getByText("Progress has been reset.")).toBeVisible();
  await expect(page.getByRole("row", { name: /Washing Your Hands Not started/ })).toBeVisible();

  // Text size persists across reloads and applies before React loads.
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-text-size", "x-large");
});

test("the home screen is keyboard operable", async ({ page, browserName }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "keyboard flow is checked on desktop");
  void browserName;
  await seed(page);
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  const start = page.getByRole("link", { name: "Start Adventure" });
  for (let i = 0; i < 15 && !(await start.evaluate((el) => el === document.activeElement)); i++) {
    await page.keyboard.press("Tab");
  }
  await expect(start).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/missions\/.+\/$/);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: /Let's go!/ })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 })).toBeFocused();
});

test("layouts fit phone, tablet and desktop widths without sideways scrolling", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "widths are set explicitly");
  await seed(page);
  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/missions/", "/progress/", "/parents/", "/missions/cleaning-up-toys/"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
    }
    // Start fresh at each width so the mission begins at step 1.
    await page.evaluate(([key, value]) => localStorage.setItem(key, value), [STORAGE_KEY, JSON.stringify(onboardedState)]);
    await page.goto("/missions/cleaning-up-toys/");
    await page.getByRole("button", { name: "Let's go!" }).click();
    await page.getByRole("button", { name: "I see them!" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `sort step at ${width}px`).toBeLessThanOrEqual(0);
  }
});

test.describe("not found", () => {
  test.use({ allowNetworkErrors: true });

  test("unknown pages show a friendly not-found page", async ({ page }) => {
  const response = await page.goto("/missions/flying-a-dragon/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Hmm, this path is a mystery!" })).toBeVisible();
});
});

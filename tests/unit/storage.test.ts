import { describe, expect, it } from "vitest";
import { missions } from "@/data/missions";
import { beginMission, finishMission, resetAllProgress, saveMissionRun, updateProfile, updateSettings } from "@/lib/actions";
import { STORAGE_KEY, createDefaultState, parseStoredState, sanitizeNickname } from "@/lib/storage/schema";
import { __resetStoreForTests, clearAllData, getState } from "@/lib/store";

const iso = "2026-10-01T08:00:00.000Z";

describe("parseStoredState", () => {
  it.each([undefined, null, 42, "text", [], true])("falls back to defaults for %p", (raw) => {
    expect(parseStoredState(raw, missions)).toEqual(createDefaultState());
  });

  it("keeps valid data", () => {
    const raw = {
      version: 1,
      profile: { nickname: "Mo", avatar: "owl", onboarded: true },
      settings: { ...createDefaultState().settings, textSize: "large" },
      progress: {
        "brushing-teeth": { completions: 2, lastCompletedAt: iso, firstCompletedAt: iso },
        "washing-hands": {
          completions: 0,
          active: { currentStepIndex: 2, stepStates: { wet: { done: true } }, startedAt: iso, updatedAt: iso },
        },
      },
    };
    const parsed = parseStoredState(raw, missions);
    expect(parsed.profile).toEqual({ nickname: "Mo", avatar: "owl", onboarded: true });
    expect(parsed.settings.textSize).toBe("large");
    expect(parsed.progress["brushing-teeth"].completions).toBe(2);
    expect(parsed.progress["washing-hands"].active?.currentStepIndex).toBe(2);
  });

  it("repairs bad fields without discarding good ones", () => {
    const parsed = parseStoredState(
      {
        profile: { nickname: "<script>Mo</script>", avatar: "dragon", onboarded: "yes" },
        settings: { speechRate: 99, textSize: "huge", soundEffects: false },
        progress: {
          "unknown-mission": { completions: 5 },
          "brushing-teeth": { completions: -3 },
          "washing-hands": {
            completions: 1,
            active: {
              currentStepIndex: 999,
              stepStates: { wet: { done: true }, removed: { done: true }, soap: { done: "nope" } },
              startedAt: iso,
              updatedAt: iso,
            },
          },
          "packing-school-bag": { completions: 1, active: { currentStepIndex: "x" } },
        },
      },
      missions,
    );
    expect(parsed.profile).toEqual({ nickname: "scriptMoscript", avatar: "fox", onboarded: false });
    expect(parsed.settings.speechRate).toBe(0.9);
    expect(parsed.settings.textSize).toBe("normal");
    expect(parsed.settings.soundEffects).toBe(false);
    expect(parsed.progress["unknown-mission"]).toBeUndefined();
    expect(parsed.progress["brushing-teeth"]).toBeUndefined();
    const hands = parsed.progress["washing-hands"];
    expect(hands.active?.currentStepIndex).toBe(missions.find((m) => m.id === "washing-hands")!.steps.length - 1);
    expect(Object.keys(hands.active!.stepStates)).toEqual(["wet"]);
    expect(parsed.progress["packing-school-bag"]).toEqual({ completions: 1 });
  });

  it("does not misread data from a newer app version", () => {
    expect(parseStoredState({ version: 99, profile: { nickname: "X" } }, missions)).toEqual(createDefaultState());
  });
});

describe("sanitizeNickname", () => {
  it("keeps letters, numbers, spaces, apostrophes and hyphens, max 20 chars", () => {
    expect(sanitizeNickname("  Zoë-Ann  O'Neil  ")).toBe("Zoë-Ann O'Neil");
    expect(sanitizeNickname("a".repeat(40))).toHaveLength(20);
    expect(sanitizeNickname("hi@example.com")).toBe("hiexamplecom");
    expect(sanitizeNickname(undefined)).toBe("");
  });
});

describe("persistence through the store", () => {
  it("saves progress and restores it after a reload", () => {
    const run = beginMission("washing-hands");
    saveMissionRun("washing-hands", { ...run, currentStepIndex: 3, stepStates: { wet: { done: true } } });
    updateSettings({ soundEffects: false, textSize: "x-large" });
    updateProfile({ nickname: "Sam", onboarded: true });

    __resetStoreForTests(); // simulate a page reload
    const restored = getState();
    expect(restored.progress["washing-hands"].active?.currentStepIndex).toBe(3);
    expect(restored.settings.soundEffects).toBe(false);
    expect(restored.settings.textSize).toBe("x-large");
    expect(restored.profile.nickname).toBe("Sam");
  });

  it("resumes the existing run unless asked to restart", () => {
    const first = beginMission("brushing-teeth");
    saveMissionRun("brushing-teeth", { ...first, currentStepIndex: 2 });
    expect(beginMission("brushing-teeth").currentStepIndex).toBe(2);
    expect(beginMission("brushing-teeth", { restart: true }).currentStepIndex).toBe(0);
  });

  it("records completion, clears the active run and returns new stickers", () => {
    beginMission("brushing-teeth");
    const stickers = finishMission("brushing-teeth");
    expect(stickers.map((s) => s.id)).toEqual(["first-steps"]);
    const p = getState().progress["brushing-teeth"];
    expect(p.completions).toBe(1);
    expect(p.active).toBeUndefined();
    expect(p.lastCompletedAt).toBeTruthy();
    expect(finishMission("brushing-teeth")).toEqual([]);
    expect(getState().progress["brushing-teeth"].completions).toBe(2);
  });

  it("survives malformed JSON in storage", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    __resetStoreForTests();
    expect(getState()).toEqual(createDefaultState());
  });

  it("can reset progress while keeping settings, or erase everything", () => {
    updateSettings({ highContrast: true });
    beginMission("brushing-teeth");
    finishMission("brushing-teeth");
    resetAllProgress();
    expect(getState().progress).toEqual({});
    expect(getState().settings.highContrast).toBe(true);
    clearAllData();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(getState()).toEqual(createDefaultState());
  });
});

import { describe, expect, it } from "vitest";
import { getMission, missions } from "@/data/missions";
import { newlyEarned } from "@/features/progress/achievements";
import { dayPart, latestInProgress, missionStatus, recommendMission, summarize } from "@/features/progress/progress";
import { makeGateQuestion } from "@/features/settings/parent-gate";
import type { AppState } from "@/types/progress";

const run = (updatedAt: string) => ({ currentStepIndex: 1, stepStates: {}, startedAt: updatedAt, updatedAt });

describe("progress helpers", () => {
  it("derives mission status", () => {
    expect(missionStatus(undefined)).toBe("new");
    expect(missionStatus({ completions: 2 })).toBe("completed");
    expect(missionStatus({ completions: 2, active: run("2026-01-01T00:00:00Z") })).toBe("in-progress");
  });

  it("summarises completions", () => {
    const progress: AppState["progress"] = {
      "brushing-teeth": { completions: 3 },
      "washing-hands": { completions: 0, active: run("2026-01-01T00:00:00Z") },
    };
    expect(summarize(progress, missions)).toEqual({
      completedMissions: 1,
      inProgressMissions: 1,
      totalCompletions: 3,
      totalMissions: 6,
    });
  });

  it("recommends resuming the most recent unfinished mission first", () => {
    const progress: AppState["progress"] = {
      "brushing-teeth": { completions: 0, active: run("2026-01-01T00:00:00Z") },
      "washing-hands": { completions: 0, active: run("2026-01-02T00:00:00Z") },
    };
    expect(latestInProgress(progress, missions)?.mission.id).toBe("washing-hands");
    expect(recommendMission(progress, missions, "morning").id).toBe("washing-hands");
  });

  it("otherwise recommends a fresh mission for the time of day", () => {
    expect(recommendMission({}, missions, "morning").id).toBe("getting-ready-for-school");
    expect(recommendMission({}, missions, "evening").id).toBe("packing-school-bag");
    const morningDone = { "getting-ready-for-school": { completions: 1 } };
    expect(recommendMission(morningDone, missions, "morning").timeOfDay).not.toBe("morning");
  });

  it("maps clock times to parts of the day", () => {
    expect(dayPart(new Date(2026, 0, 1, 7))).toBe("morning");
    expect(dayPart(new Date(2026, 0, 1, 14))).toBe("day");
    expect(dayPart(new Date(2026, 0, 1, 20))).toBe("evening");
    expect(dayPart(new Date(2026, 0, 1, 2))).toBe("evening");
  });
});

describe("stickers", () => {
  it("are earned for participation milestones", () => {
    const one = { "brushing-teeth": { completions: 1 } };
    expect(newlyEarned({}, one, missions).map((s) => s.id)).toEqual(["first-steps"]);
    const three = { ...one, "washing-hands": { completions: 1 }, "cleaning-up-toys": { completions: 1 } };
    expect(newlyEarned(one, three, missions).map((s) => s.id)).toEqual(["explorer"]);
    const practice = { "brushing-teeth": { completions: 5 } };
    expect(newlyEarned({}, practice, missions).map((s) => s.id)).toContain("practice-pal");
    const all = Object.fromEntries(missions.map((m) => [m.id, { completions: 1 }]));
    expect(newlyEarned(three, all, missions).map((s) => s.id)).toContain("super-adventurer");
  });
});

describe("parent gate question", () => {
  it("is a multiplication written in words with a numeric answer", () => {
    const q = makeGateQuestion(() => 0.5);
    expect(q.text).toBe("What is six times eight?");
    expect(q.answer).toBe(48);
    for (let i = 0; i < 50; i++) {
      const r = makeGateQuestion();
      expect(r.text).not.toMatch(/\d/);
      expect(r.answer).toBeGreaterThanOrEqual(18);
    }
  });
});

it("every mission badge exists", () => {
  for (const m of missions) expect(getMission(m.id)?.badge.name).toBeTruthy();
});

import { describe, expect, it } from "vitest";
import { getMission, missions } from "@/data/missions";
import {
  applyToRun,
  canFinish,
  createRun,
  emptyStepState,
  goBack,
  goNext,
  reduceStep,
  remainingSteps,
} from "@/features/missions/engine";
import { shuffleForStep } from "@/features/missions/interactions/OrderStep";
import type { MissionStep } from "@/types/mission";
import { solutionFor } from "../helpers";

function stepOfType(type: MissionStep["interaction"]["type"]): MissionStep {
  for (const m of missions) {
    const step = m.steps.find((s) => s.interaction.type === type);
    if (step) return step;
  }
  throw new Error(`no ${type} step`);
}

describe("reduceStep", () => {
  it("confirm completes with encouragement", () => {
    const step = stepOfType("confirm");
    const r = reduceStep(step, emptyStepState, { type: "confirm" });
    expect(r.state.done).toBe(true);
    expect(r.feedback).toEqual({ tone: "success", message: step.successMessage });
  });

  it("choice gives a gentle hint for a wrong option and completes on a right one", () => {
    const step = getMission("getting-ready-for-school")!.steps.find((s) => s.id === "check-weather")!;
    const wrong = reduceStep(step, emptyStepState, { type: "select", optionId: "swimsuit" });
    expect(wrong.state.done).toBe(false);
    expect(wrong.feedback?.tone).toBe("hint");
    expect(wrong.feedback?.message).toMatch(/pool/);
    const right = reduceStep(step, wrong.state, { type: "select", optionId: "raincoat" });
    expect(right.state.done).toBe(true);
    expect(right.state.tried).toEqual(["swimsuit", "raincoat"]);
    expect(right.feedback?.tone).toBe("success");
  });

  it("checklist completes only when every item is ticked, and items can be unticked", () => {
    const step = stepOfType("checklist");
    if (step.interaction.type !== "checklist") throw new Error();
    let state = emptyStepState;
    const ids = step.interaction.items.map((i) => i.id);
    for (const id of ids.slice(0, -1)) state = reduceStep(step, state, { type: "toggle", itemId: id }).state;
    expect(state.done).toBe(false);
    state = reduceStep(step, state, { type: "toggle", itemId: ids.at(-1)! }).state;
    expect(state.done).toBe(true);
    state = reduceStep(step, state, { type: "toggle", itemId: ids[0] }).state;
    expect(state.done).toBe(false);
  });

  it("order accepts the right next item, hints on a wrong one, then suggests the answer", () => {
    const step = getMission("washing-hands")!.steps.find((s) => s.interaction.type === "order")!;
    let r = reduceStep(step, emptyStepState, { type: "pick", itemId: "wet" });
    expect(r.state.items).toEqual(["wet"]);
    r = reduceStep(step, r.state, { type: "pick", itemId: "dry" });
    expect(r.feedback).toEqual({ tone: "hint", message: "Not that one yet. What comes after Wet?" });
    r = reduceStep(step, r.state, { type: "pick", itemId: "rinse" });
    expect(r.feedback?.message).toBe("Let's try Soap next!");
    expect(r.state.items).toEqual(["wet"]);
    for (const id of ["soap", "scrub", "rinse", "dry"]) r = reduceStep(step, r.state, { type: "pick", itemId: id });
    expect(r.state.done).toBe(true);
  });

  it("sort places items in the right bin and hints for the wrong one", () => {
    const step = stepOfType("sort");
    const wrong = reduceStep(step, emptyStepState, { type: "place", itemId: "teddy", binId: "bookshelf" });
    expect(wrong.feedback?.tone).toBe("hint");
    expect(wrong.state.placed ?? {}).toEqual({});
    const right = reduceStep(step, wrong.state, { type: "place", itemId: "teddy", binId: "toy-box" });
    expect(right.state.placed).toEqual({ teddy: "toy-box" });
    expect(right.state.done).toBe(false);
  });

  it("timer completes when the timer finishes", () => {
    const step = stepOfType("timer");
    expect(reduceStep(step, emptyStepState, { type: "timer-done" }).state.done).toBe(true);
  });

  it("ignores actions that don't belong to the interaction", () => {
    const step = stepOfType("confirm");
    const r = reduceStep(step, emptyStepState, { type: "select", optionId: "x" });
    expect(r.state).toBe(emptyStepState);
    expect(r.feedback).toBeNull();
  });

  it("reset clears the step", () => {
    const step = stepOfType("order");
    const r = reduceStep(step, { done: false, items: ["a"] }, { type: "reset" });
    expect(r.state).toEqual(emptyStepState);
  });
});

describe("mission navigation", () => {
  const mission = getMission("brushing-teeth")!;

  it("starts on the first step", () => {
    const run = createRun(new Date("2026-01-01T08:00:00Z"));
    expect(run.currentStepIndex).toBe(0);
    expect(run.stepStates).toEqual({});
  });

  it("won't advance past an unfinished step", () => {
    const result = goNext(mission, createRun());
    expect(result.ok).toBe(false);
  });

  it("advances once the step is complete and can go back with answers kept", () => {
    let run = createRun();
    run = applyToRun(mission, run, "find-toothbrush", { type: "select", optionId: "toothbrush" }).run;
    const moved = goNext(mission, run);
    expect(moved.ok).toBe(true);
    if (!moved.ok) return;
    expect(moved.run.currentStepIndex).toBe(1);
    const back = goBack(moved.run);
    expect(back.currentStepIndex).toBe(0);
    expect(back.stepStates["find-toothbrush"].done).toBe(true);
    expect(goBack(back).currentStepIndex).toBe(0);
  });

  it.each(missions.map((m) => [m.id, m] as const))(
    "%s can be completed from start to finish using only its data",
    (_id, m) => {
      let run = createRun();
      expect(canFinish(m, run)).toBe(false);
      for (const step of m.steps) {
        for (const action of solutionFor(step)) run = applyToRun(m, run, step.id, action).run;
        expect(run.stepStates[step.id].done).toBe(true);
        const next = goNext(m, run);
        expect(next.ok).toBe(true);
        if (next.ok) run = next.run;
      }
      expect(remainingSteps(m, run)).toEqual([]);
      expect(canFinish(m, run)).toBe(true);
    },
  );
});

describe("order shuffling", () => {
  it("is deterministic and never shows the answer order", () => {
    for (const m of missions) {
      for (const s of m.steps) {
        if (s.interaction.type !== "order") continue;
        const a = shuffleForStep(s.interaction.items, s.id);
        expect(a).toEqual(shuffleForStep(s.interaction.items, s.id));
        expect(a.map((i) => i.id)).not.toEqual(s.interaction.items.map((i) => i.id));
        expect([...a].sort((x, y) => x.id.localeCompare(y.id))).toEqual(
          [...s.interaction.items].sort((x, y) => x.id.localeCompare(y.id)),
        );
      }
    }
  });
});

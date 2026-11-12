import type { Mission, MissionStep, PictureItem } from "@/types/mission";
import type { MissionRun, StepState } from "@/types/progress";

/**
 * The mission engine: pure functions that apply a child's actions to step
 * state and decide when steps and missions are complete. It knows about
 * interaction *types*, never about individual missions, so new missions are
 * pure data.
 */

export type StepAction =
  | { type: "confirm" }
  | { type: "select"; optionId: string }
  | { type: "toggle"; itemId: string }
  | { type: "pick"; itemId: string }
  | { type: "place"; itemId: string; binId: string }
  | { type: "timer-done" }
  | { type: "reset" };

export interface Feedback {
  /** Never "wrong" or "error": mistakes get a gentle hint. */
  tone: "success" | "hint";
  message: string;
}

export interface StepResult {
  state: StepState;
  feedback: Feedback | null;
}

export const emptyStepState: StepState = { done: false };

const ORDINALS = ["first", "second", "third", "fourth", "fifth", "sixth"];

export function ordinal(index: number): string {
  return ORDINALS[index] ?? `number ${index + 1}`;
}

function labelOf(items: PictureItem[], id: string): string {
  return items.find((i) => i.id === id)?.label ?? id;
}

export function reduceStep(step: MissionStep, state: StepState, action: StepAction): StepResult {
  const interaction = step.interaction;
  if (action.type === "reset") return { state: emptyStepState, feedback: null };

  switch (interaction.type) {
    case "confirm": {
      if (action.type !== "confirm") break;
      return { state: { done: true }, feedback: { tone: "success", message: step.successMessage } };
    }

    case "choice": {
      if (action.type !== "select") break;
      const option = interaction.options.find((o) => o.id === action.optionId);
      if (!option) break;
      const tried = state.tried?.includes(option.id) ? state.tried : [...(state.tried ?? []), option.id];
      return {
        state: { done: option.correct, selected: option.id, tried },
        feedback: { tone: option.correct ? "success" : "hint", message: option.feedback },
      };
    }

    case "checklist": {
      if (action.type !== "toggle") break;
      if (!interaction.items.some((i) => i.id === action.itemId)) break;
      const current = state.items ?? [];
      const items = current.includes(action.itemId)
        ? current.filter((id) => id !== action.itemId)
        : [...current, action.itemId];
      const done = interaction.items.every((i) => items.includes(i.id));
      return {
        state: { done, items },
        feedback: done && !state.done ? { tone: "success", message: step.successMessage } : null,
      };
    }

    case "order": {
      if (action.type !== "pick") break;
      const placed = state.items ?? [];
      if (placed.includes(action.itemId) || state.done) return { state, feedback: null };
      const expected = interaction.items[placed.length];
      if (!expected) break;
      if (action.itemId === expected.id) {
        const items = [...placed, action.itemId];
        const done = items.length === interaction.items.length;
        return {
          state: { done, items, tried: [] },
          feedback: done
            ? { tone: "success", message: step.successMessage }
            : { tone: "success", message: `Yes! ${expected.label} is ${ordinal(placed.length)}.` },
        };
      }
      const tried = [...(state.tried ?? []), action.itemId];
      const previous = placed.length > 0 ? labelOf(interaction.items, placed[placed.length - 1]) : null;
      const message =
        tried.length >= 2
          ? `Let's try ${expected.label} ${placed.length === 0 ? "first" : "next"}!`
          : previous
            ? `Not that one yet. What comes after ${previous}?`
            : "Not that one yet. What do we do first?";
      return { state: { ...state, items: placed, tried }, feedback: { tone: "hint", message } };
    }

    case "timer": {
      if (action.type !== "timer-done") break;
      return { state: { done: true }, feedback: { tone: "success", message: step.successMessage } };
    }

    case "sort": {
      if (action.type !== "place") break;
      const item = interaction.items.find((i) => i.id === action.itemId);
      if (!item || !interaction.bins.some((b) => b.id === action.binId)) break;
      const placed = state.placed ?? {};
      if (item.bin !== action.binId) {
        const tried = [...(state.tried ?? []), `${item.id}:${action.binId}`];
        return { state: { ...state, placed, tried }, feedback: { tone: "hint", message: item.hint } };
      }
      const nextPlaced = { ...placed, [item.id]: action.binId };
      const done = interaction.items.every((i) => nextPlaced[i.id] === i.bin);
      const binLabel = labelOf(interaction.bins, action.binId);
      return {
        state: { done, placed: nextPlaced, tried: state.tried },
        feedback: {
          tone: "success",
          message: done ? step.successMessage : `${item.label} is home in the ${binLabel.toLowerCase()}!`,
        },
      };
    }
  }

  // Action doesn't apply to this interaction: nothing changes.
  return { state, feedback: null };
}

/** A gentle reminder of what to do when the child tries to move on too early. */
export function nudgeFor(step: MissionStep): string {
  const i = step.interaction;
  switch (i.type) {
    case "confirm":
      return `When you're finished, tap “${i.label}”.`;
    case "choice":
      return "Choose the picture that fits best.";
    case "checklist":
      return "Tap every picture to tick it off.";
    case "order":
      return "Tap the pictures in order, from first to last.";
    case "timer":
      return "Press start and follow along with the timer.";
    case "sort":
      return "Help every item find its home.";
  }
}

export function getStepState(run: MissionRun | undefined, stepId: string): StepState {
  return run?.stepStates[stepId] ?? emptyStepState;
}

export function isStepSatisfied(step: MissionStep, run: MissionRun | undefined): boolean {
  return Boolean(step.optional) || getStepState(run, step.id).done;
}

/** Required steps that still need doing, in mission order. */
export function remainingSteps(mission: Mission, run: MissionRun | undefined): MissionStep[] {
  return mission.steps.filter((s) => !isStepSatisfied(s, run));
}

export function canFinish(mission: Mission, run: MissionRun | undefined): boolean {
  return remainingSteps(mission, run).length === 0;
}

export function createRun(now: Date = new Date()): MissionRun {
  const iso = now.toISOString();
  return { currentStepIndex: 0, stepStates: {}, startedAt: iso, updatedAt: iso };
}

export function applyToRun(
  mission: Mission,
  run: MissionRun,
  stepId: string,
  action: StepAction,
  now: Date = new Date(),
): { run: MissionRun; feedback: Feedback | null } {
  const step = mission.steps.find((s) => s.id === stepId);
  if (!step) return { run, feedback: null };
  const result = reduceStep(step, getStepState(run, stepId), action);
  return {
    run: {
      ...run,
      stepStates: { ...run.stepStates, [stepId]: result.state },
      updatedAt: now.toISOString(),
    },
    feedback: result.feedback,
  };
}

export type MoveResult =
  | { ok: true; run: MissionRun }
  | { ok: false; reason: "step-incomplete"; step: MissionStep };

/** Moves forward one step, only if the current step is satisfied. */
export function goNext(mission: Mission, run: MissionRun, now: Date = new Date()): MoveResult {
  const step = mission.steps[run.currentStepIndex];
  if (step && !isStepSatisfied(step, run)) return { ok: false, reason: "step-incomplete", step };
  const index = Math.min(run.currentStepIndex + 1, mission.steps.length - 1);
  return { ok: true, run: { ...run, currentStepIndex: index, updatedAt: now.toISOString() } };
}

/** Moves back one step. Earlier answers are kept so the child can review them. */
export function goBack(run: MissionRun, now: Date = new Date()): MissionRun {
  return { ...run, currentStepIndex: Math.max(run.currentStepIndex - 1, 0), updatedAt: now.toISOString() };
}

export function goToStep(mission: Mission, run: MissionRun, index: number, now: Date = new Date()): MissionRun {
  const clamped = Math.max(0, Math.min(index, mission.steps.length - 1));
  return { ...run, currentStepIndex: clamped, updatedAt: now.toISOString() };
}

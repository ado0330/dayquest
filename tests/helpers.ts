import type { StepAction } from "@/features/missions/engine";
import type { MissionStep } from "@/types/mission";

/** The actions that correctly complete a step, for any interaction type. */
export function solutionFor(step: MissionStep): StepAction[] {
  const i = step.interaction;
  switch (i.type) {
    case "confirm":
      return [{ type: "confirm" }];
    case "choice":
      return [{ type: "select", optionId: i.options.find((o) => o.correct)!.id }];
    case "checklist":
      return i.items.map((item) => ({ type: "toggle", itemId: item.id }));
    case "order":
      return i.items.map((item) => ({ type: "pick", itemId: item.id }));
    case "timer":
      return [{ type: "timer-done" }];
    case "sort":
      return i.items.map((item) => ({ type: "place", itemId: item.id, binId: item.bin }));
  }
}

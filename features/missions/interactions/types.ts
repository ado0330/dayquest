import type { MissionStep, StepInteraction } from "@/types/mission";
import type { StepState } from "@/types/progress";
import type { StepAction } from "../engine";

export interface InteractionProps<T extends StepInteraction = StepInteraction> {
  step: MissionStep;
  interaction: T;
  state: StepState;
  dispatch: (action: StepAction) => void;
}

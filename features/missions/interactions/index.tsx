import type { ComponentType } from "react";
import type { InteractionType, StepInteraction } from "@/types/mission";
import { ChecklistStep } from "./ChecklistStep";
import { ChoiceStep } from "./ChoiceStep";
import { ConfirmStep } from "./ConfirmStep";
import { OrderStep } from "./OrderStep";
import { SortStep } from "./SortStep";
import { TimerStep } from "./TimerStep";
import type { InteractionProps } from "./types";

/**
 * Maps each interaction type to its component. This is the only place the UI
 * branches on interaction type; adding a new type means adding a component,
 * an engine case and a schema entry.
 */
const renderers: { [K in InteractionType]: ComponentType<InteractionProps<Extract<StepInteraction, { type: K }>>> } = {
  confirm: ConfirmStep,
  choice: ChoiceStep,
  checklist: ChecklistStep,
  order: OrderStep,
  timer: TimerStep,
  sort: SortStep,
};

export function StepInteractionView(props: InteractionProps) {
  const Renderer = renderers[props.interaction.type] as ComponentType<InteractionProps>;
  return <Renderer {...props} />;
}

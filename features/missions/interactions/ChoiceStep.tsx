import type { ChoiceInteraction } from "@/types/mission";
import { PictureTile, type TileState } from "./PictureTile";
import type { InteractionProps } from "./types";

/** Pick an illustrated option. After two tries, the right answer is gently suggested. */
export function ChoiceStep({ interaction, state, dispatch }: InteractionProps<ChoiceInteraction>) {
  const wrongTries = (state.tried ?? []).filter(
    (id) => interaction.options.find((o) => o.id === id)?.correct === false,
  ).length;
  const suggest = !state.done && wrongTries >= 2;
  const cols = interaction.options.length === 2 ? "grid-cols-2" : interaction.options.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3";

  return (
    <ul className={`grid gap-3 sm:gap-4 ${cols}`} aria-label="Choices">
      {interaction.options.map((option) => {
        const selected = state.selected === option.id;
        let tileState: TileState = "idle";
        if (selected) tileState = option.correct ? "good" : "retry";
        else if (suggest && option.correct) tileState = "suggested";
        return (
          <li key={option.id}>
            <PictureTile
              object={option.object}
              label={option.label}
              state={tileState}
              aria-pressed={selected}
              onClick={() => dispatch({ type: "select", optionId: option.id })}
            />
          </li>
        );
      })}
    </ul>
  );
}

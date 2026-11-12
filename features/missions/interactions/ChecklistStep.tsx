import { Icon } from "@/components/ui/Icon";
import type { ChecklistInteraction } from "@/types/mission";
import { PictureTile } from "./PictureTile";
import type { InteractionProps } from "./types";

/** Tick off every item. Items can be unticked again. */
export function ChecklistStep({ interaction, state, dispatch }: InteractionProps<ChecklistInteraction>) {
  const checked = state.items ?? [];
  const count = interaction.items.filter((i) => checked.includes(i.id)).length;
  return (
    <div className="flex flex-col gap-3">
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" aria-label="Checklist">
        {interaction.items.map((item) => {
          const on = checked.includes(item.id);
          return (
            <li key={item.id}>
              <PictureTile
                object={item.object}
                label={item.label}
                state={on ? "good" : "idle"}
                role="checkbox"
                aria-checked={on}
                onClick={() => dispatch({ type: "toggle", itemId: item.id })}
              />
            </li>
          );
        })}
      </ul>
      <p className="inline-flex items-center gap-2 font-display text-lg font-semibold text-ink" aria-live="polite">
        <Icon name="check" className="h-5 w-5 text-mint-deep" />
        {count} of {interaction.items.length} done
      </p>
    </div>
  );
}

import { ArtObject } from "@/components/illustrations/Scene";
import type { SortInteraction } from "@/types/mission";
import { PictureTile, type TileState } from "./PictureTile";
import type { InteractionProps } from "./types";

/** One item at a time: choose where it belongs. Placed items appear in their bin. */
export function SortStep({ interaction, state, dispatch }: InteractionProps<SortInteraction>) {
  const placed = state.placed ?? {};
  const current = interaction.items.find((item) => placed[item.id] !== item.bin);
  const triesForCurrent = current
    ? (state.tried ?? []).filter((t) => t.startsWith(`${current.id}:`)).length
    : 0;
  const placedCount = interaction.items.length - interaction.items.filter((i) => placed[i.id] !== i.bin).length;

  return (
    <div className="flex flex-col gap-4">
      {current ? (
        <div className="flex items-center gap-4 rounded-card border-[3px] border-ink bg-paper p-4" aria-live="polite">
          <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-theme-soft animate-pop" key={current.id}>
            <ArtObject id={current.object} className="h-20 w-20" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
              {placedCount + 1} of {interaction.items.length}
            </p>
            <p className="font-display text-2xl font-semibold leading-tight text-ink">
              Where does the {current.label.toLowerCase()} go?
            </p>
          </div>
        </div>
      ) : (
        <p className="rounded-card border-[3px] border-mint-deep bg-mint-soft p-4 font-display text-xl font-semibold text-mint-deep">
          Every one is home!
        </p>
      )}

      <ul className="grid grid-cols-3 gap-3 sm:gap-4" aria-label="Places to put things">
        {interaction.bins.map((bin) => {
          const inBin = interaction.items.filter((i) => placed[i.id] === bin.id);
          let tileState: TileState = "idle";
          if (!current) tileState = "good";
          else if (triesForCurrent >= 2 && current.bin === bin.id) tileState = "suggested";
          return (
            <li key={bin.id} className="flex flex-col gap-2">
              <PictureTile
                object={bin.object}
                label={bin.label}
                state={tileState}
                disabled={!current}
                aria-label={current ? `Put the ${current.label.toLowerCase()} in the ${bin.label.toLowerCase()}` : bin.label}
                onClick={() => current && dispatch({ type: "place", itemId: current.id, binId: bin.id })}
              />
              <div className="flex min-h-10 flex-wrap justify-center gap-1" aria-label={`In the ${bin.label.toLowerCase()}`}>
                {inBin.map((item) => (
                  <span key={item.id} className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-paper animate-pop">
                    <ArtObject id={item.object} className="h-8 w-8" label={item.label} />
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

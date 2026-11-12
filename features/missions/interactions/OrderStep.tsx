import { useMemo } from "react";
import { ArtObject } from "@/components/illustrations/Scene";
import { Button } from "@/components/ui/Button";
import type { OrderInteraction, PictureItem } from "@/types/mission";
import { ordinal } from "../engine";
import { PictureTile, type TileState } from "./PictureTile";
import type { InteractionProps } from "./types";

/** Deterministic shuffle (same order on server and client) that never returns the answer. */
export function shuffleForStep<T extends PictureItem>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 13), 2246822507) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (out.every((item, i) => item.id === items[i].id)) out.push(out.shift()!);
  return out;
}

/** Tap pictures in the right order. Placed pictures fill numbered slots. */
export function OrderStep({ step, interaction, state, dispatch }: InteractionProps<OrderInteraction>) {
  const shuffled = useMemo(() => shuffleForStep(interaction.items, step.id), [interaction.items, step.id]);
  const placed = state.items ?? [];
  const expected = interaction.items[placed.length];
  const suggest = !state.done && (state.tried?.length ?? 0) >= 2;

  return (
    <div className="flex flex-col gap-4">
      <ol className="flex flex-wrap items-center gap-2" aria-label="Your order so far">
        {interaction.items.map((_, i) => {
          const item = interaction.items.find((it) => it.id === placed[i]);
          return (
            <li
              key={i}
              className={`flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] sm:h-18 sm:w-18 ${
                item ? "border-ink bg-paper animate-pop" : "border-dashed border-ink/30 bg-paper/50"
              }`}
            >
              {item ? (
                <>
                  <ArtObject id={item.object} className="h-12 w-12" />
                  <span className="sr-only">
                    {ordinal(i)}: {item.label}
                  </span>
                </>
              ) : (
                <span className="font-display text-xl font-semibold text-ink/40">
                  {i + 1}
                  <span className="sr-only"> empty</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5" aria-label="Pictures to put in order">
        {shuffled.map((item) => {
          const position = placed.indexOf(item.id);
          const used = position >= 0;
          let tileState: TileState = used ? "used" : "idle";
          if (!used && suggest && expected?.id === item.id) tileState = "suggested";
          return (
            <li key={item.id}>
              <PictureTile
                object={item.object}
                label={item.label}
                state={tileState}
                disabled={used || state.done}
                aria-label={used ? `${item.label}, placed ${ordinal(position)}` : item.label}
                onClick={() => dispatch({ type: "pick", itemId: item.id })}
                badge={
                  used ? (
                    <span className="absolute -left-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-ink bg-theme-deep font-display font-semibold text-white">
                      {position + 1}
                    </span>
                  ) : null
                }
              />
            </li>
          );
        })}
      </ul>

      {placed.length > 0 && (
        <div>
          <Button variant="quiet" size="md" icon="replay" onClick={() => dispatch({ type: "reset" })}>
            Start the order again
          </Button>
        </div>
      )}
    </div>
  );
}

import { Icon } from "@/components/ui/Icon";
import type { ConfirmInteraction } from "@/types/mission";
import type { InteractionProps } from "./types";

/** "I did it!" — for real-world actions the child does away from the screen. */
export function ConfirmStep({ interaction, state, dispatch }: InteractionProps<ConfirmInteraction>) {
  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        aria-pressed={state.done}
        onClick={() => dispatch({ type: "confirm" })}
        className={`inline-flex min-h-18 w-full items-center justify-center gap-3 rounded-full border-[3px] border-ink px-8 font-display text-2xl font-semibold shadow-[0_5px_0_0_var(--color-ink)] transition-[transform,box-shadow] active:translate-y-1 active:shadow-[0_1px_0_0_var(--color-ink)] sm:w-auto ${
          state.done ? "bg-mint-deep text-white" : "bg-paper text-ink hover:bg-cream"
        }`}
      >
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full border-[3px] ${
            state.done ? "border-white bg-white/20" : "border-ink bg-cream"
          }`}
        >
          <Icon name="check" className={`h-6 w-6 ${state.done ? "" : "opacity-30"}`} />
        </span>
        {interaction.label}
      </button>
      {!state.done && <p className="text-base text-ink-soft">Do it for real, then tap the button.</p>}
    </div>
  );
}

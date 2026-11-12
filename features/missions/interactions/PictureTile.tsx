import type { ComponentProps, ReactNode } from "react";
import type { ArtObjectId } from "@/components/illustrations/registry";
import { ArtObject } from "@/components/illustrations/Scene";
import { Icon } from "@/components/ui/Icon";

export type TileState = "idle" | "chosen" | "good" | "retry" | "suggested" | "used";

interface PictureTileProps extends Omit<ComponentProps<"button">, "children"> {
  object: ArtObjectId;
  label: string;
  state?: TileState;
  /** Small marker in the corner, e.g. an order number. */
  badge?: ReactNode;
  size?: "md" | "lg";
}

const ring: Record<TileState, string> = {
  idle: "border-ink bg-paper hover:-translate-y-0.5 hover:shadow-lift",
  chosen: "border-ink bg-sky-soft",
  good: "border-mint-deep bg-mint-soft ring-4 ring-mint/50",
  retry: "border-sun-deep bg-sun-soft",
  suggested: "border-ink bg-paper ring-4 ring-sun animate-[pulse_1.6s_ease-in-out_infinite]",
  used: "border-ink/30 bg-cream opacity-70",
};

/** A large, tappable picture with a text label. Used by every interaction. */
export function PictureTile({ object, label, state = "idle", badge, size = "md", className = "", ...rest }: PictureTileProps) {
  return (
    <button
      type="button"
      className={`relative flex h-full w-full flex-col items-center justify-start gap-2 rounded-3xl border-[3px] p-3 text-center shadow-soft transition-[transform,box-shadow,background-color] duration-150 active:translate-y-0.5 disabled:cursor-default ${ring[state]} ${className}`}
      {...rest}
    >
      <span
        className={`flex aspect-square w-full items-center justify-center rounded-2xl bg-theme-soft/70 ${
          size === "lg" ? "max-w-40" : "max-w-32"
        }`}
      >
        <ArtObject id={object} className="h-[82%] w-[82%]" />
      </span>
      <span className="font-display text-lg font-semibold leading-tight text-ink">{label}</span>
      {state === "good" && (
        <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-ink bg-mint-deep text-white animate-pop">
          <Icon name="check" className="h-5 w-5" />
        </span>
      )}
      {state === "suggested" && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-ink bg-sun px-2.5 py-0.5 text-xs font-bold text-ink">
          Try me!
        </span>
      )}
      {badge}
    </button>
  );
}

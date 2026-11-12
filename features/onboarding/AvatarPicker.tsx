"use client";

import { useId } from "react";
import { AVATARS, Avatar } from "@/components/illustrations/Avatar";
import type { AvatarId } from "@/types/progress";

/** Choose a buddy. A radio group, so arrow keys move between buddies. */
export function AvatarPicker({ value, onChange, legend }: { value: AvatarId; onChange: (id: AvatarId) => void; legend: string }) {
  const name = useId();
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {AVATARS.map((a) => {
          const selected = value === a.id;
          return (
            <label
              key={a.id}
              className={`relative flex cursor-pointer flex-col items-center gap-2 rounded-3xl border-[3px] p-3 transition-[transform,box-shadow,background-color] has-[:focus-visible]:outline-4 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sky-deep ${
                selected ? "border-ink bg-sun-soft shadow-lift" : "border-line bg-paper hover:-translate-y-0.5 hover:border-ink"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={a.id}
                checked={selected}
                onChange={() => onChange(a.id)}
                className="sr-only"
              />
              <Avatar id={a.id} className={`h-20 w-20 sm:h-24 sm:w-24 ${selected ? "animate-wiggle" : ""}`} />
              <span className="font-display text-lg font-semibold text-ink">{a.name}</span>
              {selected && (
                <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-ink bg-mint-deep font-bold text-white" aria-hidden="true">
                  ✓
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

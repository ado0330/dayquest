"use client";

import { useId, type ReactNode } from "react";

interface SwitchProps {
  label: string;
  description?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/** An accessible on/off switch with a visible "On"/"Off" text, not just colour. */
export function Switch({ label, description, checked, onChange, disabled }: SwitchProps) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <label htmlFor={id} className="block font-semibold text-ink">
          {label}
        </label>
        {description && <p className="text-sm text-ink-soft">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-10 w-[4.75rem] shrink-0 items-center rounded-full border-[3px] border-ink transition-colors disabled:opacity-50 ${
          checked ? "bg-mint-deep" : "bg-cream-deep"
        }`}
      >
        <span
          className={`absolute text-xs font-bold ${checked ? "left-2.5 text-white" : "right-2 text-ink"}`}
          aria-hidden="true"
        >
          {checked ? "On" : "Off"}
        </span>
        <span
          className={`absolute h-7 w-7 rounded-full border-[3px] border-ink bg-paper transition-transform ${
            checked ? "translate-x-[2.35rem]" : "translate-x-[0.15rem]"
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

interface SegmentedProps<T extends string> {
  label: string;
  description?: ReactNode;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

/** A radio group styled as segmented buttons. Arrow keys move between options. */
export function Segmented<T extends string>({ label, description, value, options, onChange }: SegmentedProps<T>) {
  const name = useId();
  return (
    <fieldset className="py-3">
      <legend className="font-semibold text-ink">{label}</legend>
      {description && <p className="text-sm text-ink-soft">{description}</p>}
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`relative inline-flex min-h-11 cursor-pointer items-center rounded-full border-[3px] px-4 font-semibold transition-colors has-[:focus-visible]:outline-4 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sky-deep ${
              value === option.value ? "border-ink bg-ink text-white" : "border-line bg-paper text-ink hover:border-ink"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {value === option.value && <span aria-hidden="true" className="mr-1.5">✓</span>}
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

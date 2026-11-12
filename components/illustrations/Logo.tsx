import { P, line } from "./palette";

/** DayQuest mark: a smiling sun rising over a hill with a winding path. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="18" fill={P.skyLight} />
      <g {...line} strokeWidth="3">
        <circle cx="32" cy="30" r="13" fill={P.sun} />
        <path d="M32 9v4M15 16l3 3M49 16l-3 3M10 30h4M50 30h4" stroke={P.sunDark} />
        <path d="M2 46c12-10 24-12 30-8s18 4 30-6v32H2z" fill={P.mint} />
        <path d="M30 64c0-8 10-10 6-18" fill="none" stroke={P.white} strokeWidth="4" />
      </g>
      <circle cx="27.5" cy="29" r="1.8" fill={P.ink} />
      <circle cx="36.5" cy="29" r="1.8" fill={P.ink} />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark className="h-10 w-10 shrink-0" />
      <span className="font-display text-2xl font-semibold leading-none tracking-tight text-ink">
        Day<span className="text-coral-deep">Quest</span>
      </span>
    </span>
  );
}

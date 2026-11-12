import type { AvatarId } from "@/types/progress";
import { P, line, thin } from "./palette";

export const AVATARS: { id: AvatarId; name: string; bg: string }[] = [
  { id: "fox", name: "Fox", bg: P.coralLight },
  { id: "bear", name: "Bear", bg: P.sunLight },
  { id: "bunny", name: "Bunny", bg: P.lilacLight },
  { id: "owl", name: "Owl", bg: P.skyLight },
  { id: "frog", name: "Frog", bg: P.mintLight },
  { id: "cat", name: "Cat", bg: "#ffe0ec" },
];

export function avatarName(id: AvatarId): string {
  return AVATARS.find((a) => a.id === id)?.name ?? "Buddy";
}

/** Shared friendly face: eyes, rosy cheeks and a smile. */
function Face({ y = 64, eyeGap = 14 }: { y?: number; eyeGap?: number }) {
  return (
    <g>
      <circle cx={60 - eyeGap} cy={y} r="4.2" fill={P.ink} />
      <circle cx={60 + eyeGap} cy={y} r="4.2" fill={P.ink} />
      <circle cx={61 - eyeGap} cy={y - 1.5} r="1.3" fill={P.white} />
      <circle cx={61 + eyeGap} cy={y - 1.5} r="1.3" fill={P.white} />
      <circle cx={60 - eyeGap - 8} cy={y + 10} r="5" fill={P.coral} opacity="0.45" />
      <circle cx={60 + eyeGap + 8} cy={y + 10} r="5" fill={P.coral} opacity="0.45" />
    </g>
  );
}

function Fox() {
  return (
    <g {...line}>
      <path d="M22 18l26 22-24 18z" fill="#f28c4b" />
      <path d="M98 18L72 40l24 18z" fill="#f28c4b" />
      <path d="M28 28l12 12-10 8z" fill={P.ink} stroke="none" opacity="0.8" />
      <path d="M92 28L80 40l10 8z" fill={P.ink} stroke="none" opacity="0.8" />
      <path d="M20 56c0-18 18-30 40-30s40 12 40 30c0 26-18 46-40 46S20 82 20 56z" fill="#f28c4b" />
      <path d="M24 66c10 0 24 6 36 26 12-20 26-26 36-26-4 20-18 36-36 36S28 86 24 66z" fill={P.white} />
      <Face y={60} />
      <path d="M54 82h12l-6 6z" fill={P.ink} />
    </g>
  );
}

function Bear() {
  return (
    <g {...line}>
      <circle cx="28" cy="30" r="14" fill={P.woodDark} />
      <circle cx="92" cy="30" r="14" fill={P.woodDark} />
      <circle cx="28" cy="30" r="6" fill={P.wood} stroke="none" />
      <circle cx="92" cy="30" r="6" fill={P.wood} stroke="none" />
      <circle cx="60" cy="64" r="42" fill={P.woodDark} />
      <ellipse cx="60" cy="80" rx="18" ry="14" fill={P.wood} />
      <Face y={60} eyeGap={16} />
      <path d="M53 76h14l-7 6z" fill={P.ink} />
      <path d="M60 82v4c-2 4-6 4-8 2M60 86c2 4 6 4 8 2" fill="none" {...thin} />
    </g>
  );
}

function Bunny() {
  return (
    <g {...line}>
      <path d="M36 50C26 30 28 6 40 6s14 26 10 44z" fill={P.white} />
      <path d="M84 50c10-20 8-44-4-44S66 32 70 50z" fill={P.white} />
      <path d="M38 44c-4-12-2-28 3-30 4 4 4 18 3 30z" fill="#ffc6d9" stroke="none" />
      <path d="M82 44c4-12 2-28-3-30-4 4-4 18-3 30z" fill="#ffc6d9" stroke="none" />
      <path d="M18 72c0-24 18-36 42-36s42 12 42 36c0 20-18 34-42 34S18 92 18 72z" fill={P.white} />
      <Face y={70} />
      <path d="M55 82h10l-5 5z" fill="#ff8fb1" />
      <path d="M60 87v3c-2 3-5 3-7 1M60 90c2 3 5 3 7 1" fill="none" {...thin} />
    </g>
  );
}

function Owl() {
  return (
    <g {...line}>
      <path d="M24 26l14 14M96 26L82 40" strokeWidth="6" />
      <path d="M20 60c0-24 18-38 40-38s40 14 40 38c0 26-16 46-40 46S20 86 20 60z" fill={P.skyDark} />
      <path d="M36 90c6 8 14 12 24 12s18-4 24-12c-6-10-14-14-24-14s-18 4-24 14z" fill={P.skyLight} {...thin} />
      <circle cx="44" cy="58" r="15" fill={P.white} />
      <circle cx="76" cy="58" r="15" fill={P.white} />
      <circle cx="44" cy="58" r="6" fill={P.ink} />
      <circle cx="76" cy="58" r="6" fill={P.ink} />
      <circle cx="46" cy="56" r="2" fill={P.white} stroke="none" />
      <circle cx="78" cy="56" r="2" fill={P.white} stroke="none" />
      <path d="M54 72h12l-6 9z" fill={P.sun} />
    </g>
  );
}

function Frog() {
  return (
    <g {...line}>
      <circle cx="36" cy="36" r="18" fill={P.mint} />
      <circle cx="84" cy="36" r="18" fill={P.mint} />
      <circle cx="36" cy="36" r="10" fill={P.white} {...thin} />
      <circle cx="84" cy="36" r="10" fill={P.white} {...thin} />
      <circle cx="37" cy="37" r="5" fill={P.ink} stroke="none" />
      <circle cx="85" cy="37" r="5" fill={P.ink} stroke="none" />
      <path d="M14 70c0-22 20-30 46-30s46 8 46 30-20 34-46 34-46-12-46-34z" fill={P.mint} />
      <path d="M36 74c8 10 40 10 48 0" fill="none" strokeWidth="4" />
      <circle cx="28" cy="80" r="6" fill={P.coral} opacity="0.45" stroke="none" />
      <circle cx="92" cy="80" r="6" fill={P.coral} opacity="0.45" stroke="none" />
      <circle cx="52" cy="58" r="1.8" fill={P.ink} stroke="none" />
      <circle cx="68" cy="58" r="1.8" fill={P.ink} stroke="none" />
    </g>
  );
}

function Cat() {
  return (
    <g {...line}>
      <path d="M22 54L26 14l30 22z" fill={P.sun} />
      <path d="M98 54L94 14 64 36z" fill={P.sun} />
      <path d="M30 40l2-16 12 10z" fill="#ffc6d9" stroke="none" />
      <path d="M90 40l-2-16-12 10z" fill="#ffc6d9" stroke="none" />
      <path d="M18 66c0-22 18-34 42-34s42 12 42 34c0 22-18 38-42 38S18 88 18 66z" fill={P.sun} />
      <path d="M48 36c4 6 4 12 0 16M60 34v16M72 36c-4 6-4 12 0 16" fill="none" stroke={P.sunDark} strokeWidth="4" />
      <Face y={66} />
      <path d="M55 78h10l-5 5z" fill="#ff8fb1" />
      <path d="M60 83v3c-2 3-5 3-7 1M60 86c2 3 5 3 7 1" fill="none" {...thin} />
      <path d="M10 76l18 2M10 86l18-2M110 76l-18 2M110 86l-18-2" {...thin} />
    </g>
  );
}

const DRAWINGS: Record<AvatarId, () => React.JSX.Element> = {
  fox: Fox,
  bear: Bear,
  bunny: Bunny,
  owl: Owl,
  frog: Frog,
  cat: Cat,
};

interface AvatarProps {
  id: AvatarId;
  className?: string;
  /** Show the coloured circle behind the face. */
  withBackground?: boolean;
  label?: string;
}

export function Avatar({ id, className, withBackground = true, label }: AvatarProps) {
  const Drawing = DRAWINGS[id] ?? Fox;
  const bg = AVATARS.find((a) => a.id === id)?.bg ?? P.sunLight;
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {withBackground && <circle cx="60" cy="60" r="60" fill={bg} />}
      <g transform={withBackground ? "translate(10 10) scale(0.84)" : undefined}>
        <Drawing />
      </g>
    </svg>
  );
}

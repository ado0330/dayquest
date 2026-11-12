import { P, line, thin } from "../palette";

export function Backpack() {
  return (
    <g {...line}>
      <path d="M44 24c0-12 32-12 32 0" fill="none" strokeWidth="5" />
      <path d="M26 46c0-16 14-26 34-26s34 10 34 26v54c0 5-3 8-8 8H34c-5 0-8-3-8-8z" fill={P.coral} />
      <path d="M26 50c10 8 58 8 68 0" fill="none" />
      <rect x="38" y="66" width="44" height="30" rx="8" fill={P.coralDark} />
      <path d="M38 78h44" {...thin} />
      <rect x="56" y="74" width="8" height="8" rx="2" fill={P.sun} {...thin} />
      <path d="M34 34c4-4 10-6 16-6" fill="none" stroke={P.shine} strokeWidth="5" />
      <path d="M26 66h-6c-3 0-4 2-4 4v20c0 2 1 4 4 4h6M94 66h6c3 0 4 2 4 4v20c0 2-1 4-4 4h-6" fill={P.coralDark} />
    </g>
  );
}

export function Books() {
  return (
    <g {...line}>
      <rect x="18" y="80" width="84" height="20" rx="4" fill={P.sky} />
      <path d="M90 80v20" stroke={P.white} strokeWidth="5" />
      <rect x="26" y="58" width="72" height="22" rx="4" fill={P.mint} />
      <path d="M36 58v22" stroke={P.white} strokeWidth="5" />
      <rect x="22" y="38" width="76" height="20" rx="4" fill={P.sun} />
      <path d="M86 38v20" stroke={P.white} strokeWidth="5" />
      <path d="M40 30l-4-20 22 8 22-8-4 20" fill={P.white} />
      <path d="M58 18v18" {...thin} />
    </g>
  );
}

export function PencilCase() {
  return (
    <g {...line}>
      <g transform="rotate(-18 60 40)">
        <path d="M36 34h48l10 5-10 5H36z" fill={P.sun} />
        <path d="M94 39l-10 5v-10z" fill={P.wood} />
        <path d="M30 34h8v10h-8z" fill={P.coral} />
      </g>
      <rect x="12" y="54" width="96" height="44" rx="20" fill={P.lilac} />
      <path d="M20 66h80" {...thin} />
      <path d="M24 66v-4M34 66v-4M44 66v-4M54 66v-4M64 66v-4M74 66v-4M84 66v-4M94 66v-4" {...thin} />
      <rect x="96" y="62" width="12" height="9" rx="3" fill={P.sun} {...thin} />
      <path d="M24 82c6 4 14 6 20 6" fill="none" stroke={P.white} strokeWidth="4" />
    </g>
  );
}

export function WaterBottle() {
  return (
    <g {...line}>
      <rect x="44" y="6" width="32" height="14" rx="5" fill={P.mintDark} />
      <path d="M76 12h8c4 0 6 4 6 8v8" fill="none" />
      <path d="M40 30c0-6 4-10 10-10h20c6 0 10 4 10 10v72c0 4-3 6-6 6H46c-3 0-6-2-6-6z" fill={P.mint} />
      <path d="M40 54h40v28H40z" fill={P.white} />
      <path d="M60 60c-5 7-7 10-7 13a7 7 0 0 0 14 0c0-3-2-6-7-13z" fill={P.sky} {...thin} />
      <path d="M48 32v16" stroke={P.shine} strokeWidth="5" />
    </g>
  );
}

export function Lunchbox() {
  return (
    <g {...line}>
      <path d="M46 30v-8c0-4 4-6 8-6h12c4 0 8 2 8 6v8" fill="none" strokeWidth="5" />
      <rect x="12" y="30" width="96" height="74" rx="12" fill={P.sun} />
      <path d="M12 54h96" />
      <rect x="48" y="48" width="24" height="12" rx="4" fill={P.coral} />
      <path d="M38 76c4-6 14-6 18 0M64 76c4-6 14-6 18 0" fill="none" {...thin} />
      <circle cx="60" cy="90" r="4" fill={P.coralLight} stroke="none" />
      <path d="M22 40h20" stroke={P.shine} strokeWidth="5" />
    </g>
  );
}

export function Folder() {
  return (
    <g {...line}>
      <rect x="34" y="14" width="56" height="70" rx="4" fill={P.white} transform="rotate(8 62 50)" />
      <path d="M46 30h28M44 42h32M42 54h24" {...thin} transform="rotate(8 62 50)" />
      <path d="M12 40c0-4 3-6 6-6h26l8 8h50c3 0 6 3 6 6v52c0 4-3 6-6 6H18c-3 0-6-2-6-6z" fill={P.sky} />
      <path d="M12 54h96" fill="none" />
      <path d="M50 74l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill={P.sun} {...thin} />
    </g>
  );
}

export function Timetable() {
  return (
    <g {...line}>
      <rect x="14" y="18" width="92" height="88" rx="10" fill={P.white} />
      <path d="M14 28c0-6 4-10 10-10h72c6 0 10 4 10 10v12H14z" fill={P.coral} />
      <path d="M36 10v16M84 10v16" strokeWidth="5" />
      <g fill={P.grey} stroke="none">
        <rect x="24" y="50" width="16" height="14" rx="3" />
        <rect x="52" y="50" width="16" height="14" rx="3" />
        <rect x="24" y="74" width="16" height="14" rx="3" />
        <rect x="80" y="74" width="16" height="14" rx="3" />
        <rect x="52" y="74" width="16" height="14" rx="3" />
      </g>
      <rect x="76" y="46" width="24" height="22" rx="5" fill={P.mint} {...thin} />
      <path d="M82 58c4 0 6-2 8-4l4 4c-2 3-6 5-12 4z" fill={P.white} {...thin} />
    </g>
  );
}

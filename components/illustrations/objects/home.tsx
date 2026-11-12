import { P, line, thin } from "../palette";

export function Bed() {
  return (
    <g {...line}>
      <rect x="8" y="30" width="20" height="74" rx="8" fill={P.wood} />
      <rect x="92" y="58" width="20" height="46" rx="8" fill={P.wood} />
      <rect x="14" y="62" width="92" height="22" rx="6" fill={P.white} />
      <rect x="20" y="48" width="28" height="16" rx="8" fill={P.white} />
      <path d="M44 56h52c5 0 8 3 8 8v20H40V60c0-2 2-4 4-4z" fill={P.sky} />
      <path d="M40 70h64" stroke={P.white} strokeWidth="3.5" />
      <path d="M62 56v28" {...thin} stroke={P.skyDark} />
      <rect x="14" y="84" width="92" height="10" rx="3" fill={P.woodDark} />
      <path d="M14 104h4M102 104h4" />
    </g>
  );
}

export function AlarmClock() {
  return (
    <g {...line}>
      <path d="M22 30a14 14 0 0 1 22-14z" fill={P.coral} />
      <path d="M98 30a14 14 0 0 0-22-14z" fill={P.coral} />
      <path d="M36 98l-8 10M84 98l8 10" />
      <circle cx="60" cy="62" r="40" fill={P.coral} />
      <circle cx="60" cy="62" r="31" fill={P.white} />
      <path d="M60 40v22l14 8" fill="none" strokeWidth="4.5" />
      <circle cx="60" cy="62" r="3.5" fill={P.ink} />
      <path d="M60 34v4M60 86v4M32 62h4M84 62h4" {...thin} />
      <path d="M104 52c3 4 3 14 0 18M110 46c5 7 5 23 0 30" fill="none" {...thin} stroke={P.sunDark} />
    </g>
  );
}

export function Door() {
  return (
    <g {...line}>
      <path d="M30 108V22c0-8 6-14 14-14h32c8 0 14 6 14 14v86z" fill={P.coral} />
      <rect x="40" y="22" width="40" height="26" rx="8" fill={P.skyLight} />
      <path d="M60 22v26" {...thin} />
      <rect x="40" y="58" width="40" height="38" rx="6" fill={P.coralLight} {...thin} />
      <circle cx="80" cy="74" r="4.5" fill={P.sun} />
      <path d="M18 108h84" />
    </g>
  );
}

export function Lamp() {
  return (
    <g {...line}>
      <path d="M20 24l-8-6M100 24l8-6M60 8V2M14 50H6M114 50h-8" stroke={P.sunDark} />
      <path d="M38 20h44l14 38H24z" fill={P.sun} />
      <path d="M44 26h8l-6 26h-8z" fill={P.shine} stroke="none" />
      <path d="M60 58v34" strokeWidth="5" />
      <path d="M36 104c0-8 10-12 24-12s24 4 24 12z" fill={P.lilac} />
      <path d="M70 58v12" {...thin} />
      <circle cx="70" cy="73" r="3" fill={P.ink} />
    </g>
  );
}

export function Rug() {
  return (
    <g {...line}>
      <ellipse cx="60" cy="84" rx="54" ry="20" fill={P.lilac} />
      <ellipse cx="60" cy="84" rx="40" ry="13" fill={P.lilacLight} {...thin} />
      <ellipse cx="60" cy="84" rx="22" ry="6" fill={P.lilac} {...thin} />
      <path d="M30 30l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill={P.sun} {...thin} />
      <path d="M84 20l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill={P.sun} {...thin} />
      <path d="M70 50l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill={P.sun} {...thin} />
    </g>
  );
}

export function BreakfastBowl() {
  return (
    <g {...line}>
      <path d="M86 14l-14 44" strokeWidth="5" />
      <ellipse cx="88" cy="12" rx="8" ry="5" fill={P.grey} transform="rotate(-70 88 12)" />
      <path d="M10 56h100c0 26-20 44-50 44S10 82 10 56z" fill={P.sky} />
      <ellipse cx="60" cy="56" rx="50" ry="12" fill={P.sunLight} />
      <g {...thin}>
        <circle cx="38" cy="54" r="6" fill={P.coral} />
        <circle cx="54" cy="50" r="5" fill={P.lilacDark} />
        <circle cx="70" cy="56" r="6" fill={P.coral} />
        <path d="M80 48c6-2 12 0 14 4-6 2-12 0-14-4z" fill={P.sun} />
      </g>
      <path d="M22 70c6 12 18 20 34 22" fill="none" stroke={P.white} strokeWidth="4" />
      <path d="M44 100h32" />
    </g>
  );
}

export function Apple() {
  return (
    <g {...line}>
      <path d="M60 30c-4-10-2-18 4-22" fill="none" />
      <path d="M64 22c6-12 20-14 26-10-4 12-16 16-26 10z" fill={P.mint} />
      <path d="M60 32c-14-10-44-6-44 28 0 26 18 48 32 48 6 0 8-3 12-3s6 3 12 3c14 0 32-22 32-48 0-34-30-38-44-28z" fill={P.coral} />
      <path d="M30 52c0-8 6-14 12-16" fill="none" stroke={P.white} strokeWidth="5" />
    </g>
  );
}

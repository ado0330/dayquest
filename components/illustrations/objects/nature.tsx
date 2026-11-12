import { P, line, thin } from "../palette";

export function Sun() {
  return (
    <g {...line}>
      <g stroke={P.sunDark} strokeWidth="5">
        <path d="M60 6v12M60 102v12M6 60h12M102 60h12M22 22l8 8M90 90l8 8M98 22l-8 8M30 90l-8 8" />
      </g>
      <circle cx="60" cy="60" r="32" fill={P.sun} />
      <circle cx="50" cy="56" r="3.2" fill={P.ink} stroke="none" />
      <circle cx="70" cy="56" r="3.2" fill={P.ink} stroke="none" />
      <path d="M50 68c6 6 14 6 20 0" fill="none" {...thin} />
      <circle cx="42" cy="66" r="4" fill={P.coralLight} stroke="none" />
      <circle cx="78" cy="66" r="4" fill={P.coralLight} stroke="none" />
    </g>
  );
}

export function Moon() {
  return (
    <g {...line}>
      <path d="M64 14a44 44 0 1 0 44 56A36 36 0 0 1 64 14z" fill={P.sun} />
      <circle cx="44" cy="70" r="3" fill={P.ink} stroke="none" />
      <path d="M58 76c-2 4-8 6-12 4" fill="none" {...thin} />
      <path d="M50 54c-4-2-8-2-10 1" fill="none" {...thin} />
      <circle cx="36" cy="80" r="4" fill={P.coralLight} stroke="none" />
      <path d="M96 18l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill={P.white} {...thin} />
      <path d="M100 48l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill={P.white} {...thin} />
    </g>
  );
}

export function Star() {
  return (
    <g {...line}>
      <path
        d="M60 10l14 30 32 4-24 22 6 32-28-16-28 16 6-32-24-22 32-4z"
        fill={P.sun}
      />
      <path d="M46 50c2-6 6-10 12-12" fill="none" stroke={P.white} strokeWidth="5" />
      <circle cx="52" cy="62" r="3" fill={P.ink} stroke="none" />
      <circle cx="68" cy="62" r="3" fill={P.ink} stroke="none" />
      <path d="M53 72c4 4 10 4 14 0" fill="none" {...thin} />
    </g>
  );
}

export function RainCloud() {
  return (
    <g {...line}>
      <path
        d="M28 68c-12 0-18-8-18-16s6-16 16-16c2-14 14-22 26-22 12 0 22 8 24 18 2-1 4-1 6-1 12 0 20 8 20 18s-8 19-20 19z"
        fill={P.white}
      />
      <path d="M34 40c2-8 8-12 16-12" fill="none" stroke={P.skyLight} strokeWidth="4" />
      <g fill={P.sky} {...thin}>
        <path d="M34 80c-3 5-4 8-4 10a4 4 0 0 0 8 0c0-2-1-5-4-10z" />
        <path d="M58 86c-3 5-4 8-4 10a4 4 0 0 0 8 0c0-2-1-5-4-10z" />
        <path d="M82 80c-3 5-4 8-4 10a4 4 0 0 0 8 0c0-2-1-5-4-10z" />
        <path d="M46 98c-2 4-3 6-3 8a3 3 0 0 0 6 0c0-2-1-4-3-8z" />
        <path d="M70 100c-2 4-3 6-3 8a3 3 0 0 0 6 0c0-2-1-4-3-8z" />
      </g>
    </g>
  );
}

export function Bubbles() {
  return (
    <g {...line} fill={P.white}>
      <circle cx="48" cy="64" r="30" fill={P.skyLight} />
      <circle cx="88" cy="40" r="18" fill={P.mintLight} />
      <circle cx="90" cy="88" r="14" fill={P.lilacLight} />
      <circle cx="24" cy="24" r="10" fill={P.white} />
      <path d="M32 54c2-8 8-14 16-14" fill="none" stroke={P.white} strokeWidth="5" />
      <path d="M82 34c2-3 4-4 7-4" fill="none" stroke={P.white} strokeWidth="4" />
    </g>
  );
}

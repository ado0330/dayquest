import { P, line, thin } from "../palette";

export function Raincoat() {
  return (
    <g {...line}>
      <path d="M42 22c4-10 32-10 36 0l4 6H38z" fill={P.sunDark} />
      <path
        d="M38 28h44l22 22-10 12-8-8v50c0 3-2 4-4 4H38c-2 0-4-1-4-4V54l-8 8-10-12z"
        fill={P.sun}
      />
      <path d="M60 30v76" />
      <circle cx="68" cy="50" r="3" fill={P.white} {...thin} />
      <circle cx="68" cy="68" r="3" fill={P.white} {...thin} />
      <circle cx="68" cy="86" r="3" fill={P.white} {...thin} />
      <path d="M42 76h12v10H42z" fill={P.sunDark} {...thin} />
      <path d="M44 36h8v28h-8z" fill={P.shine} stroke="none" />
    </g>
  );
}

export function Swimsuit() {
  return (
    <g {...line}>
      <path
        d="M38 14v20c0 10-8 18-8 30 0 14 6 26 12 38 4 4 10 6 18 6s14-2 18-6c6-12 12-24 12-38 0-12-8-20-8-30V14h-8v16c0 8-6 12-14 12s-14-4-14-12V14z"
        fill={P.coral}
      />
      <path d="M30 64c10 6 20 8 30 8s20-2 30-8" fill="none" stroke={P.white} strokeWidth="4" />
      <path d="M33 80c9 5 18 7 27 7s18-2 27-7" fill="none" stroke={P.white} strokeWidth="4" />
      <circle cx="96" cy="26" r="6" fill={P.skyLight} {...thin} />
      <circle cx="106" cy="42" r="4" fill={P.skyLight} {...thin} />
    </g>
  );
}

export function SunHat() {
  return (
    <g {...line}>
      <circle cx="96" cy="22" r="10" fill={P.sun} />
      <path d="M96 4v4M96 36v4M78 22h4M110 22h4M84 10l3 3M105 31l3 3M108 10l-3 3" />
      <ellipse cx="60" cy="80" rx="52" ry="16" fill={P.sunLight} />
      <path d="M32 78c0-26 12-38 28-38s28 12 28 38c-16 6-40 6-56 0z" fill={P.sunLight} />
      <path d="M33 68c16 6 38 6 54 0l1 8c-16 6-40 6-56 0z" fill={P.coral} {...thin} />
      <path d="M44 52c2-4 6-6 10-6" fill="none" stroke={P.white} strokeWidth="4" />
    </g>
  );
}

export function TShirt() {
  return (
    <g {...line}>
      <path
        d="M44 16c4 8 28 8 32 0l30 14-10 24-12-6v52c0 3-2 6-6 6H42c-4 0-6-3-6-6V48l-12 6-10-24z"
        fill={P.sky}
      />
      <path d="M44 16c4 8 28 8 32 0" fill="none" />
      <path d="M60 52l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill={P.sun} {...thin} />
      <path d="M42 30h6v20h-6z" fill={P.shine} stroke="none" />
    </g>
  );
}

export function Trousers() {
  return (
    <g {...line}>
      <path d="M32 12h56l6 94H70l-10-56-10 56H26z" fill={P.night} />
      <path d="M32 12h56v12H32z" fill={P.nightDark} />
      <path d="M60 24v26" />
      <path d="M40 30c2 6 6 10 12 10M80 30c-2 6-6 10-12 10" fill="none" {...thin} />
      <path d="M30 94h22M68 94h24" stroke={P.skyLight} strokeWidth="3" />
    </g>
  );
}

export function Socks() {
  return (
    <g {...line}>
      <path d="M22 14h24v50c0 6 4 10 10 14l8 6c6 4 4 16-6 16-4 0-8-2-12-4l-14-8c-6-4-10-10-10-18z" fill={P.white} />
      <path d="M22 26h24M22 38h24" stroke={P.coral} strokeWidth="5" />
      <path d="M22 14h24v8H22z" fill={P.coral} />
      <path d="M62 20h24v50c0 6 4 10 10 14l8 6c6 4 4 16-6 16-4 0-8-2-12-4l-14-8c-6-4-10-10-10-18z" fill={P.white} />
      <path d="M62 32h24M62 44h24" stroke={P.sky} strokeWidth="5" />
      <path d="M62 20h24v8H62z" fill={P.sky} />
    </g>
  );
}

function Shoe({ x, color, sole, laces }: { x: number; color: string; sole: string; laces: boolean }) {
  return (
    <g transform={`translate(${x} 0)`} {...line}>
      <path d="M6 66c0-10 6-16 14-16h10c6 0 8 6 14 10l12 8c6 4 8 10 8 14v6H6z" fill={color} />
      <path d="M4 88h64c0 6-4 10-10 10H12c-4 0-8-4-8-10z" fill={sole} />
      {laces ? (
        <path d="M28 60l8 4M24 66l8 4M32 56l8 4" {...thin} stroke={P.white} />
      ) : (
        <path d="M18 70h20" {...thin} />
      )}
      <path d="M12 60c2-4 4-6 8-6" fill="none" stroke={P.white} strokeWidth="3" />
    </g>
  );
}

export function Shoes() {
  return (
    <g>
      <Shoe x={-2} color={P.woodDark} sole={P.ink} laces={false} />
      <Shoe x={50} color={P.woodDark} sole={P.ink} laces={false} />
    </g>
  );
}

export function Sneakers() {
  return (
    <g>
      <g transform="translate(0 -14)">
        <Shoe x={-2} color={P.coral} sole={P.white} laces />
      </g>
      <Shoe x={48} color={P.coral} sole={P.white} laces />
      <path d="M100 28l6-6M104 38l8-2M92 22l2-8" {...line} stroke={P.sunDark} />
    </g>
  );
}

export function Pyjamas() {
  return (
    <g {...line}>
      <path d="M50 56h50l4 52H84l-6-32-6 32H50z" fill={P.lilacLight} />
      <g fill={P.white} stroke="none">
        <circle cx="62" cy="88" r="2.2" />
        <circle cx="92" cy="72" r="2.2" />
        <circle cx="96" cy="96" r="2.2" />
        <circle cx="58" cy="102" r="2.2" />
      </g>
      <path
        d="M36 12c4 7 20 7 24 0l28 13-9 21-11-5v36c0 3-2 5-5 5H33c-3 0-5-2-5-5V41l-11 5-9-21z"
        fill={P.lilac}
      />
      <path d="M48 16v64" {...thin} />
      <circle cx="53" cy="34" r="2.5" fill={P.white} {...thin} />
      <circle cx="53" cy="52" r="2.5" fill={P.white} {...thin} />
      <g fill={P.sunLight} stroke="none">
        <path d="M33 38a6 6 0 1 0 6-7 5 5 0 0 1-6 7z" />
        <path d="M60 64a6 6 0 1 0 6-7 5 5 0 0 1-6 7z" />
        <circle cx="36" cy="64" r="2.4" />
        <circle cx="66" cy="38" r="2.4" />
      </g>
      <path d="M100 14a9 9 0 1 0 9-11 7 7 0 0 1-9 11z" fill={P.sun} {...thin} />
    </g>
  );
}

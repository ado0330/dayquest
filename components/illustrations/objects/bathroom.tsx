import { P, line, thin } from "../palette";

/* Every object is drawn inside a 120 × 120 box, resting on y ≈ 108. */

export function Toothbrush() {
  return (
    <g {...line}>
      <g transform="rotate(-35 60 60)">
        <rect x="20" y="54" width="74" height="13" rx="6.5" fill={P.mint} />
        <rect x="26" y="57" width="34" height="4" rx="2" fill={P.shine} stroke="none" />
        <rect x="88" y="44" width="16" height="23" rx="4" fill={P.white} />
        <path d="M92 44 v-8 M97 44 v-9 M102 44 v-8" fill="none" />
      </g>
    </g>
  );
}

export function Tooth() {
  return (
    <g {...line}>
      <path
        d="M34 24c10-6 18-2 26 1 8-3 16-7 26-1 12 8 10 28 4 42-4 9-5 24-10 34-3 6-9 5-10-1l-4-18c-1-5-11-5-12 0l-4 18c-1 6-7 7-10 1-5-10-6-25-10-34-6-14-8-34 4-42z"
        fill={P.white}
      />
      <path d="M40 34c3-3 8-4 12-2" fill="none" stroke={P.skyLight} strokeWidth="5" />
      <circle cx="49" cy="56" r="3.2" fill={P.ink} stroke="none" />
      <circle cx="71" cy="56" r="3.2" fill={P.ink} stroke="none" />
      <path d="M52 66c4 5 12 5 16 0" fill="none" {...thin} />
      <circle cx="42" cy="64" r="4" fill={P.coralLight} stroke="none" />
      <circle cx="78" cy="64" r="4" fill={P.coralLight} stroke="none" />
      <path d="M96 14v12M90 20h12" stroke={P.sunDark} strokeWidth="3.5" />
      <path d="M18 86v8M14 90h8" stroke={P.sunDark} strokeWidth="3" />
    </g>
  );
}

export function Smile() {
  return (
    <g {...line}>
      <path d="M16 46c14 4 30 6 44 6s30-2 44-6c0 34-20 56-44 56S16 80 16 46z" fill={P.coralDark} />
      <path d="M22 50c12 3 26 5 38 5s26-2 38-5l-2 12c-12 3-24 4-36 4s-24-1-36-4z" fill={P.white} />
      <path d="M40 54v10M60 55v11M80 54v10" {...thin} />
      <path d="M40 86c6-8 34-8 40 0-6 8-34 8-40 0z" fill={P.coral} {...thin} />
      <path d="M100 22l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill={P.sun} {...thin} />
    </g>
  );
}

export function ToothbrushCup() {
  return (
    <g {...line}>
      <path d="M70 52 L96 14" stroke={P.ink} strokeWidth="11" />
      <path d="M70 52 L96 14" stroke={P.coral} strokeWidth="5" />
      <path d="M48 52 L28 12" stroke={P.ink} strokeWidth="11" />
      <path d="M48 52 L28 12" stroke={P.mint} strokeWidth="5" />
      <rect x="22" y="4" width="14" height="16" rx="3" fill={P.white} transform="rotate(-26 29 12)" />
      <rect x="88" y="6" width="14" height="16" rx="3" fill={P.white} transform="rotate(34 95 14)" />
      <path d="M34 50h52l-6 54c-1 4-4 6-8 6H48c-4 0-7-2-8-6z" fill={P.sky} />
      <path d="M42 58h8l-4 38h-2z" fill={P.shine} stroke="none" />
      <path d="M30 50h60" />
    </g>
  );
}

function BrushWithPaste({ big }: { big: boolean }) {
  return (
    <g {...line}>
      <rect x="10" y="72" width="70" height="13" rx="6.5" fill={P.mint} />
      <rect x="16" y="75" width="30" height="4" rx="2" fill={P.shine} stroke="none" />
      <rect x="74" y="62" width="34" height="14" rx="4" fill={P.white} />
      <path d="M80 62v-6M87 62v-7M94 62v-7M101 62v-6" fill="none" />
      {big ? (
        <path
          d="M64 54c-6-10 2-20 12-18 4-10 20-10 24-1 10-2 18 8 12 18 2 6-4 10-10 8-8 4-22 4-30-1-6 2-11-2-8-6z"
          fill={P.skyLight}
        />
      ) : (
        <circle cx="91" cy="50" r="6.5" fill={P.skyLight} />
      )}
      {big ? (
        <path d="M74 44c4-2 10-2 14 0" fill="none" stroke={P.white} strokeWidth="3" />
      ) : (
        <circle cx="89" cy="48" r="1.8" fill={P.white} stroke="none" />
      )}
    </g>
  );
}

export function PastePea() {
  return <BrushWithPaste big={false} />;
}

export function PasteBig() {
  return <BrushWithPaste big />;
}

export function Hairbrush() {
  return (
    <g {...line}>
      <g transform="rotate(-30 60 60)">
        <rect x="14" y="54" width="52" height="14" rx="7" fill={P.lilac} />
        <ellipse cx="84" cy="61" rx="24" ry="18" fill={P.lilacDark} />
        <ellipse cx="84" cy="61" rx="16" ry="11" fill={P.lilacLight} {...thin} />
        <g fill={P.ink} stroke="none">
          <circle cx="78" cy="56" r="1.8" />
          <circle cx="86" cy="55" r="1.8" />
          <circle cx="92" cy="60" r="1.8" />
          <circle cx="80" cy="64" r="1.8" />
          <circle cx="88" cy="66" r="1.8" />
          <circle cx="74" cy="61" r="1.8" />
        </g>
      </g>
    </g>
  );
}

export function Paintbrush() {
  return (
    <g {...line}>
      <g transform="rotate(-40 60 60)">
        <rect x="10" y="55" width="62" height="11" rx="5.5" fill={P.wood} />
        <rect x="70" y="52" width="14" height="17" rx="3" fill={P.grey} />
        <path d="M84 52c10 0 22 4 26 9-4 5-16 9-26 9z" fill={P.coral} />
      </g>
      <circle cx="26" cy="96" r="7" fill={P.sky} />
      <circle cx="44" cy="104" r="5" fill={P.sun} />
    </g>
  );
}

export function Sink() {
  return (
    <g {...line}>
      <path d="M58 22h20c4 0 6 3 6 6v6" fill="none" />
      <rect x="52" y="14" width="12" height="20" rx="4" fill={P.grey} />
      <path d="M84 34v6" />
      <path d="M84 46c-2 4-2 8 0 10 2-2 2-6 0-10z" fill={P.sky} {...thin} />
      <path d="M12 52h96v8c0 22-18 36-48 36S12 82 12 60z" fill={P.white} />
      <path d="M24 60c4 14 18 24 36 24" fill="none" stroke={P.skyLight} strokeWidth="4" />
      <path d="M8 52h104" />
      <rect x="50" y="94" width="20" height="14" fill={P.grey} />
    </g>
  );
}

export function SoapPump() {
  return (
    <g {...line}>
      <path d="M52 30h14v-8H44" fill="none" />
      <rect x="52" y="30" width="16" height="12" rx="3" fill={P.grey} />
      <path d="M36 50c0-6 4-8 10-8h28c6 0 10 2 10 8v50c0 5-3 8-8 8H44c-5 0-8-3-8-8z" fill={P.coralLight} />
      <path d="M44 54h6v42h-6z" fill={P.shine} stroke="none" />
      <circle cx="62" cy="74" r="10" fill={P.white} {...thin} />
      <path d="M58 74c2-4 6-4 8 0" fill="none" {...thin} />
      <circle cx="96" cy="34" r="8" fill={P.skyLight} {...thin} />
      <circle cx="104" cy="54" r="5" fill={P.skyLight} {...thin} />
      <circle cx="18" cy="42" r="6" fill={P.skyLight} {...thin} />
    </g>
  );
}

export function Towel() {
  return (
    <g {...line}>
      <path d="M14 22h92" />
      <circle cx="14" cy="22" r="5" fill={P.grey} />
      <circle cx="106" cy="22" r="5" fill={P.grey} />
      <path d="M28 22h64v76c0 5-3 8-8 8H36c-5 0-8-3-8-8z" fill={P.sky} />
      <path d="M28 76h64M28 86h64" stroke={P.white} strokeWidth="4" />
      <path d="M28 22h64v12c-20 6-44 6-64 0z" fill={P.skyDark} />
      <path d="M36 42h6v28h-6z" fill={P.shine} stroke="none" />
    </g>
  );
}

export function Toilet() {
  return (
    <g {...line}>
      <rect x="22" y="12" width="40" height="44" rx="6" fill={P.white} />
      <rect x="28" y="18" width="10" height="4" rx="2" fill={P.grey} stroke="none" />
      <path d="M18 56h74c0 18-12 30-30 32l4 20H38l2-22C26 82 18 72 18 56z" fill={P.white} />
      <ellipse cx="55" cy="56" rx="37" ry="6" fill={P.grey} />
      <path d="M30 66c6 8 14 12 24 12" fill="none" stroke={P.skyLight} strokeWidth="4" />
    </g>
  );
}

export function TissueBox() {
  return (
    <g {...line}>
      <path d="M50 46c-6-14 0-26 10-30 6 8 14 12 22 12-4 8-6 14-8 18z" fill={P.white} />
      <path d="M16 46h88v54c0 4-3 8-8 8H24c-5 0-8-4-8-8z" fill={P.lilac} />
      <rect x="40" y="46" width="40" height="8" rx="4" fill={P.lilacDark} />
      <path d="M28 70c4 4 8 4 12 0s8-4 12 0 8 4 12 0 8-4 12 0 8 4 12 0" fill="none" stroke={P.white} strokeWidth="3" />
    </g>
  );
}

function Hand({ flip = false, x = 0 }: { flip?: boolean; x?: number }) {
  return (
    <g transform={flip ? `translate(${120 + x} 0) scale(-1 1)` : `translate(${x} 0)`}>
      <path
        d="M30 108V78c-8-6-16-16-18-24-1-5 5-8 9-4l9 10V24c0-5 7-5 7 0v26-34c0-5 7-5 7 0v34-30c0-5 7-5 7 0v30-22c0-5 7-5 7 0v46c0 14-6 22-12 28v30z"
        fill={P.skin}
        {...line}
      />
      <path d="M36 50v-6M43 50v-6M50 50v-6" fill="none" stroke={P.skinDark} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

export function Hands() {
  return (
    <g>
      <Hand x={-4} />
      <Hand flip x={-4} />
    </g>
  );
}

export function HandsBubbles() {
  return (
    <g>
      <Hands />
      <g {...thin} fill={P.white}>
        <circle cx="60" cy="40" r="10" />
        <circle cx="22" cy="30" r="8" />
        <circle cx="98" cy="28" r="9" />
        <circle cx="60" cy="74" r="12" />
        <circle cx="46" cy="90" r="7" />
        <circle cx="76" cy="92" r="8" />
        <circle cx="12" cy="56" r="5" />
        <circle cx="108" cy="58" r="6" />
      </g>
      <g fill={P.skyLight} stroke="none">
        <circle cx="57" cy="37" r="3" />
        <circle cx="57" cy="70" r="3.5" />
        <circle cx="95" cy="25" r="2.5" />
      </g>
    </g>
  );
}

export function SandTimer() {
  return (
    <g {...line}>
      <rect x="26" y="8" width="68" height="12" rx="6" fill={P.wood} />
      <rect x="26" y="98" width="68" height="12" rx="6" fill={P.wood} />
      <path d="M34 20h52c0 20-18 28-18 39s18 19 18 39H34c0-20 18-28 18-39S34 40 34 20z" fill={P.skyLight} />
      <path d="M44 34h32c-4 8-12 12-16 18-4-6-12-10-16-18z" fill={P.sun} stroke="none" />
      <path d="M60 60v20" stroke={P.sunDark} strokeWidth="3" />
      <path d="M40 98c4-10 12-14 20-14s16 4 20 14z" fill={P.sun} {...thin} />
    </g>
  );
}

export function Bathtub() {
  return (
    <g {...line}>
      <path d="M22 54V26c0-8 6-12 12-12s12 4 12 12" fill="none" />
      <path d="M40 26h12" />
      <path d="M8 54h104v10c0 20-14 32-34 32H42C22 96 8 84 8 64z" fill={P.white} />
      <path d="M8 54h104" />
      <path d="M26 96l-4 12M94 96l4 12" />
      <g fill={P.white} {...thin}>
        <circle cx="34" cy="48" r="9" />
        <circle cx="50" cy="42" r="11" />
        <circle cx="68" cy="46" r="10" />
        <circle cx="86" cy="44" r="12" />
        <circle cx="102" cy="48" r="7" />
      </g>
      <path d="M20 68c6 12 18 18 30 18" fill="none" stroke={P.skyLight} strokeWidth="4" />
      <path d="M86 30c-3-2-6-2-8 0" fill="none" {...thin} />
    </g>
  );
}

export function WaterDrop() {
  return (
    <g {...line}>
      <path d="M60 10C48 30 30 50 30 72a30 30 0 0 0 60 0C90 50 72 30 60 10z" fill={P.sky} />
      <path d="M44 70c0 8 4 14 10 18" fill="none" stroke={P.white} strokeWidth="5" />
      <path d="M100 30c-4 6-8 10-8 15a8 8 0 0 0 16 0c0-5-4-9-8-15z" fill={P.skyLight} {...thin} />
    </g>
  );
}

import { P, line, thin } from "../palette";

export function Teddy() {
  return (
    <g {...line}>
      <circle cx="36" cy="22" r="11" fill={P.woodDark} />
      <circle cx="84" cy="22" r="11" fill={P.woodDark} />
      <circle cx="36" cy="22" r="5" fill={P.wood} stroke="none" />
      <circle cx="84" cy="22" r="5" fill={P.wood} stroke="none" />
      <ellipse cx="60" cy="84" rx="30" ry="26" fill={P.woodDark} />
      <ellipse cx="60" cy="88" rx="16" ry="14" fill={P.wood} stroke="none" />
      <circle cx="30" cy="102" r="10" fill={P.woodDark} />
      <circle cx="90" cy="102" r="10" fill={P.woodDark} />
      <circle cx="60" cy="40" r="26" fill={P.woodDark} />
      <ellipse cx="60" cy="48" rx="12" ry="9" fill={P.wood} {...thin} />
      <circle cx="50" cy="36" r="3" fill={P.ink} stroke="none" />
      <circle cx="70" cy="36" r="3" fill={P.ink} stroke="none" />
      <path d="M56 44h8l-4 4z" fill={P.ink} />
      <path d="M48 64l12 6 12-6-4 10H52z" fill={P.coral} {...thin} />
    </g>
  );
}

export function ToyCar() {
  return (
    <g {...line}>
      <path d="M34 50l10-18c2-3 4-4 8-4h22c4 0 6 1 8 4l10 18z" fill={P.skyLight} />
      <path d="M62 28v22" />
      <path d="M10 62c0-7 5-12 12-12h76c7 0 12 5 12 12v18c0 3-2 5-5 5H15c-3 0-5-2-5-5z" fill={P.sky} />
      <circle cx="34" cy="86" r="13" fill={P.ink} />
      <circle cx="86" cy="86" r="13" fill={P.ink} />
      <circle cx="34" cy="86" r="5" fill={P.grey} stroke="none" />
      <circle cx="86" cy="86" r="5" fill={P.grey} stroke="none" />
      <rect x="98" y="58" width="10" height="8" rx="3" fill={P.sun} {...thin} />
      <path d="M20 60h22" stroke={P.shine} strokeWidth="5" />
    </g>
  );
}

function Block({ x, y, color, letter }: { x: number; y: number; color: string; letter: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="38" height="38" rx="6" fill={color} {...line} />
      <text
        x="19"
        y="28"
        textAnchor="middle"
        fontFamily="Fredoka Variable, ui-rounded, sans-serif"
        fontWeight="700"
        fontSize="24"
        fill={P.white}
        stroke={P.ink}
        strokeWidth="1.5"
        paintOrder="stroke"
      >
        {letter}
      </text>
    </g>
  );
}

export function Blocks() {
  return (
    <g>
      <Block x={20} y={70} color={P.coral} letter="A" />
      <Block x={62} y={70} color={P.sky} letter="B" />
      <Block x={41} y={30} color={P.mint} letter="C" />
      <g transform="rotate(14 102 32)">
        <rect x="86" y="18" width="26" height="26" rx="5" fill={P.sun} {...line} />
      </g>
    </g>
  );
}

export function Ball() {
  return (
    <g {...line}>
      <circle cx="60" cy="64" r="42" fill={P.coral} />
      <path d="M22 50c24 10 52 10 76 0" fill="none" />
      <path d="M22 50c4 16 4 30 0 36" fill="none" />
      <path d="M60 22c-16 20-16 64 0 84" fill="none" />
      <path d="M38 32a42 42 0 0 1 22-10c-8 12-12 26-12 30-10 0-20-2-26-2 2-6 8-14 16-18z" fill={P.sun} />
      <path d="M72 70c10 0 20-2 30-6-2 14-10 28-26 36-2-10-4-20-4-30z" fill={P.sky} />
      <path d="M36 46c2-6 6-10 10-12" fill="none" stroke={P.white} strokeWidth="5" />
    </g>
  );
}

export function ToyBox() {
  return (
    <g {...line}>
      <circle cx="40" cy="38" r="12" fill={P.sky} />
      <rect x="62" y="22" width="20" height="20" rx="4" fill={P.sun} transform="rotate(-12 72 32)" />
      <path d="M86 44l8-16 8 16z" fill={P.mint} />
      <rect x="12" y="44" width="96" height="62" rx="8" fill={P.lilac} />
      <path d="M12 60h96" />
      <rect x="8" y="40" width="104" height="14" rx="6" fill={P.lilacDark} />
      <rect x="48" y="70" width="24" height="16" rx="6" fill={P.lilacLight} {...thin} />
      <path d="M58 74l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" fill={P.sun} stroke="none" />
    </g>
  );
}

export function Bookshelf() {
  return (
    <g {...line}>
      <rect x="14" y="8" width="92" height="100" rx="6" fill={P.wood} />
      <rect x="22" y="16" width="76" height="38" rx="3" fill={P.woodDark} />
      <rect x="22" y="62" width="76" height="38" rx="3" fill={P.woodDark} />
      <rect x="28" y="24" width="10" height="30" rx="2" fill={P.coral} {...thin} />
      <rect x="40" y="20" width="10" height="34" rx="2" fill={P.sky} {...thin} />
      <rect x="52" y="26" width="9" height="28" rx="2" fill={P.sun} {...thin} />
      <rect x="66" y="26" width="9" height="28" rx="2" fill={P.mint} transform="rotate(14 70 40)" {...thin} />
      <rect x="28" y="68" width="10" height="32" rx="2" fill={P.lilac} {...thin} />
      <rect x="40" y="72" width="9" height="28" rx="2" fill={P.mint} {...thin} />
      <circle cx="80" cy="88" r="10" fill={P.coral} {...thin} />
    </g>
  );
}

export function BlockBin() {
  return (
    <g {...line}>
      <rect x="28" y="20" width="24" height="24" rx="4" fill={P.coral} transform="rotate(-10 40 32)" />
      <rect x="58" y="16" width="24" height="24" rx="4" fill={P.sun} transform="rotate(8 70 28)" />
      <rect x="44" y="30" width="24" height="24" rx="4" fill={P.sky} />
      <path d="M12 46h96l-8 56c-1 4-4 6-8 6H28c-4 0-7-2-8-6z" fill={P.mint} />
      <path d="M8 46h104" strokeWidth="5" />
      <path d="M26 62h68M28 78h64M30 94h60" {...thin} stroke={P.mintDark} />
    </g>
  );
}

export function CrayonCup() {
  const crayon = (x: number, color: string, tilt: number) => (
    <g transform={`rotate(${tilt} ${x + 5} 50)`}>
      <rect x={x} y="14" width="10" height="44" rx="2" fill={color} {...thin} />
      <path d={`M${x} 14l5-10 5 10z`} fill={color} {...thin} />
    </g>
  );
  return (
    <g {...line}>
      {crayon(36, P.coral, -14)}
      {crayon(50, P.sun, -4)}
      {crayon(62, P.sky, 6)}
      {crayon(74, P.mint, 16)}
      <path d="M30 50h60l-6 54c-1 3-3 4-6 4H42c-3 0-5-1-6-4z" fill={P.lilac} />
      <path d="M38 64c2 10 6 18 10 22" fill="none" stroke={P.shine} strokeWidth="5" />
    </g>
  );
}

function Storybook({ cover, icon }: { cover: string; icon: "moon" | "star" | "boat" }) {
  return (
    <g {...line}>
      <path d="M26 14h66c4 0 6 2 6 6v80c0 4-2 6-6 6H26z" fill={cover} />
      <path d="M26 14c-6 0-10 4-10 10v76c0 4 4 6 10 6" fill={P.white} />
      <path d="M26 14v92" />
      <rect x="40" y="28" width="46" height="46" rx="10" fill={P.white} {...thin} />
      {icon === "moon" && <path d="M58 40a14 14 0 1 0 16 18 11 11 0 0 1-16-18z" fill={P.sun} {...thin} />}
      {icon === "star" && <path d="M63 34l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z" fill={P.sun} {...thin} />}
      {icon === "boat" && (
        <g {...thin}>
          <path d="M46 58h34l-6 10H52z" fill={P.coral} />
          <path d="M62 34v24l14-4z" fill={P.white} />
          <path d="M44 68c6 3 12 3 18 0s12-3 18 0" fill="none" stroke={P.sky} />
        </g>
      )}
      <path d="M40 84h46M40 94h30" stroke={P.white} strokeWidth="4" />
    </g>
  );
}

export function Book() {
  return <Storybook cover={P.sky} icon="star" />;
}

export function BookMoon() {
  return <Storybook cover={P.night} icon="moon" />;
}

export function BookStar() {
  return <Storybook cover={P.coral} icon="star" />;
}

export function BookBoat() {
  return <Storybook cover={P.mint} icon="boat" />;
}

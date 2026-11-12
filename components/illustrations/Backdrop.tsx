import { P, line, thin } from "./palette";
import type { BackdropId } from "./registry";

/* Backdrops are drawn in a 400 × 300 box. The floor starts at y = 232. */

const FLOOR = 232;

function Window({ x, y, night = false }: { x: number; y: number; night?: boolean }) {
  return (
    <g {...line}>
      <rect x={x} y={y} width="96" height="78" rx="12" fill={night ? P.nightDark : P.skyLight} />
      {night ? (
        <g stroke="none" fill={P.sunLight}>
          <path d={`M${x + 60} ${y + 18}a14 14 0 1 0 12 22 11 11 0 0 1-12-22z`} />
          <circle cx={x + 22} cy={y + 20} r="2.5" />
          <circle cx={x + 32} cy={y + 52} r="2" />
          <circle cx={x + 78} cy={y + 60} r="2" />
        </g>
      ) : (
        <circle cx={x + 66} cy={y + 30} r="14" fill={P.sun} {...thin} />
      )}
      <path d={`M${x + 48} ${y}v78M${x} ${y + 39}h96`} />
      <path d={`M${x - 8} ${y + 78}h112`} strokeWidth="5" />
    </g>
  );
}

function Floor({ color, edge }: { color: string; edge: string }) {
  return (
    <g>
      <rect x="0" y={FLOOR} width="400" height={300 - FLOOR} fill={color} />
      <path d={`M0 ${FLOOR}h400`} stroke={edge} strokeWidth="4" />
    </g>
  );
}

export function Backdrop({ kind }: { kind: BackdropId }) {
  switch (kind) {
    case "bedroom":
      return (
        <g>
          <rect width="400" height="300" fill="#fff1d9" />
          <Window x={278} y={34} />
          <g {...thin}>
            <rect x="34" y="40" width="54" height="42" rx="6" fill={P.white} />
            <path d="M42 74l12-16 10 10 8-6 10 12z" fill={P.mintLight} />
          </g>
          <Floor color="#f2d3a8" edge={P.woodDark} />
          <path d="M40 262h60M160 276h80M300 258h50" stroke={P.woodDark} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        </g>
      );
    case "bathroom":
      return (
        <g>
          <rect width="400" height="300" fill="#e4f7ef" />
          <g stroke="#c5ead9" strokeWidth="3">
            {[40, 80, 120, 160, 200].map((y) => (
              <path key={y} d={`M0 ${y}h400`} />
            ))}
            {[50, 100, 150, 200, 250, 300, 350].map((x) => (
              <path key={x} d={`M${x} 0v${FLOOR}`} />
            ))}
          </g>
          <g {...thin} fill={P.white}>
            <circle cx="340" cy="54" r="12" />
            <circle cx="362" cy="84" r="7" />
            <circle cx="44" cy="70" r="9" />
          </g>
          <Floor color="#bfe8d6" edge={P.mintDark} />
        </g>
      );
    case "kitchen":
      return (
        <g>
          <rect width="400" height="300" fill="#ffede5" />
          <Window x={36} y={34} />
          <g {...thin}>
            <path d="M330 30v26" />
            <path d="M306 56h48l-8 22h-32z" fill={P.mint} />
            <path d="M312 56c0-14 36-14 36 0" fill={P.mintLight} />
          </g>
          <Floor color="#ffd2c4" edge={P.coralDark} />
          <g fill="#ffbfae" stroke="none">
            {[0, 80, 160, 240, 320].map((x) => (
              <rect key={x} x={x} y={FLOOR + 2} width="40" height="34" />
            ))}
            {[40, 120, 200, 280, 360].map((x) => (
              <rect key={x} x={x} y={FLOOR + 36} width="40" height="34" />
            ))}
          </g>
        </g>
      );
    case "school":
      return (
        <g>
          <rect width="400" height="300" fill="#e5f3fd" />
          <g {...line}>
            <rect x="28" y="30" width="130" height="80" rx="8" fill="#2f6b5a" />
            <path d="M44 60c10-8 20 8 30 0M44 82h36M96 56l8 8 16-18" fill="none" stroke={P.white} strokeWidth="3" />
          </g>
          <g {...thin}>
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M${236 + i * 30} 30l15 22 15-22`}
                fill={[P.coral, P.sun, P.mint, P.sky, P.lilac][i]}
              />
            ))}
            <path d="M226 30h170" fill="none" />
          </g>
          <Floor color="#c9e5f8" edge={P.skyDark} />
        </g>
      );
    case "playroom":
      return (
        <g>
          <rect width="400" height="300" fill="#f1ecff" />
          <g {...thin}>
            <path d="M0 26c60 30 140 30 200 0s140-30 200 0" fill="none" />
            {[30, 80, 130, 180, 230, 280, 330, 375].map((x, i) => (
              <path
                key={x}
                d={`M${x - 12} ${30 + Math.sin(i) * 8}l12 24 12-24z`}
                fill={[P.coral, P.sun, P.mint, P.sky][i % 4]}
              />
            ))}
          </g>
          <Floor color="#ddd2fb" edge={P.lilacDark} />
          <ellipse cx="200" cy="270" rx="150" ry="22" fill={P.lilacLight} stroke={P.lilacDark} strokeWidth="3" />
        </g>
      );
    case "night":
      return (
        <g>
          <rect width="400" height="300" fill="#3b3f8f" />
          <g fill={P.sunLight}>
            {[
              [40, 40, 2.5],
              [110, 70, 2],
              [190, 28, 3],
              [250, 90, 2],
              [360, 120, 2.5],
              [70, 140, 2],
              [330, 30, 2],
            ].map(([x, y, r]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
            ))}
          </g>
          <path d="M150 60l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill={P.sunLight} />
          <Window x={278} y={34} night />
          <Floor color="#2e3173" edge="#22245a" />
        </g>
      );
    case "outdoors":
      return (
        <g>
          <rect width="400" height="300" fill="#d7eefc" />
          <circle cx="330" cy="62" r="30" fill={P.sun} {...line} />
          <path
            d="M40 70c-10 0-16-6-16-12s6-12 14-12c2-10 10-14 18-14 10 0 16 6 18 14 8 0 14 6 14 12s-6 12-14 12z"
            fill={P.white}
            {...thin}
          />
          <path d="M0 220c60-50 140-50 200-20s120 20 200-20v120H0z" fill={P.mintLight} stroke={P.mintDark} strokeWidth="3" />
          <rect x="0" y={FLOOR + 10} width="400" height="60" fill={P.mint} />
        </g>
      );
    case "rainy":
      return (
        <g>
          <rect width="400" height="300" fill="#dde7f3" />
          <g stroke={P.skyDark} strokeWidth="3" strokeLinecap="round" opacity="0.45">
            {[30, 70, 110, 150, 190, 230, 270, 310, 350, 390].map((x, i) => (
              <path key={x} d={`M${x} ${30 + (i % 3) * 30}l-8 18`} />
            ))}
            {[50, 130, 210, 290, 370].map((x) => (
              <path key={x} d={`M${x} 150l-8 18`} />
            ))}
          </g>
          <path d="M0 226c80-40 160-36 220-14s120 18 180-14v102H0z" fill={P.mintLight} stroke={P.mintDark} strokeWidth="3" />
          <rect x="0" y={FLOOR + 14} width="400" height="60" fill="#8fd8b8" />
          <ellipse cx="90" cy="270" rx="44" ry="8" fill={P.skyLight} stroke={P.skyDark} strokeWidth="2.5" />
        </g>
      );
  }
}

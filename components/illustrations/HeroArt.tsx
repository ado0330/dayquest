import type { AvatarId } from "@/types/progress";
import { Avatar } from "./Avatar";
import { P, line, thin } from "./palette";
import { artObjects, type ArtObjectId } from "./registry";

const STOPS: { x: number; y: number; object: ArtObjectId }[] = [
  { x: 70, y: 214, object: "toothbrush" },
  { x: 168, y: 168, object: "backpack" },
  { x: 268, y: 196, object: "toy-box" },
  { x: 352, y: 142, object: "moon" },
];

/**
 * Home hero: the child's buddy on a winding adventure path past everyday
 * routines, under a big friendly sun.
 */
export function HeroArt({ avatar, className }: { avatar: AvatarId; className?: string }) {
  return (
    <svg viewBox="0 0 440 320" className={className} aria-hidden="true" focusable="false">
      <rect width="440" height="320" fill="#d9effd" />
      <g {...line}>
        <circle cx="356" cy="62" r="34" fill={P.sun} />
        <path d="M356 14v8M356 102v8M308 62h8M396 62h8M322 28l6 6M384 90l6 6M390 28l-6 6" stroke={P.sunDark} strokeWidth="4" />
      </g>
      <circle cx="346" cy="58" r="3" fill={P.ink} />
      <circle cx="366" cy="58" r="3" fill={P.ink} />
      <path d="M346 70c6 6 14 6 20 0" fill="none" {...thin} />
      <path
        d="M54 70c-10 0-16-6-16-12s6-12 14-12c2-10 10-14 18-14 10 0 16 6 18 14 8 0 14 6 14 12s-6 12-14 12z"
        fill={P.white}
        {...thin}
      />
      <path d="M176 44c-7 0-11-4-11-8s4-8 10-8c1-7 7-10 12-10 7 0 11 4 12 10 6 0 10 4 10 8s-4 8-10 8z" fill={P.white} {...thin} />

      <path d="M0 196c70-46 150-56 220-30s150 10 220-36v190H0z" fill={P.mintLight} stroke={P.mintDark} strokeWidth="3" />
      <path d="M0 248c90-30 190-26 260-8s130 4 180-18v98H0z" fill={P.mint} stroke={P.mintDark} strokeWidth="3" />

      {/* winding path linking the routine stops */}
      <path
        d="M20 300C40 250 60 230 90 228s60-20 96-50 70 26 100 26 50-44 86-56"
        fill="none"
        stroke={P.white}
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d="M20 300C40 250 60 230 90 228s60-20 96-50 70 26 100 26 50-44 86-56"
        fill="none"
        stroke={P.sunLight}
        strokeWidth="5"
        strokeDasharray="2 14"
        strokeLinecap="round"
      />

      {STOPS.map(({ x, y, object }) => {
        const Drawing = artObjects[object];
        return (
          <g key={object}>
            <circle cx={x} cy={y} r="26" fill={P.white} {...line} />
            <svg x={x - 19} y={y - 19} width="38" height="38" viewBox="0 0 120 120">
              <Drawing />
            </svg>
          </g>
        );
      })}

      <g {...thin} fill={P.coral}>
        <path d="M394 140v-34" fill="none" strokeWidth="3" />
        <path d="M394 106l24 8-24 8z" />
      </g>

      <ellipse cx="128" cy="292" rx="44" ry="8" fill={P.shadow} />
      <svg x="78" y="186" width="100" height="100" viewBox="0 0 120 120">
        <Avatar id={avatar} withBackground={false} />
      </svg>
    </svg>
  );
}

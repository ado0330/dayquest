import type { IllustrationSpec } from "@/types/mission";
import { Backdrop } from "./Backdrop";
import { P } from "./palette";
import { artObjects, type ArtObjectId } from "./registry";

interface ArtObjectProps {
  id: ArtObjectId;
  className?: string;
  /** Accessible name. Omit for decorative use (the picture is then hidden). */
  label?: string;
}

/** A single object on its own, e.g. inside a choice button or badge. */
export function ArtObject({ id, className, label }: ArtObjectProps) {
  const Drawing = artObjects[id];
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <Drawing />
    </svg>
  );
}

/** Object slots in the 400×300 scene, by how many objects are shown. */
const LAYOUTS: Record<number, { x: number; y: number; size: number }[]> = {
  1: [{ x: 110, y: 58, size: 180 }],
  2: [
    { x: 50, y: 92, size: 148 },
    { x: 202, y: 92, size: 148 },
  ],
  3: [
    { x: 22, y: 118, size: 118 },
    { x: 141, y: 70, size: 118 },
    { x: 260, y: 118, size: 118 },
  ],
};

interface SceneProps {
  spec: IllustrationSpec;
  /** Description for screen readers. Omit when the scene is decorative. */
  alt?: string;
  className?: string;
}

/** A complete illustration: themed backdrop with objects resting on the floor. */
export function Scene({ spec, alt, className }: SceneProps) {
  const objects = spec.objects.slice(0, 3);
  const layout = LAYOUTS[objects.length] ?? [];
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role={alt ? "img" : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <Backdrop kind={spec.backdrop} />
      {objects.map((id, i) => {
        const slot = layout[i];
        const Drawing = artObjects[id];
        const footY = slot.y + slot.size * 0.92;
        return (
          <g key={`${id}-${i}`}>
            <ellipse
              cx={slot.x + slot.size / 2}
              cy={footY}
              rx={slot.size * 0.36}
              ry={slot.size * 0.06}
              fill={P.shadow}
            />
            <svg x={slot.x} y={slot.y} width={slot.size} height={slot.size} viewBox="0 0 120 120" overflow="visible">
              <Drawing />
            </svg>
          </g>
        );
      })}
    </svg>
  );
}

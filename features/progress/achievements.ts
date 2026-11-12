import type { ArtObjectId } from "@/components/illustrations/registry";
import type { Mission } from "@/types/mission";
import type { AppState } from "@/types/progress";
import { summarize } from "./progress";

/**
 * Stickers reward taking part and practising — never speed, perfection or
 * daily streaks. They are derived from progress, so nothing extra is stored.
 */
export interface Sticker {
  id: string;
  name: string;
  description: string;
  object: ArtObjectId;
  earned: (progress: AppState["progress"], missions: readonly Mission[]) => boolean;
}

export const STICKERS: Sticker[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Finish your very first mission.",
    object: "star",
    earned: (p, m) => summarize(p, m).completedMissions >= 1,
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Try three different missions.",
    object: "sun",
    earned: (p, m) => summarize(p, m).completedMissions >= 3,
  },
  {
    id: "practice-pal",
    name: "Practice Pal",
    description: "Finish missions five times. Practice helps!",
    object: "bubbles",
    earned: (p, m) => summarize(p, m).totalCompletions >= 5,
  },
  {
    id: "super-adventurer",
    name: "Super Adventurer",
    description: "Finish every mission at least once.",
    object: "moon",
    earned: (p, m) => {
      const s = summarize(p, m);
      return s.completedMissions === s.totalMissions;
    },
  },
];

export function earnedStickers(progress: AppState["progress"], missions: readonly Mission[]): Sticker[] {
  return STICKERS.filter((s) => s.earned(progress, missions));
}

/** Stickers earned in `after` that were not earned in `before`. */
export function newlyEarned(
  before: AppState["progress"],
  after: AppState["progress"],
  missions: readonly Mission[],
): Sticker[] {
  return STICKERS.filter((s) => !s.earned(before, missions) && s.earned(after, missions));
}

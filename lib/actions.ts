import { missions } from "@/data/missions";
import { newlyEarned, type Sticker } from "@/features/progress/achievements";
import { clearProgress, recordCompletion, saveRun, startRun } from "@/features/progress/progress";
import { createRun } from "@/features/missions/engine";
import type { MissionRun, Profile, Settings } from "@/types/progress";
import { getState, setState } from "./store";
import { sanitizeNickname } from "./storage/schema";

/** State-changing actions used by the UI. Each one persists immediately. */

export function beginMission(missionId: string, options: { restart?: boolean } = {}): MissionRun {
  const existing = getState().progress[missionId]?.active;
  if (existing && !options.restart) return existing;
  const run = createRun();
  setState((s) => startRun(s, missionId, run));
  return run;
}

export function saveMissionRun(missionId: string, run: MissionRun): void {
  setState((s) => saveRun(s, missionId, run));
}

/** Records a finished mission and returns any stickers it unlocked. */
export function finishMission(missionId: string): Sticker[] {
  const before = getState().progress;
  setState((s) => recordCompletion(s, missionId));
  return newlyEarned(before, getState().progress, missions);
}

export function resetAllProgress(): void {
  setState(clearProgress);
}

export function updateSettings(patch: Partial<Settings>): void {
  setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
}

export function updateProfile(patch: Partial<Profile>): void {
  setState((s) => {
    const next = { ...s.profile, ...patch };
    if (patch.nickname !== undefined) next.nickname = sanitizeNickname(patch.nickname);
    return { ...s, profile: next };
  });
}

/** Master audio switch used by the header: turns all sound on or off together. */
export function setAudioEnabled(enabled: boolean): void {
  updateSettings({ voiceGuidance: enabled, soundEffects: enabled });
}

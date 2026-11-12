import type { Mission } from "@/types/mission";
import type { AppState, MissionProgress, MissionRun, MissionStatus } from "@/types/progress";

/** Pure progress helpers shared by the store actions, screens and tests. */

export function missionStatus(progress: MissionProgress | undefined): MissionStatus {
  if (progress?.active) return "in-progress";
  if (progress && progress.completions > 0) return "completed";
  return "new";
}

export function startRun(state: AppState, missionId: string, run: MissionRun): AppState {
  const current = state.progress[missionId] ?? { completions: 0 };
  return { ...state, progress: { ...state.progress, [missionId]: { ...current, active: run } } };
}

export function saveRun(state: AppState, missionId: string, run: MissionRun): AppState {
  const current = state.progress[missionId];
  if (!current?.active) return state; // the run was finished or reset elsewhere
  return { ...state, progress: { ...state.progress, [missionId]: { ...current, active: run } } };
}

export function recordCompletion(state: AppState, missionId: string, now: Date = new Date()): AppState {
  const current = state.progress[missionId] ?? { completions: 0 };
  const iso = now.toISOString();
  const next: MissionProgress = {
    completions: current.completions + 1,
    firstCompletedAt: current.firstCompletedAt ?? iso,
    lastCompletedAt: iso,
  };
  return { ...state, progress: { ...state.progress, [missionId]: next } };
}

export function clearProgress(state: AppState): AppState {
  return { ...state, progress: {} };
}

export interface ProgressSummary {
  completedMissions: number;
  inProgressMissions: number;
  totalCompletions: number;
  totalMissions: number;
}

export function summarize(progress: AppState["progress"], missions: readonly Mission[]): ProgressSummary {
  let completedMissions = 0;
  let inProgressMissions = 0;
  let totalCompletions = 0;
  for (const m of missions) {
    const p = progress[m.id];
    if (!p) continue;
    if (p.completions > 0) completedMissions++;
    if (p.active) inProgressMissions++;
    totalCompletions += p.completions;
  }
  return { completedMissions, inProgressMissions, totalCompletions, totalMissions: missions.length };
}

/** The unfinished mission touched most recently, if any. */
export function latestInProgress(
  progress: AppState["progress"],
  missions: readonly Mission[],
): { mission: Mission; run: MissionRun } | null {
  let best: { mission: Mission; run: MissionRun } | null = null;
  for (const mission of missions) {
    const run = progress[mission.id]?.active;
    if (run && (!best || run.updatedAt > best.run.updatedAt)) best = { mission, run };
  }
  return best;
}

export type DayPart = "morning" | "day" | "evening";

export function dayPart(date: Date): DayPart {
  const h = date.getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "day";
  return "evening";
}

/**
 * Suggests what to do next: resume an unfinished mission first, otherwise a
 * not-yet-completed mission suited to the time of day, otherwise any mission.
 */
export function recommendMission(
  progress: AppState["progress"],
  missions: readonly Mission[],
  part: DayPart,
): Mission {
  const resume = latestInProgress(progress, missions);
  if (resume) return resume.mission;
  const fresh = missions.filter((m) => !progress[m.id]?.completions);
  const timely = (list: readonly Mission[]) => list.find((m) => m.timeOfDay === part);
  return timely(fresh) ?? fresh[0] ?? timely(missions) ?? missions[0];
}

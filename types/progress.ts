/**
 * Per-step interaction state. One flat shape serves every interaction type so
 * it can be validated and persisted simply; each type only uses its fields.
 */
export interface StepState {
  /** True once the step's completion behaviour is satisfied. */
  done: boolean;
  /** choice: id of the most recent selection. */
  selected?: string;
  /** choice: ids already tried (used to soften repeated hints). */
  tried?: string[];
  /** checklist: ticked item ids. order: item ids placed so far, in order. */
  items?: string[];
  /** sort: itemId -> binId for items already placed correctly. */
  placed?: Record<string, string>;
}

/** An unfinished play-through of a mission. */
export interface MissionRun {
  currentStepIndex: number;
  stepStates: Record<string, StepState>;
  startedAt: string;
  updatedAt: string;
}

export interface MissionProgress {
  /** How many times the mission has been finished. */
  completions: number;
  firstCompletedAt?: string;
  lastCompletedAt?: string;
  /** Present while a play-through is in progress. */
  active?: MissionRun;
}

export type MissionStatus = "new" | "in-progress" | "completed";

export type AvatarId = "fox" | "bear" | "bunny" | "owl" | "frog" | "cat";

export interface Profile {
  /** Optional nickname. Never a full name; capped and sanitised. */
  nickname: string;
  avatar: AvatarId;
  onboarded: boolean;
}

export type TextSize = "normal" | "large" | "x-large";
export type MotionPreference = "system" | "reduce" | "full";

export interface Settings {
  /** Show "read aloud" buttons for instructions. */
  voiceGuidance: boolean;
  /** Read each new step aloud automatically (off by default; no surprise audio). */
  autoRead: boolean;
  /** Speech rate passed to the browser's speech synthesis (0.6 – 1.2). */
  speechRate: number;
  /** Gentle chimes on success and celebration. */
  soundEffects: boolean;
  textSize: TextSize;
  motion: MotionPreference;
  highContrast: boolean;
}

export interface AppState {
  version: 1;
  profile: Profile;
  settings: Settings;
  /** Keyed by mission id. */
  progress: Record<string, MissionProgress>;
}

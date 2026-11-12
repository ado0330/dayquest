import { z } from "zod";
import type { AppState, MissionProgress, MissionRun, Settings, StepState } from "@/types/progress";

export const STORAGE_KEY = "dayquest:state";
export const STATE_VERSION = 1;

export const defaultSettings: Settings = {
  voiceGuidance: true,
  autoRead: false,
  speechRate: 0.9,
  soundEffects: true,
  textSize: "normal",
  motion: "system",
  highContrast: false,
};

export function createDefaultState(): AppState {
  return {
    version: STATE_VERSION,
    profile: { nickname: "", avatar: "fox", onboarded: false },
    settings: { ...defaultSettings },
    progress: {},
  };
}

/** Nicknames: letters, numbers, spaces and simple punctuation; 20 chars max. */
export function sanitizeNickname(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFC")
    .replace(/[^\p{L}\p{N} '\-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 20);
}

const isoDate = z.string().refine((v) => !Number.isNaN(Date.parse(v)));

const stepStateSchema = z.object({
  done: z.boolean(),
  selected: z.string().optional(),
  tried: z.array(z.string()).optional(),
  items: z.array(z.string()).optional(),
  placed: z.record(z.string(), z.string()).optional(),
});

const runSchema = z.object({
  currentStepIndex: z.number().int().min(0),
  stepStates: z.record(z.string(), z.unknown()),
  startedAt: isoDate,
  updatedAt: isoDate,
});

const progressSchema = z.object({
  completions: z.number().int().min(0).catch(0),
  firstCompletedAt: isoDate.optional().catch(undefined),
  lastCompletedAt: isoDate.optional().catch(undefined),
  active: z.unknown().optional(),
});

const settingsSchema = z.object({
  voiceGuidance: z.boolean().catch(defaultSettings.voiceGuidance),
  autoRead: z.boolean().catch(defaultSettings.autoRead),
  speechRate: z.number().min(0.6).max(1.2).catch(defaultSettings.speechRate),
  soundEffects: z.boolean().catch(defaultSettings.soundEffects),
  textSize: z.enum(["normal", "large", "x-large"]).catch(defaultSettings.textSize),
  motion: z.enum(["system", "reduce", "full"]).catch(defaultSettings.motion),
  highContrast: z.boolean().catch(defaultSettings.highContrast),
});

const profileSchema = z.object({
  nickname: z.unknown().transform(sanitizeNickname),
  avatar: z.enum(["fox", "bear", "bunny", "owl", "frog", "cat"]).catch("fox"),
  onboarded: z.boolean().catch(false),
});

/** Minimal mission shape needed to validate saved progress against content. */
export interface MissionShape {
  id: string;
  steps: { id: string }[];
}

function readRun(raw: unknown, mission: MissionShape): MissionRun | undefined {
  const parsed = runSchema.safeParse(raw);
  if (!parsed.success) return undefined;
  const stepIds = new Set(mission.steps.map((s) => s.id));
  const stepStates: Record<string, StepState> = {};
  for (const [stepId, value] of Object.entries(parsed.data.stepStates)) {
    if (!stepIds.has(stepId)) continue; // step removed from the mission
    const state = stepStateSchema.safeParse(value);
    if (state.success) stepStates[stepId] = state.data;
  }
  return {
    ...parsed.data,
    currentStepIndex: Math.min(parsed.data.currentStepIndex, mission.steps.length - 1),
    stepStates,
  };
}

/**
 * Turns whatever was found in storage into a valid AppState.
 * Never throws: unknown fields are dropped, bad values fall back to defaults,
 * progress for missions that no longer exist is discarded, and step indices
 * are clamped to the current mission content.
 */
export function parseStoredState(raw: unknown, missions: readonly MissionShape[]): AppState {
  const fallback = createDefaultState();
  if (!raw || typeof raw !== "object") return fallback;
  const input = migrate(raw as Record<string, unknown>);
  if (!input) return fallback;

  const profile = profileSchema.safeParse(input.profile ?? {});
  const settings = settingsSchema.safeParse(input.settings ?? {});

  const progress: Record<string, MissionProgress> = {};
  const rawProgress = input.progress;
  if (rawProgress && typeof rawProgress === "object") {
    for (const mission of missions) {
      const entry = progressSchema.safeParse((rawProgress as Record<string, unknown>)[mission.id]);
      if (!entry.success) continue;
      const active = readRun(entry.data.active, mission);
      const record: MissionProgress = { completions: entry.data.completions };
      if (entry.data.firstCompletedAt) record.firstCompletedAt = entry.data.firstCompletedAt;
      if (entry.data.lastCompletedAt) record.lastCompletedAt = entry.data.lastCompletedAt;
      if (active) record.active = active;
      if (record.completions > 0 || record.active) progress[mission.id] = record;
    }
  }

  return {
    version: STATE_VERSION,
    profile: profile.success ? profile.data : fallback.profile,
    settings: settings.success ? settings.data : fallback.settings,
    progress,
  };
}

/**
 * Upgrades older saved shapes to the current version. Returns null for data
 * from a newer, unknown version so it isn't misread.
 */
function migrate(input: Record<string, unknown>): Record<string, unknown> | null {
  const version = typeof input.version === "number" ? input.version : 1;
  if (version > STATE_VERSION) return null;
  // Version 1 is the first released shape; future migrations go here.
  return input;
}

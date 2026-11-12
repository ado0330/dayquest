import type { ArtObjectId, BackdropId } from "@/components/illustrations/registry";

/** Colour family used to theme a mission's cards, player and celebration. */
export type MissionTheme = "sky" | "mint" | "coral" | "sun" | "lilac" | "night";

/** A composed illustration: a themed backdrop with one to three objects. */
export interface IllustrationSpec {
  backdrop: BackdropId;
  objects: ArtObjectId[];
}

/** Something the child can see and tap inside an interaction. */
export interface PictureItem {
  id: string;
  label: string;
  object: ArtObjectId;
}

export interface ConfirmInteraction {
  type: "confirm";
  /** Button label, e.g. "I'm awake!". */
  label: string;
}

export interface ChoiceOption extends PictureItem {
  correct: boolean;
  /** Shown after choosing this option. Gentle guidance when not correct. */
  feedback: string;
}

/** Pick one illustrated option. Several options may be correct. */
export interface ChoiceInteraction {
  type: "choice";
  options: ChoiceOption[];
}

/** Tick every item in a short list. */
export interface ChecklistInteraction {
  type: "checklist";
  items: PictureItem[];
}

/** Tap the items in the right order. `items` is listed in the correct order. */
export interface OrderInteraction {
  type: "order";
  items: PictureItem[];
}

export interface TimerCue {
  /** Seconds since the timer started. */
  at: number;
  text: string;
}

/** Practise an action for a set time, with optional spoken/written cues. */
export interface TimerInteraction {
  type: "timer";
  seconds: number;
  cues: TimerCue[];
  /** Lets the child finish early ("I'm done already"). */
  allowSkip: boolean;
}

export interface SortItem extends PictureItem {
  /** Id of the bin this item belongs in. */
  bin: string;
  /** Guidance shown when the item is placed in the wrong bin. */
  hint: string;
}

/** Put each item into the right place. */
export interface SortInteraction {
  type: "sort";
  bins: PictureItem[];
  items: SortItem[];
}

export type StepInteraction =
  | ConfirmInteraction
  | ChoiceInteraction
  | ChecklistInteraction
  | OrderInteraction
  | TimerInteraction
  | SortInteraction;

export type InteractionType = StepInteraction["type"];

export interface MissionStep {
  id: string;
  /** Short heading, e.g. "Choose your clothes". */
  title: string;
  /** One clear instruction, written for early readers. */
  instruction: string;
  /** Optional alternative wording for text-to-speech. Defaults to instruction. */
  speech?: string;
  /** Extra guidance shown (and read) when the child asks for help. */
  help: string;
  illustration: IllustrationSpec;
  /** Description of the illustration for screen readers. */
  alt: string;
  interaction: StepInteraction;
  /** Encouragement shown once the step is complete. */
  successMessage: string;
  /** Optional steps can be skipped without blocking mission completion. */
  optional?: boolean;
}

export interface MissionBadge {
  name: string;
  object: ArtObjectId;
}

export interface Mission {
  id: string;
  title: string;
  /** One-line description for cards. */
  description: string;
  /** Why this routine matters, shown on the mission intro. */
  why: string;
  theme: MissionTheme;
  /** Rough time to complete in real life, in minutes. */
  durationMinutes?: number;
  /** Suggested part of the day, used to recommend missions. */
  timeOfDay: "morning" | "day" | "evening" | "any";
  cover: IllustrationSpec;
  coverAlt: string;
  steps: MissionStep[];
  completion: {
    title: string;
    message: string;
  };
  badge: MissionBadge;
}

import { useSyncExternalStore } from "react";

/**
 * The parent gate keeps young children out of settings and reset actions.
 * It is a speed bump, NOT security: anyone who can do the sum can pass.
 * An unlock lasts 10 minutes in this browser tab (sessionStorage).
 */

const KEY = "dayquest:parent-unlocked-until";
const UNLOCK_MS = 10 * 60 * 1000;
const listeners = new Set<() => void>();

function readUntil(): number {
  try {
    return Number(window.sessionStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
}

function emit() {
  for (const l of listeners) l();
}

export function unlockParentArea(now = Date.now()) {
  try {
    window.sessionStorage.setItem(KEY, String(now + UNLOCK_MS));
  } catch {
    // Without sessionStorage the unlock simply lasts until the page reloads.
    memoryUntil = now + UNLOCK_MS;
  }
  emit();
}

export function lockParentArea() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  memoryUntil = 0;
  emit();
}

let memoryUntil = 0;

function isUnlocked() {
  return Math.max(readUntil(), memoryUntil) > Date.now();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useParentUnlocked(): boolean {
  return useSyncExternalStore(subscribe, isUnlocked, () => false);
}

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

export interface GateQuestion {
  text: string;
  answer: number;
}

/** A multiplication written in words, which pre-readers can't easily solve. */
export function makeGateQuestion(random: () => number = Math.random): GateQuestion {
  const a = 3 + Math.floor(random() * 7); // 3–9
  const b = 6 + Math.floor(random() * 4); // 6–9
  return { text: `What is ${WORDS[a]} times ${WORDS[b]}?`, answer: a * b };
}

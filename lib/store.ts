import { useSyncExternalStore } from "react";
import { missions } from "@/data/missions";
import type { AppState } from "@/types/progress";
import { readJSON, removeKey, writeJSON } from "./storage/local";
import { STORAGE_KEY, createDefaultState, parseStoredState } from "./storage/schema";

/**
 * A tiny external store for app state, persisted to localStorage.
 *
 * - The server (static prerender) always sees default state.
 * - The browser loads and validates saved state on first access.
 * - Every update is written back immediately, so progress survives reloads.
 * - Changes made in another tab are picked up via the `storage` event.
 */

type Listener = () => void;

const serverState: AppState = createDefaultState();
let state: AppState = serverState;
let loaded = false;
const listeners = new Set<Listener>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = parseStoredState(readJSON(STORAGE_KEY), missions);
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    state = parseStoredState(readJSON(STORAGE_KEY), missions);
    emit();
  });
}

function emit() {
  for (const listener of listeners) listener();
}

export function getState(): AppState {
  load();
  return state;
}

export function setState(updater: (current: AppState) => AppState): void {
  load();
  const next = updater(state);
  if (next === state) return;
  state = next;
  writeJSON(STORAGE_KEY, state);
  emit();
}

/** Removes everything DayQuest saved on this device. */
export function clearAllData(): void {
  removeKey(STORAGE_KEY);
  state = createDefaultState();
  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Subscribe to a slice of state. The selector must return a value that is
 * stable between calls (a slice of state, or a primitive), not a new object.
 */
export function useAppState<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getState()),
    () => selector(serverState),
  );
}

const noopSubscribe = () => () => {};

/** False during prerender and hydration, true once running in the browser. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Test helper: forget the loaded state so the next access re-reads storage. */
export function __resetStoreForTests(): void {
  state = serverState;
  loaded = false;
  listeners.clear();
}

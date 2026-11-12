/**
 * Thin, failure-tolerant wrappers around localStorage. Storage can be missing
 * (old browsers), blocked (privacy settings) or full; none of that may crash
 * the app, so every access is guarded and reported instead.
 */

export type StorageStatus = "ok" | "unavailable" | "write-failed";

let status: StorageStatus = "ok";

export function getStorageStatus(): StorageStatus {
  return status;
}

function storage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Reads and JSON-parses a key. Returns undefined when missing or unreadable. */
export function readJSON(key: string): unknown {
  const store = storage();
  if (!store) {
    status = "unavailable";
    return undefined;
  }
  try {
    const raw = store.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined; // malformed JSON is treated as "nothing saved"
  }
}

export function writeJSON(key: string, value: unknown): boolean {
  const store = storage();
  if (!store) {
    status = "unavailable";
    return false;
  }
  try {
    store.setItem(key, JSON.stringify(value));
    status = "ok";
    return true;
  } catch {
    status = "write-failed";
    return false;
  }
}

export function removeKey(key: string): void {
  try {
    storage()?.removeItem(key);
  } catch {
    // ignore
  }
}

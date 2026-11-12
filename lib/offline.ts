import { useSyncExternalStore } from "react";

/**
 * Service worker registration and status. The worker (public/sw.js, generated
 * at build time by scripts/generate-sw.mjs) precaches the whole static app so
 * missions keep working offline once the app has loaded once.
 */

export type OfflineStatus = "unsupported" | "disabled" | "installing" | "ready" | "error";

let status: OfflineStatus = "installing";
const listeners = new Set<() => void>();

function setStatus(next: OfflineStatus) {
  status = next;
  for (const l of listeners) l();
}

export async function registerServiceWorker(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return setStatus("unsupported");
  // The dev server doesn't produce the precache list, so only register in builds.
  // Also remove any worker left over from a production preview on the same port.
  if (process.env.NODE_ENV !== "production") {
    const registrations = await navigator.serviceWorker.getRegistrations().catch(() => []);
    await Promise.all(registrations.map((r) => r.unregister()));
    return setStatus("disabled");
  }
  try {
    const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    if (registration.active && navigator.serviceWorker.controller) setStatus("ready");
    await navigator.serviceWorker.ready;
    setStatus("ready");
  } catch {
    setStatus("error");
  }
}

/**
 * Recovery path: removes the service worker and all its caches, then reloads
 * so the app is fetched fresh from the network.
 */
export async function resetOfflineCache(): Promise<void> {
  try {
    const registrations = (await navigator.serviceWorker?.getRegistrations()) ?? [];
    await Promise.all(registrations.map((r) => r.unregister()));
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith("dayquest-")).map((k) => caches.delete(k)));
    }
  } finally {
    window.location.reload();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useOfflineStatus(): OfflineStatus {
  return useSyncExternalStore(
    subscribe,
    () => status,
    () => "installing" as const,
  );
}

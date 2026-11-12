import { useSyncExternalStore } from "react";
import { useAppState } from "./store";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia?.(QUERY);
  mq?.addEventListener?.("change", callback);
  return () => mq?.removeEventListener?.("change", callback);
}

/** True when animations should be minimised (parent setting, or the OS setting). */
export function useReducedMotion(): boolean {
  const preference = useAppState((s) => s.settings.motion);
  const system = useSyncExternalStore(
    subscribe,
    () => window.matchMedia?.(QUERY).matches ?? false,
    () => false,
  );
  if (preference === "reduce") return true;
  if (preference === "full") return false;
  return system;
}

"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/Icon";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export function useOnline(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}

/** A calm, reassuring note when the device goes offline. */
export function OfflineNotice() {
  const online = useOnline();
  if (online) return null;
  return (
    <div role="status" className="border-b-2 border-sky/40 bg-sky-soft">
      <p className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-sm font-semibold text-sky-deep sm:px-6">
        <Icon name="wifiOff" className="h-5 w-5 shrink-0" />
        You&apos;re offline. That&apos;s okay — your missions and progress still work.
      </p>
    </div>
  );
}

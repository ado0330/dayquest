"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/offline";

export function ServiceWorkerRegister() {
  useEffect(() => {
    void registerServiceWorker();
  }, []);
  return null;
}

"use client";

import { useEffect } from "react";
import { useAppState } from "@/lib/store";

/**
 * Mirrors display preferences onto <html> as data attributes, which the CSS
 * in globals.css uses for text size, reduced motion and high contrast.
 * (An inline script in the root layout applies them before first paint.)
 */
export function PreferencesEffect() {
  const textSize = useAppState((s) => s.settings.textSize);
  const motion = useAppState((s) => s.settings.motion);
  const highContrast = useAppState((s) => s.settings.highContrast);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.textSize = textSize;
    root.dataset.motion = motion;
    root.dataset.contrast = highContrast ? "high" : "normal";
  }, [textSize, motion, highContrast]);

  return null;
}

/** Runs before React loads so saved preferences apply without a flash. */
export const preferencesBootScript = `(function(){try{var s=JSON.parse(localStorage.getItem("dayquest:state")||"{}").settings||{};var r=document.documentElement;if(["normal","large","x-large"].indexOf(s.textSize)>-1)r.dataset.textSize=s.textSize;if(["system","reduce","full"].indexOf(s.motion)>-1)r.dataset.motion=s.motion;if(s.highContrast===true)r.dataset.contrast="high";}catch(e){}})();`;

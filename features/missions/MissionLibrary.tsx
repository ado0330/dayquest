"use client";

import { useState } from "react";
import { ArtObject } from "@/components/illustrations/Scene";
import { missions } from "@/data/missions";
import { missionStatus } from "@/features/progress/progress";
import { useAppState } from "@/lib/store";
import type { MissionStatus } from "@/types/progress";
import { MissionCard } from "./MissionCard";

type Filter = "all" | MissionStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in-progress", label: "Keep going" },
  { value: "completed", label: "Done" },
];

const EMPTY: Record<Exclude<Filter, "all">, string> = {
  new: "You've tried every mission! You can play any of them again.",
  "in-progress": "No unfinished missions right now. Pick any mission to start!",
  completed: "No finished missions yet. Your first badge is just a few steps away!",
};

export function MissionLibrary() {
  const progress = useAppState((s) => s.progress);
  const [filter, setFilter] = useState<Filter>("all");
  const shown = missions.filter((m) => filter === "all" || missionStatus(progress[m.id]) === filter);

  return (
    <div className="bg-dots">
      <div className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6 md:pt-12">
        <h1 className="text-4xl font-semibold text-ink sm:text-5xl">Missions</h1>
        <p className="mt-2 max-w-2xl text-lg text-ink-soft">
          Choose an everyday adventure. Each one has picture steps to follow, and you can play as many times as you
          like.
        </p>

        <div role="group" aria-label="Show missions" className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={`min-h-12 rounded-full border-[3px] px-5 font-display text-lg font-semibold transition-colors ${
                filter === f.value ? "border-ink bg-ink text-white" : "border-line bg-paper text-ink hover:border-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {shown.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((m) => (
              <li key={m.id}>
                <MissionCard mission={m} progress={progress[m.id]} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-card border-[3px] border-dashed border-ink/30 bg-paper p-10 text-center">
            <ArtObject id="star" className="h-24 w-24" />
            <p className="max-w-md text-lg text-ink-soft">{filter !== "all" && EMPTY[filter]}</p>
          </div>
        )}
      </div>
    </div>
  );
}

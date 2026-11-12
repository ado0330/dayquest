"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { playSound } from "@/lib/sound";
import { useSpeech } from "@/lib/speech";
import type { TimerInteraction } from "@/types/mission";
import type { InteractionProps } from "./types";

type Status = "ready" | "running" | "paused" | "finished";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function spokenTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const parts = [];
  if (m) parts.push(`${m} minute${m === 1 ? "" : "s"}`);
  if (s || !m) parts.push(`${s} second${s === 1 ? "" : "s"}`);
  return parts.join(" ");
}

const R = 54;
const CIRCUMFERENCE = 2 * Math.PI * R;

/** Practise along with a visual timer and changing cues. */
export function TimerStep({ interaction, state, dispatch }: InteractionProps<TimerInteraction>) {
  const total = interaction.seconds * 1000;
  const [status, setStatus] = useState<Status>(state.done ? "finished" : "ready");
  const [elapsed, setElapsed] = useState(state.done ? total : 0);
  const startedAt = useRef(0);
  const banked = useRef(0);
  const { autoRead, say } = useSpeech();

  useEffect(() => {
    if (status !== "running") return;
    const id = window.setInterval(() => {
      const now = banked.current + (Date.now() - startedAt.current);
      if (now >= total) {
        window.clearInterval(id);
        setElapsed(total);
        setStatus("finished");
        dispatch({ type: "timer-done" });
      } else {
        setElapsed(now);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [status, total, dispatch]);

  const elapsedSec = Math.floor(elapsed / 1000);
  const remaining = Math.max(0, interaction.seconds - elapsedSec);
  const cueIndex = interaction.cues.reduce((acc, cue, i) => (cue.at <= elapsedSec ? i : acc), -1);
  const cue = status === "finished" ? null : interaction.cues[cueIndex];

  // Announce each new cue: a soft tick, and speech if the parent turned on auto-read.
  const lastCue = useRef(-1);
  useEffect(() => {
    if (status !== "running" || cueIndex === lastCue.current) return;
    lastCue.current = cueIndex;
    if (cueIndex < 0) return;
    playSound("tap");
    if (autoRead) say(interaction.cues[cueIndex].text, "timer-cue");
  }, [cueIndex, status, autoRead, say, interaction.cues]);

  function start() {
    startedAt.current = Date.now();
    setStatus("running");
  }
  function pause() {
    banked.current += Date.now() - startedAt.current;
    setStatus("paused");
  }
  function restart() {
    banked.current = 0;
    lastCue.current = -1;
    setElapsed(0);
    startedAt.current = Date.now();
    setStatus("running");
  }

  const fraction = Math.min(1, elapsed / total);

  return (
    <div className="flex flex-col items-center gap-4 rounded-card border-[3px] border-ink bg-paper p-5 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="64" cy="64" r={R} fill="none" stroke="var(--color-cream-deep)" strokeWidth="14" />
          <circle
            cx="64"
            cy="64"
            r={R}
            fill="none"
            stroke={status === "finished" ? "var(--color-mint-deep)" : "var(--t-deep)"}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
            style={{ transition: "stroke-dashoffset 200ms linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {status === "finished" ? (
            <Icon name="check" className="h-14 w-14 text-mint-deep" />
          ) : (
            <span className="font-display text-4xl font-semibold tabular-nums text-ink" aria-hidden="true">
              {formatTime(remaining)}
            </span>
          )}
          <span className="sr-only">
            {status === "finished" ? "Timer finished" : `${spokenTime(remaining)} left`}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-3 text-center sm:items-start sm:text-left">
        <p className="min-h-[3.5rem] font-display text-xl font-semibold text-ink" aria-live="polite">
          {status === "finished"
            ? "Time's up! You kept going the whole time."
            : status === "ready"
              ? `Press start, then keep going until the timer ends.`
              : (cue?.text ?? "Keep going!")}
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
          {status === "ready" && (
            <Button variant="theme" size="lg" icon="play" onClick={start}>
              Start timer
            </Button>
          )}
          {status === "running" && (
            <Button variant="secondary" size="lg" icon="pause" onClick={pause}>
              Pause
            </Button>
          )}
          {status === "paused" && (
            <Button variant="theme" size="lg" icon="play" onClick={start}>
              Keep going
            </Button>
          )}
          {status === "finished" && (
            <Button variant="secondary" size="lg" icon="replay" onClick={restart}>
              Do it again
            </Button>
          )}
        </div>
        {interaction.allowSkip && status !== "finished" && (
          <button
            type="button"
            onClick={() => {
              setStatus("finished");
              setElapsed(total);
              dispatch({ type: "timer-done" });
            }}
            className="min-h-11 rounded-full px-2 font-semibold text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            I already did it
          </button>
        )}
      </div>
    </div>
  );
}

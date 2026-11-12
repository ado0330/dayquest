"use client";

import { useEffect, useRef, useState } from "react";
import { ArtObject } from "@/components/illustrations/Scene";
import { Button, ButtonLink } from "@/components/ui/Button";
import type { Sticker } from "@/features/progress/achievements";
import { useReducedMotion } from "@/lib/motion";
import type { Mission } from "@/types/mission";

const ENCOURAGEMENTS = [
  "Great practising!",
  "Every step helps you learn!",
  "You should be proud of yourself!",
  "Small steps make big adventures!",
];

const CONFETTI_COLORS = ["#ff8a73", "#ffcb45", "#63d3a6", "#5ab4f0", "#a994f5"];

interface Piece {
  left: number;
  delay: number;
  duration: number;
  drift: number;
  spin: number;
  color: string;
  shape: "rect" | "circle";
}

function makeConfetti(count: number): Piece[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2.4 + Math.random() * 1.6,
    drift: (Math.random() - 0.5) * 160,
    spin: 360 + Math.random() * 540,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    shape: Math.random() > 0.5 ? "rect" : "circle",
  }));
}

/** Reusable badge medallion: the mission's badge object on a rosette with a ribbon. */
export function BadgeMedal({ mission, size = "lg" }: { mission: Mission; size?: "md" | "lg" }) {
  const box = size === "lg" ? "h-44 w-44 sm:h-52 sm:w-52" : "h-24 w-24";
  return (
    <div data-theme={mission.theme} className={`relative ${box}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M70 150 55 196l22-10 14 18 12-48z" fill="var(--t-deep)" stroke="#233047" strokeWidth="4" strokeLinejoin="round" />
        <path d="M130 150l15 46-22-10-14 18-12-48z" fill="var(--t-deep)" stroke="#233047" strokeWidth="4" strokeLinejoin="round" />
        <path
          d="M100 8l14 12 18-4 6 17 17 7-3 18 12 14-12 14 3 18-17 7-6 17-18-4-14 12-14-12-18 4-6-17-17-7 3-18-12-14 12-14-3-18 17-7 6-17 18 4z"
          fill="var(--t-base)"
          stroke="#233047"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <circle cx="100" cy="92" r="54" fill="#ffffff" stroke="#233047" strokeWidth="4" />
      </svg>
      <ArtObject id={mission.badge.object} className="absolute left-1/2 top-[46%] h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

interface CelebrationProps {
  mission: Mission;
  completions: number;
  newStickers: Sticker[];
  onReplay: () => void;
}

export function Celebration({ mission, completions, newStickers, onReplay }: CelebrationProps) {
  const reduced = useReducedMotion();
  const [confetti] = useState(() => makeConfetti(48));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const encouragement = ENCOURAGEMENTS[(completions - 1 + ENCOURAGEMENTS.length) % ENCOURAGEMENTS.length];

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div data-theme={mission.theme} className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-theme-soft px-4 py-10">
      {!reduced && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {confetti.map((p, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={
                {
                  left: `${p.left}%`,
                  width: p.shape === "rect" ? 10 : 12,
                  height: p.shape === "rect" ? 16 : 12,
                  borderRadius: p.shape === "rect" ? 3 : 999,
                  background: p.color,
                  border: "2px solid #233047",
                  "--delay": `${p.delay}s`,
                  "--dur": `${p.duration}s`,
                  "--drift": `${p.drift}px`,
                  "--spin": `${p.spin}deg`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-5 rounded-blob border-[3px] border-ink bg-paper px-6 py-8 text-center shadow-lift sm:px-10 sm:py-10">
        <div className={reduced ? "" : "animate-pop"}>
          <BadgeMedal mission={mission} />
        </div>
        <p className="rounded-full border-2 border-ink bg-sun px-4 py-1 font-display text-lg font-semibold text-ink">
          {mission.badge.name} badge{completions > 1 ? ` · earned ${completions} times` : " earned!"}
        </p>
        <h1 ref={headingRef} tabIndex={-1} className="text-5xl font-semibold leading-tight text-ink outline-none sm:text-6xl">
          {mission.completion.title}
        </h1>
        <p className="text-xl text-ink">{mission.completion.message}</p>
        <p className="font-display text-xl font-semibold text-theme-deep">{encouragement}</p>

        {newStickers.length > 0 && (
          <div className="w-full rounded-card border-[3px] border-dashed border-ink/40 bg-cream p-4" role="status">
            <p className="font-display text-lg font-semibold text-ink">New sticker{newStickers.length > 1 ? "s" : ""}!</p>
            <ul className="mt-2 flex flex-wrap justify-center gap-4">
              {newStickers.map((s) => (
                <li key={s.id} className="flex items-center gap-2">
                  <ArtObject id={s.object} className="h-12 w-12" />
                  <span className="text-left">
                    <span className="block font-display font-semibold text-ink">{s.name}</span>
                    <span className="block text-sm text-ink-soft">{s.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/missions/" size="lg" icon="map">
            More adventures
          </ButtonLink>
          <Button variant="secondary" size="lg" icon="replay" onClick={onReplay}>
            Play again
          </Button>
        </div>
        <ButtonLink href="/" variant="quiet" size="md" icon="home">
          Go home
        </ButtonLink>
      </div>
    </div>
  );
}

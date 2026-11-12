"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Avatar } from "@/components/illustrations/Avatar";
import { ArtObject } from "@/components/illustrations/Scene";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { missions } from "@/data/missions";
import { BadgeMedal } from "@/features/missions/Celebration";
import { missionHref } from "@/features/missions/MissionCard";
import { useAppState } from "@/lib/store";
import { STICKERS } from "./achievements";
import { summarize } from "./progress";

export function ProgressScreen() {
  const profile = useAppState((s) => s.profile);
  const progress = useAppState((s) => s.progress);
  const summary = useMemo(() => summarize(progress, missions), [progress]);
  const unfinished = missions.filter((m) => progress[m.id]?.active);
  const title = profile.nickname ? `${profile.nickname}'s adventures` : "My adventures";

  return (
    <div className="bg-dots">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-12">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar id={profile.avatar} className="h-20 w-20" />
          <div>
            <h1 className="text-4xl font-semibold text-ink sm:text-5xl">{title}</h1>
            <p className="mt-1 text-lg text-ink-soft">
              {summary.completedMissions === 0
                ? "Your adventure map is ready. Finish a mission to earn your first badge!"
                : `${summary.completedMissions} of ${summary.totalMissions} badges collected. Every step helps you learn!`}
            </p>
          </div>
        </div>
      </div>

      {unfinished.length > 0 && (
        <section aria-labelledby="continue-heading" className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
          <h2 id="continue-heading" className="mb-4 text-2xl font-semibold text-ink sm:text-3xl">
            Keep going
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {unfinished.map((m) => {
              const run = progress[m.id]!.active!;
              const doneSteps = m.steps.filter((s) => run.stepStates[s.id]?.done).length;
              return (
                <li key={m.id}>
                  <Link
                    href={missionHref(m)}
                    data-theme={m.theme}
                    className="flex items-center gap-4 rounded-card border-[3px] border-ink bg-theme-soft p-4 shadow-soft transition-transform hover:-translate-y-0.5"
                  >
                    <span className="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl border-[3px] border-ink bg-paper">
                      <ArtObject id={m.badge.object} className="h-14 w-14" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-xl font-semibold text-ink">{m.title}</span>
                      <span className="block text-ink-soft">
                        Step {run.currentStepIndex + 1} of {m.steps.length} · {doneSteps} done
                      </span>
                      <span className="mt-2 block h-3 overflow-hidden rounded-full border-2 border-ink bg-paper" aria-hidden="true">
                        <span className="block h-full bg-theme-deep" style={{ width: `${(doneSteps / m.steps.length) * 100}%` }} />
                      </span>
                    </span>
                    <span className="inline-flex min-h-11 items-center rounded-full border-[3px] border-ink bg-paper px-3 font-display font-semibold text-ink">
                      Resume
                      <Icon name="next" className="h-5 w-5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-labelledby="badges-heading" className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <h2 id="badges-heading" className="mb-4 text-2xl font-semibold text-ink sm:text-3xl">
          Mission badges
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {missions.map((m) => {
            const p = progress[m.id];
            const earned = (p?.completions ?? 0) > 0;
            return (
              <li key={m.id}>
                <Link
                  href={missionHref(m)}
                  className={`flex h-full flex-col items-center gap-2 rounded-card border-[3px] p-4 text-center transition-transform hover:-translate-y-0.5 ${
                    earned ? "border-ink bg-paper shadow-soft" : "border-dashed border-ink/30 bg-paper/60"
                  }`}
                >
                  <span className={earned ? "" : "opacity-35 grayscale"}>
                    <BadgeMedal mission={m} size="md" />
                  </span>
                  <span className="font-display text-lg font-semibold leading-tight text-ink">{m.badge.name}</span>
                  <span className="text-sm text-ink-soft">
                    {earned ? (p!.completions > 1 ? `Earned ${p!.completions} times` : "Earned!") : `Try ${m.title}`}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="stickers-heading" className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <h2 id="stickers-heading" className="mb-1 text-2xl font-semibold text-ink sm:text-3xl">
          Stickers
        </h2>
        <p className="mb-4 text-ink-soft">Stickers are for trying and practising — there&apos;s no rush.</p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STICKERS.map((s) => {
            const earned = s.earned(progress, missions);
            return (
              <li
                key={s.id}
                className={`flex items-center gap-3 rounded-card border-[3px] p-4 ${
                  earned ? "border-ink bg-sun-soft" : "border-dashed border-ink/30 bg-paper/60"
                }`}
              >
                <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[3px] ${earned ? "border-ink bg-paper" : "border-ink/20 bg-cream"}`}>
                  <ArtObject id={s.object} className={`h-12 w-12 ${earned ? "" : "opacity-30 grayscale"}`} />
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold text-ink">
                    {s.name}
                    <span className="sr-only">{earned ? " — earned" : " — not yet"}</span>
                  </span>
                  <span className="block text-sm text-ink-soft">{s.description}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {summary.completedMissions === 0 && (
        <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
          <ButtonLink href="/missions/" size="lg" icon="map">
            Find a mission
          </ButtonLink>
        </div>
      )}
    </div>
  );
}

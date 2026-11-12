"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/illustrations/Avatar";
import { HeroArt } from "@/components/illustrations/HeroArt";
import { ArtObject, Scene } from "@/components/illustrations/Scene";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { missions } from "@/data/missions";
import { MissionCard, StatusPill, actionLabel, missionHref } from "@/features/missions/MissionCard";
import { dayPart, latestInProgress, recommendMission, summarize, type DayPart } from "@/features/progress/progress";
import { useAppState, useHydrated } from "@/lib/store";

const GREETINGS: Record<DayPart, string> = {
  morning: "Good morning",
  day: "Good afternoon",
  evening: "Good evening",
};

export function HomeScreen() {
  const router = useRouter();
  const hydrated = useHydrated();
  const profile = useAppState((s) => s.profile);
  const progress = useAppState((s) => s.progress);

  // First visit: show the short welcome tour (it can be skipped).
  useEffect(() => {
    if (hydrated && !profile.onboarded) router.replace("/welcome/");
  }, [hydrated, profile.onboarded, router]);

  const part: DayPart = hydrated ? dayPart(new Date()) : "morning";
  const featured = useMemo(() => recommendMission(progress, missions, part), [progress, part]);
  const resume = useMemo(() => latestInProgress(progress, missions), [progress]);
  const summary = useMemo(() => summarize(progress, missions), [progress]);

  const greeting = hydrated ? GREETINGS[part] : "Hello";
  const name = profile.nickname ? `, ${profile.nickname}` : "";
  const primaryHref = missionHref(resume?.mission ?? featured);

  return (
    <div className="bg-dots">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 pt-6 sm:px-6 md:grid-cols-[1.05fr_1fr] md:pt-12">
        <div className="flex flex-col items-start gap-5 animate-rise">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1 font-display text-sm font-semibold text-ink">
            <Icon name="sparkle" className="h-4 w-4 text-sun-deep" />
            Small Steps. Big Adventures.
          </p>
          <h1 className="text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
            {greeting}
            {name}!<br />
            <span className="text-sky-deep">Ready for an adventure?</span>
          </h1>
          <p className="max-w-lg text-lg text-ink-soft sm:text-xl">
            Every day is full of little quests. Follow the pictures, one step at a time, and celebrate when you finish!
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href={primaryHref} size="xl" iconAfter="next">
              {resume ? "Continue Adventure" : "Start Adventure"}
            </ButtonLink>
            <ButtonLink href="/missions/" variant="secondary" size="lg" icon="map">
              All missions
            </ButtonLink>
          </div>
          {resume && (
            <p className="text-base text-ink-soft">
              You&apos;re on step {resume.run.currentStepIndex + 1} of {resume.mission.steps.length} in{" "}
              <strong className="text-ink">{resume.mission.title}</strong>.
            </p>
          )}
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-blob border-[3px] border-ink shadow-lift">
            <HeroArt avatar={profile.avatar} className="block h-auto w-full" />
          </div>
          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-full border-[3px] border-ink bg-paper py-1.5 pl-1.5 pr-5 shadow-soft">
            <Avatar id={profile.avatar} className="h-12 w-12" />
            <p className="font-display text-base font-semibold leading-tight text-ink">
              {summary.completedMissions === 0
                ? "Your first badge is waiting!"
                : `${summary.completedMissions} of ${summary.totalMissions} adventures done`}
            </p>
          </div>
        </div>
      </section>

      {/* Featured mission */}
      <section aria-labelledby="featured-heading" className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <h2 id="featured-heading" className="mb-4 text-2xl font-semibold text-ink sm:text-3xl">
          {resume ? "Pick up where you left off" : "Today's adventure"}
        </h2>
        <Link
          href={missionHref(featured)}
          data-theme={featured.theme}
          aria-label={`${actionLabel(progress[featured.id])}: ${featured.title}`}
          className="group grid overflow-hidden rounded-blob border-[3px] border-ink bg-theme-soft shadow-soft transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-lift md:grid-cols-[1.2fr_1fr]"
        >
          <div className="relative aspect-[4/3] border-b-[3px] border-ink md:aspect-auto md:min-h-80 md:border-b-0 md:border-r-[3px]">
            <Scene spec={featured.cover} className="absolute inset-0 h-full w-full" />
          </div>
          <div className="flex flex-col items-start gap-3 p-6 sm:p-8">
            <StatusPill mission={featured} progress={progress[featured.id]} />
            <h3 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">{featured.title}</h3>
            <p className="text-lg text-ink">{featured.description}</p>
            <p className="text-base text-ink-soft">{featured.why}</p>
            <ol className="mt-1 flex flex-wrap gap-2" aria-label="Steps in this mission">
              {featured.steps.map((step, i) => (
                <li
                  key={step.id}
                  className="flex items-center gap-1.5 rounded-full border-2 border-ink/15 bg-paper/80 py-1 pl-1 pr-3 text-sm font-semibold text-ink"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-theme-deep text-xs text-white">
                    {i + 1}
                  </span>
                  {step.title}
                </li>
              ))}
            </ol>
            <span className="mt-auto inline-flex min-h-14 items-center gap-2 rounded-full border-[3px] border-ink bg-theme-deep px-7 font-display text-lg font-semibold text-white shadow-[0_4px_0_0_var(--color-ink)]">
              {actionLabel(progress[featured.id])}
              <Icon name="next" />
            </span>
          </div>
        </Link>
      </section>

      {/* Progress summary */}
      <section aria-labelledby="trail-heading" className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <div className="flex flex-col gap-4 rounded-card border-[3px] border-ink bg-paper p-5 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 id="trail-heading" className="text-2xl font-semibold text-ink">
                My adventure trail
              </h2>
              <p className="text-ink-soft">
                {summary.completedMissions === 0
                  ? "Finish a mission to light up your first star."
                  : `You've finished ${summary.completedMissions} of ${summary.totalMissions} missions. Keep exploring!`}
              </p>
            </div>
            <Link href="/progress/" className="inline-flex min-h-11 items-center gap-1 font-display font-semibold text-sky-deep underline-offset-4 hover:underline">
              See my badges
              <Icon name="next" className="h-5 w-5" />
            </Link>
          </div>
          <ol className="grid grid-cols-3 gap-3 sm:grid-cols-6" aria-label="Missions on the adventure trail">
            {missions.map((m) => {
              const done = (progress[m.id]?.completions ?? 0) > 0;
              return (
                <li key={m.id} data-theme={m.theme} className="flex flex-col items-center gap-1.5 text-center">
                  <span
                    className={`relative flex h-16 w-16 items-center justify-center rounded-full border-[3px] sm:h-20 sm:w-20 ${
                      done ? "border-ink bg-theme-soft" : "border-dashed border-ink/30 bg-cream"
                    }`}
                  >
                    <ArtObject id={m.badge.object} className={`h-11 w-11 sm:h-14 sm:w-14 ${done ? "" : "opacity-30 grayscale"}`} />
                    {done && (
                      <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-mint-deep text-white">
                        <Icon name="check" className="h-4 w-4" />
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-semibold leading-tight text-ink-soft sm:text-sm">
                    {m.badge.name}
                    <span className="sr-only">{done ? " badge earned" : " badge not earned yet"}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Mission collection */}
      <section aria-labelledby="all-heading" className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 id="all-heading" className="text-2xl font-semibold text-ink sm:text-3xl">
            All missions
          </h2>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {missions.map((m) => (
            <li key={m.id}>
              <MissionCard mission={m} progress={progress[m.id]} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

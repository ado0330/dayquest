"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/illustrations/Avatar";
import { ArtObject, Scene } from "@/components/illustrations/Scene";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import type { Sticker } from "@/features/progress/achievements";
import { beginMission, finishMission, saveMissionRun } from "@/lib/actions";
import { playSound } from "@/lib/sound";
import { useSpeech } from "@/lib/speech";
import { getState, useAppState, useHydrated } from "@/lib/store";
import type { Mission } from "@/types/mission";
import type { AvatarId, MissionProgress } from "@/types/progress";
import { Celebration } from "./Celebration";
import {
  applyToRun,
  canFinish,
  getStepState,
  goBack,
  goNext,
  goToStep,
  nudgeFor,
  remainingSteps,
  type Feedback,
  type StepAction,
} from "./engine";
import { StepInteractionView } from "./interactions";

type Phase = "intro" | "play" | "done";

/** Navigation buttons: compact on phones, larger from the small breakpoint up. */
const NAV_BUTTON = "px-4 sm:min-h-14 sm:px-7 sm:text-lg";

/* ------------------------------------------------------------------------ */

function ReadAloudButton({ text, speechKey, label = "Read to me" }: { text: string; speechKey: string; label?: string }) {
  const speech = useSpeech();
  const [note, setNote] = useState<string | null>(null);
  if (!speech.enabled) return null;
  const speaking = speech.speakingKey === speechKey;
  return (
    <span className="relative inline-flex flex-col items-end">
      <button
        type="button"
        onClick={() => {
          if (!speech.supported) {
            setNote("This browser can't read aloud. The words are always on the screen.");
            return;
          }
          setNote(null);
          speech.toggle(text, speechKey);
        }}
        aria-pressed={speaking}
        className={`inline-flex min-h-12 items-center gap-2 rounded-full border-[3px] border-ink px-4 font-display font-semibold transition-colors ${
          speaking ? "bg-ink text-white" : "bg-paper text-ink hover:bg-cream"
        }`}
      >
        <Icon name={speaking ? "stop" : "speaker"} className={speaking ? "h-4 w-4" : "h-6 w-6"} />
        <span>{speaking ? "Stop" : label}</span>
      </button>
      {(note || speech.error) && (
        <span role="status" className="absolute right-0 top-full z-20 mt-2 w-60 rounded-2xl border-2 border-ink bg-paper p-3 text-left text-sm text-ink shadow-soft">
          {note ?? speech.error}
        </span>
      )}
    </span>
  );
}

function FeedbackBubble({ feedback, avatar }: { feedback: Feedback | null; avatar: AvatarId }) {
  return (
    <div aria-live="polite" aria-atomic="true">
      {feedback && (
        <div key={feedback.message} className="flex items-center gap-3 pb-1 pt-3 animate-rise">
          <Avatar id={avatar} className="h-11 w-11 shrink-0 sm:h-14 sm:w-14" />
          <p
            className={`rounded-3xl border-[3px] px-4 py-2 font-display text-lg font-semibold leading-snug sm:py-3 sm:text-xl ${
              feedback.tone === "success" ? "border-mint-deep bg-mint-soft text-mint-deep" : "border-sun-deep bg-sun-soft text-ink"
            }`}
          >
            {feedback.message}
          </p>
        </div>
      )}
    </div>
  );
}

function StepProgress({ mission, index, progress }: { mission: Mission; index: number; progress?: MissionProgress }) {
  const total = mission.steps.length;
  return (
    <div
      role="progressbar"
      aria-label="Mission progress"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={index + 1}
      aria-valuetext={`Step ${index + 1} of ${total}`}
      className="flex items-center gap-3"
    >
      <div className="flex flex-1 gap-1.5">
        {mission.steps.map((s, i) => {
          const done = getStepState(progress?.active, s.id).done;
          return (
            <span
              key={s.id}
              className={`h-3 flex-1 rounded-full border-2 border-ink transition-colors ${
                i === index ? "bg-sun" : done ? "bg-theme-deep" : "bg-paper"
              }`}
            />
          );
        })}
      </div>
      <span className="shrink-0 font-display text-base font-semibold text-ink" aria-hidden="true">
        Step {index + 1} of {total}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function MissionIntro({
  mission,
  progress,
  onStart,
}: {
  mission: Mission;
  progress?: MissionProgress;
  onStart: (restart: boolean) => void;
}) {
  const run = progress?.active;
  return (
    <div data-theme={mission.theme} className="min-h-dvh bg-theme-soft">
      <header className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/missions/"
          className="inline-flex min-h-12 items-center gap-1 rounded-full border-[3px] border-ink bg-paper pl-2 pr-4 font-display font-semibold text-ink hover:bg-cream"
        >
          <Icon name="back" />
          Missions
        </Link>
        <ReadAloudButton text={`${mission.title}. ${mission.why}`} speechKey={`intro-${mission.id}`} />
      </header>
      <main className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 pt-2 sm:px-6 md:grid-cols-2 md:pt-8">
        <div className="overflow-hidden rounded-blob border-[3px] border-ink bg-paper shadow-lift animate-rise">
          <Scene spec={mission.cover} alt={mission.coverAlt} className="block aspect-[4/3] h-auto w-full" />
        </div>
        <div className="flex flex-col items-start gap-4">
          <p className="inline-flex flex-wrap items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1 text-sm font-bold text-ink">
            <Icon name="flag" className="h-4 w-4" /> Mission · {mission.steps.length} steps
            {mission.durationMinutes ? ` · About ${mission.durationMinutes} min` : ""}
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-ink sm:text-5xl">{mission.title}</h1>
          <p className="text-xl text-ink">{mission.why}</p>

          {run ? (
            <div className="flex w-full flex-col gap-3 rounded-card border-[3px] border-ink bg-paper p-5">
              <p className="font-display text-xl font-semibold text-ink">
                Welcome back! You were on step {run.currentStepIndex + 1} of {mission.steps.length}.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="xl" iconAfter="next" onClick={() => onStart(false)}>
                  Keep going
                </Button>
                <Button variant="secondary" size="lg" icon="replay" onClick={() => onStart(true)}>
                  Start over
                </Button>
              </div>
            </div>
          ) : (
            <Button size="xl" iconAfter="next" onClick={() => onStart(true)}>
              {progress?.completions ? "Play again" : "Let's go!"}
            </Button>
          )}
          {progress && progress.completions > 0 && (
            <p className="inline-flex items-center gap-2 text-base text-ink-soft">
              <Icon name="star" className="h-5 w-5 text-sun-deep" />
              You&apos;ve finished this mission {progress.completions === 1 ? "once" : `${progress.completions} times`}. Practice
              makes it easier!
            </p>
          )}

          <div className="w-full">
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">What you&apos;ll do</h2>
            <ol className="grid gap-2 sm:grid-cols-2">
              {mission.steps.map((s, i) => (
                <li key={s.id} className="flex items-center gap-3 rounded-2xl bg-paper/70 p-2 pr-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-paper">
                    <ArtObject id={s.illustration.objects[0]} className="h-9 w-9" />
                  </span>
                  <span className="font-semibold text-ink">
                    <span className="text-theme-deep">{i + 1}.</span> {s.title}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

export function MissionPlayer({ mission }: { mission: Mission }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const progress = useAppState((s) => s.progress[mission.id]);
  const avatar = useAppState((s) => s.profile.avatar);
  const speech = useSpeech();
  const [phase, setPhase] = useState<Phase>("intro");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const run = progress?.active;
  const view: Phase = phase === "done" ? "done" : phase === "play" && run ? "play" : "intro";
  const stepIndex = Math.min(run?.currentStepIndex ?? 0, mission.steps.length - 1);
  const step = mission.steps[stepIndex];
  const stepState = getStepState(run, step.id);
  const isLast = stepIndex === mission.steps.length - 1;
  const { autoRead, say, stop } = speech;

  // On each new step: move focus to the instruction and optionally read it.
  useEffect(() => {
    if (view !== "play") return;
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
    if (autoRead) say(step.speech ?? step.instruction, `step-${step.id}`);
  }, [view, step.id, step.speech, step.instruction, autoRead, say]);

  // Stop any speech when leaving the mission.
  useEffect(() => () => stop(), [stop]);

  const latestRun = useCallback(() => getState().progress[mission.id]?.active, [mission.id]);

  const resetTransient = () => {
    setFeedback(null);
    setHelpOpen(false);
    stop();
  };

  const start = (restart: boolean) => {
    beginMission(mission.id, { restart });
    resetTransient();
    setPhase("play");
  };

  const stepId = step.id;
  const dispatch = useCallback(
    (action: StepAction) => {
      const current = latestRun();
      if (!current) return;
      const result = applyToRun(mission, current, stepId, action);
      saveMissionRun(mission.id, result.run);
      if (result.feedback) {
        setFeedback(result.feedback);
        playSound(result.feedback.tone === "success" ? "success" : "hint");
      }
    },
    [latestRun, mission, stepId],
  );

  const next = () => {
    const current = latestRun();
    if (!current) return;
    if (isLast) {
      if (canFinish(mission, current)) {
        const earned = finishMission(mission.id);
        stop();
        setStickers(earned);
        setPhase("done");
        playSound("celebrate");
        return;
      }
      const missing = remainingSteps(mission, current)[0];
      if (missing && missing.id !== step.id) {
        saveMissionRun(mission.id, goToStep(mission, current, mission.steps.indexOf(missing)));
        setFeedback({ tone: "hint", message: "Let's finish this step first, then we can celebrate!" });
        return;
      }
    }
    const result = goNext(mission, current);
    if (!result.ok) {
      setFeedback({ tone: "hint", message: nudgeFor(step) });
      playSound("hint");
      return;
    }
    saveMissionRun(mission.id, result.run);
    resetTransient();
  };

  const back = () => {
    const current = latestRun();
    if (!current) return;
    saveMissionRun(mission.id, goBack(current));
    resetTransient();
  };

  if (view === "done") {
    return (
      <Celebration
        mission={mission}
        completions={progress?.completions ?? 1}
        newStickers={stickers}
        onReplay={() => start(true)}
      />
    );
  }

  if (view === "intro") {
    return <MissionIntro mission={mission} progress={hydrated ? progress : undefined} onStart={start} />;
  }

  const ready = stepState.done || Boolean(step.optional);

  return (
    <div data-theme={mission.theme} className="flex min-h-dvh flex-col bg-theme-soft">
      <header className="sticky top-0 z-20 border-b-2 border-ink/10 bg-theme-soft/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Button variant="secondary" size="md" icon="pause" onClick={() => setExitOpen(true)} className="px-4">
            <span className="hidden sm:inline">Take a break</span>
            <span className="sm:hidden">Break</span>
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-semibold text-ink sm:text-lg">{mission.title}</p>
            <StepProgress mission={mission} index={stepIndex} progress={progress} />
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-5 px-4 py-5 sm:px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-8 md:py-8">
        <figure className="self-start md:sticky md:top-28">
          <div key={step.id} className="overflow-hidden rounded-blob border-[3px] border-ink bg-paper shadow-soft animate-rise">
            <Scene spec={step.illustration} alt={step.alt} className="block aspect-[4/3] h-auto w-full" />
          </div>
        </figure>

        <section aria-labelledby="step-instruction" className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-base font-semibold uppercase tracking-wide text-theme-deep">
                Step {stepIndex + 1}: {step.title}
              </p>
              <h2
                id="step-instruction"
                ref={headingRef}
                tabIndex={-1}
                className="mt-1 text-3xl font-semibold leading-tight text-ink outline-none sm:text-4xl"
              >
                {step.instruction}
              </h2>
            </div>
            <div className="shrink-0 pt-1">
              <ReadAloudButton text={step.speech ?? step.instruction} speechKey={`step-${step.id}`} />
            </div>
          </div>

          <StepInteractionView key={step.id} step={step} interaction={step.interaction} state={stepState} dispatch={dispatch} />

          {helpOpen && (
            <div role="region" aria-label="Help" className="flex flex-col gap-3 rounded-card border-[3px] border-ink bg-paper p-5 animate-rise">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-soft text-sky-deep">
                  <Icon name="help" />
                </span>
                <p className="text-lg text-ink">{step.help}</p>
              </div>
              <div className="flex flex-wrap gap-2 pl-13">
                <ReadAloudButton text={step.help} speechKey={`help-${step.id}`} label="Read the help" />
              </div>
            </div>
          )}
        </section>
      </main>

      <nav
        aria-label="Step navigation"
        className="sticky bottom-0 z-20 border-t-2 border-ink/10 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FeedbackBubble feedback={feedback} avatar={avatar} />
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 sm:px-6">
          {stepIndex > 0 ? (
            <Button variant="secondary" icon="back" onClick={back} className={`justify-self-start ${NAV_BUTTON}`}>
              Back
            </Button>
          ) : (
            <span aria-hidden="true" />
          )}
          <Button
            variant="quiet"
            icon="help"
            aria-expanded={helpOpen}
            onClick={() => setHelpOpen((open) => !open)}
            className={`px-3 ${NAV_BUTTON}`}
          >
            {helpOpen ? "Hide help" : "Help"}
          </Button>
          <Button
            variant={ready ? (isLast ? "success" : "primary") : "secondary"}
            iconAfter={isLast ? "star" : "next"}
            aria-disabled={!ready}
            onClick={next}
            className={`justify-self-end ${NAV_BUTTON} ${ready ? "" : "opacity-60"}`}
          >
            {isLast ? "Finish" : "Next"}
          </Button>
        </div>
      </nav>

      <Dialog
        open={exitOpen}
        onClose={() => setExitOpen(false)}
        title="Taking a break?"
        illustration={<Avatar id={avatar} className="h-20 w-20" />}
        actions={
          <>
            <Button
              variant="secondary"
              size="lg"
              icon="home"
              onClick={() => {
                stop();
                setExitOpen(false);
                router.push("/missions/");
              }}
            >
              Leave for now
            </Button>
            <Button size="lg" icon="play" onClick={() => setExitOpen(false)} autoFocus>
              Keep playing
            </Button>
          </>
        }
      >
        Your progress is saved. You can come back to step {stepIndex + 1} any time.
      </Dialog>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar, avatarName } from "@/components/illustrations/Avatar";
import { Logo } from "@/components/illustrations/Logo";
import { ArtObject } from "@/components/illustrations/Scene";
import type { ArtObjectId } from "@/components/illustrations/registry";
import { Button } from "@/components/ui/Button";
import { updateProfile } from "@/lib/actions";
import { sanitizeNickname } from "@/lib/storage/schema";
import { useAppState } from "@/lib/store";
import type { AvatarId } from "@/types/progress";
import { AvatarPicker } from "./AvatarPicker";

const HOW_IT_WORKS: { object: ArtObjectId; title: string; text: string; tint: string }[] = [
  { object: "backpack", title: "Pick a mission", text: "Choose an everyday adventure.", tint: "bg-coral-soft" },
  { object: "toothbrush", title: "Follow the pictures", text: "Do one small step at a time.", tint: "bg-mint-soft" },
  { object: "star", title: "Celebrate!", text: "Finish and earn a badge.", tint: "bg-sun-soft" },
];

const STEPS = ["Welcome", "Buddy", "Name"] as const;

export function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const saved = useAppState((s) => s.profile);
  // Drafts overlay the saved profile so prerendered and hydrated HTML match.
  const [draftAvatar, setAvatar] = useState<AvatarId | null>(null);
  const [draftNickname, setNickname] = useState<string | null>(null);
  const avatar = draftAvatar ?? saved.avatar;
  const nickname = draftNickname ?? saved.nickname;
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  function finish(withDetails: boolean) {
    updateProfile(
      withDetails ? { avatar, nickname: sanitizeNickname(nickname), onboarded: true } : { onboarded: true },
    );
    router.replace("/");
  }

  return (
    <div className="bg-dots flex min-h-dvh flex-col">
      <header className="mx-auto flex h-18 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <Button variant="quiet" size="md" onClick={() => finish(step > 0)}>
          Skip
        </Button>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-10 sm:px-6">
        <ol className="mb-6 flex justify-center gap-2" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={`h-3 rounded-full border-2 border-ink transition-all ${i === step ? "w-10 bg-sun" : i < step ? "w-3 bg-ink" : "w-3 bg-paper"}`}
            >
              <span className="sr-only">
                {label}
                {i === step ? " (current)" : ""}
              </span>
            </li>
          ))}
        </ol>

        <div key={step} className="flex flex-1 flex-col items-center gap-6 text-center animate-rise">
          {step === 0 && (
            <>
              <Avatar id={avatar} className="h-28 w-28 animate-float" />
              <h1 ref={headingRef} tabIndex={-1} className="text-4xl font-semibold text-ink outline-none sm:text-5xl">
                Welcome to DayQuest!
              </h1>
              <p className="max-w-lg text-xl text-ink-soft">
                Every day is full of little adventures. Here&apos;s how it works:
              </p>
              <ol className="grid w-full gap-4 sm:grid-cols-3">
                {HOW_IT_WORKS.map((card, i) => (
                  <li key={card.title} className="flex flex-col items-center gap-2 rounded-card border-[3px] border-ink bg-paper p-5 shadow-soft">
                    <span className={`flex h-24 w-24 items-center justify-center rounded-full ${card.tint}`}>
                      <ArtObject id={card.object} className="h-18 w-18" />
                    </span>
                    <span className="font-display text-sm font-semibold text-ink-soft">Step {i + 1}</span>
                    <span className="font-display text-xl font-semibold text-ink">{card.title}</span>
                    <span className="text-ink-soft">{card.text}</span>
                  </li>
                ))}
              </ol>
              <Button size="xl" iconAfter="next" onClick={() => setStep(1)}>
                Next
              </Button>
            </>
          )}

          {step === 1 && (
            <>
              <h1 ref={headingRef} tabIndex={-1} className="text-4xl font-semibold text-ink outline-none sm:text-5xl">
                Choose your buddy
              </h1>
              <p className="max-w-lg text-xl text-ink-soft">Your buddy will cheer you on during every mission.</p>
              <div className="w-full max-w-xl">
                <AvatarPicker value={avatar} onChange={setAvatar} legend="Choose your buddy" />
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="secondary" size="lg" icon="back" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button size="xl" iconAfter="next" onClick={() => setStep(2)}>
                  {avatarName(avatar)} it is!
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <form
              className="flex w-full flex-col items-center gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                finish(true);
              }}
            >
              <Avatar id={avatar} className="h-28 w-28" />
              <h1 ref={headingRef} tabIndex={-1} className="text-4xl font-semibold text-ink outline-none sm:text-5xl">
                What should we call you?
              </h1>
              <div className="flex w-full max-w-md flex-col items-start gap-2 text-left">
                <label htmlFor="nickname" className="font-display text-lg font-semibold text-ink">
                  Nickname <span className="font-sans text-base font-normal text-ink-soft">(you can leave this empty)</span>
                </label>
                <input
                  id="nickname"
                  name="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={20}
                  autoComplete="off"
                  autoCapitalize="words"
                  spellCheck={false}
                  placeholder="e.g. Sunny"
                  className="min-h-16 w-full rounded-2xl border-[3px] border-ink bg-paper px-5 font-display text-2xl text-ink placeholder:text-ink-soft/60"
                  aria-describedby="nickname-help"
                />
                <p id="nickname-help" className="text-sm text-ink-soft">
                  Grown-ups: a first name or fun nickname is plenty — please don&apos;t enter a full name. It stays on
                  this device only.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="secondary" size="lg" icon="back" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" size="xl" iconAfter="next">
                  Let&apos;s go!
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

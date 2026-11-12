"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { makeGateQuestion, unlockParentArea, type GateQuestion } from "./parent-gate";

export function ParentGate() {
  const [question, setQuestion] = useState<GateQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (question) inputRef.current?.focus();
  }, [question]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!question) return;
    if (Number(answer.trim()) === question.answer) {
      unlockParentArea();
      return;
    }
    setMessage("That's not quite it. Here's a new question.");
    setQuestion(makeGateQuestion());
    setAnswer("");
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-4 py-12 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-ink bg-sky-soft text-sky-deep">
        <Icon name="lock" className="h-10 w-10" />
      </span>
      <h1 className="text-4xl font-semibold text-ink">For grown-ups</h1>
      {!question ? (
        <>
          <p className="text-lg text-ink-soft">
            This area has settings and progress for parents and carers. Kids, please ask a grown-up to help!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" icon="shield" onClick={() => setQuestion(makeGateQuestion())}>
              I&apos;m a grown-up
            </Button>
            <ButtonLink href="/" variant="secondary" size="lg" icon="home">
              Back to adventures
            </ButtonLink>
          </div>
        </>
      ) : (
        <form onSubmit={submit} className="flex w-full flex-col items-center gap-4">
          <label htmlFor="gate-answer" className="text-xl font-semibold text-ink">
            {question.text}
          </label>
          <input
            ref={inputRef}
            id="gate-answer"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            value={answer}
            onChange={(e) => setAnswer(e.target.value.replace(/[^0-9]/g, ""))}
            className="min-h-16 w-40 rounded-2xl border-[3px] border-ink bg-paper text-center font-display text-3xl text-ink"
            aria-describedby="gate-note"
          />
          {message && (
            <p role="alert" className="font-semibold text-coral-deep">
              {message}
            </p>
          )}
          <Button type="submit" size="lg" icon="unlock">
            Open
          </Button>
          <p id="gate-note" className="text-sm text-ink-soft">
            Type the answer as a number. This is a simple check to keep little hands out — it is not a password or
            account security.
          </p>
        </form>
      )}
    </div>
  );
}

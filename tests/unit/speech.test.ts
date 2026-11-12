import { afterEach, describe, expect, it, vi } from "vitest";
import { isSpeechSupported, speak, stopSpeaking } from "@/lib/speech";

class FakeUtterance {
  text: string;
  rate = 1;
  pitch = 1;
  lang = "";
  voice: unknown = null;
  onend: (() => void) | null = null;
  onerror: ((e: { error: string }) => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

function installSpeech() {
  const spoken: FakeUtterance[] = [];
  const synth = {
    speak: vi.fn((u: FakeUtterance) => spoken.push(u)),
    cancel: vi.fn(),
    resume: vi.fn(),
    getVoices: () => [{ lang: "en-GB", localService: true, name: "Test" }],
  };
  Object.assign(window, { speechSynthesis: synth, SpeechSynthesisUtterance: FakeUtterance });
  return { synth, spoken };
}

afterEach(() => {
  delete (window as unknown as Record<string, unknown>).speechSynthesis;
  delete (window as unknown as Record<string, unknown>).SpeechSynthesisUtterance;
});

describe("speech", () => {
  it("reports unsupported browsers instead of throwing", () => {
    expect(isSpeechSupported()).toBe(false);
    expect(speak("Hello")).toBe(false);
    expect(() => stopSpeaking()).not.toThrow();
  });

  it("speaks with the chosen rate, cancelling anything already playing", () => {
    const { synth, spoken } = installSpeech();
    expect(isSpeechSupported()).toBe(true);
    expect(speak("Brush your teeth.", { rate: 0.75 })).toBe(true);
    expect(synth.cancel).toHaveBeenCalled();
    expect(spoken[0].text).toBe("Brush your teeth.");
    expect(spoken[0].rate).toBe(0.75);
    expect(spoken[0].lang).toBe("en-GB");
  });

  it("survives speech engine errors", () => {
    const { spoken } = installSpeech();
    speak("Hi");
    expect(() => spoken[0].onerror?.({ error: "synthesis-failed" })).not.toThrow();
    expect(() => spoken[0].onerror?.({ error: "interrupted" })).not.toThrow();
  });
});

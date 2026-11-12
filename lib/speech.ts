import { useCallback, useSyncExternalStore } from "react";
import { useAppState, useHydrated } from "./store";

/**
 * Optional read-aloud using the browser's built-in speech synthesis.
 * Nothing is sent over the network by DayQuest. Speech only starts from an
 * explicit action (a button press, or the parent-enabled "read steps aloud"
 * setting), and written text always remains on screen.
 */

interface SpeechState {
  /** Key of the text currently being spoken, so the right button shows "Stop". */
  speakingKey: string | null;
  error: string | null;
}

let speechState: SpeechState = { speakingKey: null, error: null };
const listeners = new Set<() => void>();

function setSpeechState(patch: Partial<SpeechState>) {
  speechState = { ...speechState, ...patch };
  for (const l of listeners) l();
}

export function isSpeechSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof window.SpeechSynthesisUtterance === "function"
  );
}

function pickVoice(): SpeechSynthesisVoice | null {
  try {
    const voices = window.speechSynthesis.getVoices();
    const english = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
    return english.find((v) => v.localService) ?? english[0] ?? null;
  } catch {
    return null;
  }
}

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
  setSpeechState({ speakingKey: null });
}

/** Speaks text. Returns false when speech is unavailable. */
export function speak(text: string, options: { key?: string; rate?: number } = {}): boolean {
  if (!isSpeechSupported()) {
    setSpeechState({ error: "Reading aloud isn't available in this browser." });
    return false;
  }
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? "en-GB";
    utterance.rate = options.rate ?? 0.9;
    utterance.pitch = 1.05;
    const key = options.key ?? text;
    utterance.onend = () => {
      if (speechState.speakingKey === key) setSpeechState({ speakingKey: null });
    };
    utterance.onerror = (event) => {
      const benign = event.error === "interrupted" || event.error === "canceled";
      setSpeechState({
        speakingKey: speechState.speakingKey === key ? null : speechState.speakingKey,
        error: benign ? speechState.error : "Sorry, reading aloud didn't work this time.",
      });
    };
    setSpeechState({ speakingKey: key, error: null });
    synth.speak(utterance);
    // Some browsers start paused after a cancel; resume is a harmless no-op otherwise.
    synth.resume();
    return true;
  } catch {
    setSpeechState({ speakingKey: null, error: "Sorry, reading aloud didn't work this time." });
    return false;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const serverSpeechState: SpeechState = { speakingKey: null, error: null };

/** Read-aloud state and controls, respecting the voice settings. */
export function useSpeech() {
  const hydrated = useHydrated();
  const voiceGuidance = useAppState((s) => s.settings.voiceGuidance);
  const autoRead = useAppState((s) => s.settings.autoRead);
  const rate = useAppState((s) => s.settings.speechRate);
  const state = useSyncExternalStore(subscribe, () => speechState, () => serverSpeechState);
  const supported = hydrated && isSpeechSupported();

  const say = useCallback((text: string, key?: string) => speak(text, { key, rate }), [rate]);

  const toggle = useCallback(
    (text: string, key: string) => {
      if (speechState.speakingKey === key) stopSpeaking();
      else speak(text, { key, rate });
    },
    [rate],
  );

  return {
    supported,
    /** Read-aloud buttons are shown when the voice setting is on. */
    enabled: voiceGuidance,
    autoRead: voiceGuidance && autoRead,
    speakingKey: state.speakingKey,
    error: state.error,
    say,
    toggle,
    stop: stopSpeaking,
  };
}

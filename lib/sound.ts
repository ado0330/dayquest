import { useCallback } from "react";
import { getState } from "./store";

/**
 * Gentle synthesised chimes (no audio files, works offline). There is
 * deliberately no "wrong answer" buzzer: hints get a soft, neutral tone.
 */

export type SoundKind = "tap" | "success" | "hint" | "celebrate";

type AudioCtor = typeof AudioContext;

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor: AudioCtor | undefined =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function note(c: AudioContext, freq: number, start: number, length: number, volume: number) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(c.destination);
  osc.start(start);
  osc.stop(start + length + 0.05);
}

const PATTERNS: Record<SoundKind, { freqs: number[]; gap: number; length: number; volume: number }> = {
  tap: { freqs: [880], gap: 0, length: 0.08, volume: 0.05 },
  success: { freqs: [523.25, 783.99], gap: 0.1, length: 0.25, volume: 0.12 },
  hint: { freqs: [440], gap: 0, length: 0.22, volume: 0.06 },
  celebrate: { freqs: [523.25, 659.25, 783.99, 1046.5], gap: 0.12, length: 0.4, volume: 0.12 },
};

export function playSound(kind: SoundKind): void {
  if (typeof window === "undefined") return;
  if (!getState().settings.soundEffects) return;
  const c = audio();
  if (!c) return;
  try {
    const { freqs, gap, length, volume } = PATTERNS[kind];
    const t = c.currentTime + 0.01;
    freqs.forEach((f, i) => note(c, f, t + i * gap, length, volume));
  } catch {
    // Audio is a nice-to-have; ignore failures.
  }
}

export function useSound() {
  return useCallback((kind: SoundKind) => playSound(kind), []);
}

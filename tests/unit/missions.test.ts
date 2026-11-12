import { describe, expect, it } from "vitest";
import { getMission, missions } from "@/data/missions";
import { validateMission } from "@/lib/validation/mission-schema";
import type { Mission } from "@/types/mission";

const REQUIRED_TITLES = [
  "Getting Ready for School",
  "Brushing Your Teeth",
  "Washing Your Hands",
  "Packing Your School Bag",
  "Cleaning Up Your Toys",
  "Preparing for Bedtime",
];

describe("mission catalogue", () => {
  it("contains the six launch missions", () => {
    expect(missions.map((m) => m.title)).toEqual(REQUIRED_TITLES);
  });

  it("has unique mission ids and can look each one up", () => {
    const ids = missions.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const m of missions) expect(getMission(m.id)).toBe(m);
    expect(getMission("does-not-exist")).toBeUndefined();
  });

  it.each(missions.map((m) => [m.id, m] as const))("%s passes schema validation", (_id, mission) => {
    expect(() => validateMission(mission)).not.toThrow();
  });

  it("gives every mission its own distinct step sequence", () => {
    const sequences = missions.map((m) => m.steps.map((s) => s.instruction).join("|"));
    expect(new Set(sequences).size).toBe(missions.length);
    for (const m of missions) {
      expect(m.steps.length).toBeGreaterThanOrEqual(5);
      expect(new Set(m.steps.map((s) => s.id)).size).toBe(m.steps.length);
    }
  });

  it("uses a variety of interaction types across the library", () => {
    const types = new Set(missions.flatMap((m) => m.steps.map((s) => s.interaction.type)));
    expect([...types].sort()).toEqual(["checklist", "choice", "confirm", "order", "sort", "timer"]);
  });

  it("provides help text and alt text for every step", () => {
    for (const m of missions) {
      for (const s of m.steps) {
        expect(s.help.length).toBeGreaterThan(10);
        expect(s.alt.length).toBeGreaterThan(5);
      }
    }
  });
});

describe("validateMission", () => {
  const base = structuredClone(missions[0]) as Mission;

  function broken(mutate: (m: Mission) => void) {
    const copy = structuredClone(base);
    mutate(copy);
    return () => validateMission(copy);
  }

  it("rejects a choice with no correct option", () => {
    expect(
      broken((m) => {
        const step = m.steps.find((s) => s.interaction.type === "choice")!;
        if (step.interaction.type === "choice") step.interaction.options.forEach((o) => (o.correct = false));
      }),
    ).toThrow(/at least one correct option/);
  });

  it("rejects duplicate step ids", () => {
    expect(broken((m) => (m.steps[1].id = m.steps[0].id))).toThrow(/duplicate step id/);
  });

  it("rejects unknown illustration objects", () => {
    expect(
      broken((m) => {
        (m.steps[0].illustration.objects as string[])[0] = "unicorn";
      }),
    ).toThrow(/Invalid mission/);
  });

  it("rejects sort items that point to a missing bin", () => {
    const toys = structuredClone(missions.find((m) => m.id === "cleaning-up-toys")!) as Mission;
    const step = toys.steps.find((s) => s.interaction.type === "sort")!;
    if (step.interaction.type === "sort") step.interaction.items[0].bin = "garage";
    expect(() => validateMission(toys)).toThrow(/unknown bin/);
  });

  it("rejects timer cues beyond the timer length", () => {
    const teeth = structuredClone(missions.find((m) => m.id === "brushing-teeth")!) as Mission;
    const step = teeth.steps.find((s) => s.interaction.type === "timer")!;
    if (step.interaction.type === "timer") step.interaction.cues.push({ at: 999, text: "Too late" });
    expect(() => validateMission(teeth)).toThrow(/past the timer/);
  });
});

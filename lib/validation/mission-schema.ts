import { z } from "zod";
import { artObjectIds, backdropIds } from "@/components/illustrations/registry";
import type { Mission } from "@/types/mission";

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "ids must be kebab-case");
const text = z.string().trim().min(1);
const artObject = z.enum(artObjectIds as [string, ...string[]]);

const illustration = z.object({
  backdrop: z.enum(backdropIds),
  objects: z.array(artObject).min(1).max(3),
});

const pictureItem = z.object({ id, label: text, object: artObject });

function uniqueIds(items: { id: string }[], ctx: z.RefinementCtx, what: string) {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) ctx.addIssue({ code: "custom", message: `duplicate ${what} id "${item.id}"` });
    seen.add(item.id);
  }
}

const interaction = z.discriminatedUnion("type", [
  z.object({ type: z.literal("confirm"), label: text }),
  z
    .object({
      type: z.literal("choice"),
      options: z.array(pictureItem.extend({ correct: z.boolean(), feedback: text })).min(2).max(4),
    })
    .superRefine((v, ctx) => {
      uniqueIds(v.options, ctx, "option");
      if (!v.options.some((o) => o.correct)) {
        ctx.addIssue({ code: "custom", message: "a choice needs at least one correct option" });
      }
    }),
  z
    .object({ type: z.literal("checklist"), items: z.array(pictureItem).min(2).max(6) })
    .superRefine((v, ctx) => uniqueIds(v.items, ctx, "checklist item")),
  z
    .object({ type: z.literal("order"), items: z.array(pictureItem).min(2).max(6) })
    .superRefine((v, ctx) => uniqueIds(v.items, ctx, "order item")),
  z
    .object({
      type: z.literal("timer"),
      seconds: z.number().int().min(5).max(600),
      allowSkip: z.boolean(),
      cues: z.array(z.object({ at: z.number().min(0), text })),
    })
    .superRefine((v, ctx) => {
      for (const cue of v.cues) {
        if (cue.at >= v.seconds) ctx.addIssue({ code: "custom", message: `cue at ${cue.at}s is past the timer` });
      }
    }),
  z
    .object({
      type: z.literal("sort"),
      bins: z.array(pictureItem).min(2).max(4),
      items: z.array(pictureItem.extend({ bin: id, hint: text })).min(1).max(6),
    })
    .superRefine((v, ctx) => {
      uniqueIds(v.bins, ctx, "bin");
      uniqueIds(v.items, ctx, "sort item");
      const bins = new Set(v.bins.map((b) => b.id));
      for (const item of v.items) {
        if (!bins.has(item.bin)) ctx.addIssue({ code: "custom", message: `item "${item.id}" uses unknown bin` });
      }
    }),
]);

const step = z.object({
  id,
  title: text,
  instruction: text,
  speech: text.optional(),
  help: text,
  illustration,
  alt: text,
  interaction,
  successMessage: text,
  optional: z.boolean().optional(),
});

export const missionSchema = z
  .object({
    id,
    title: text,
    description: text,
    why: text,
    theme: z.enum(["sky", "mint", "coral", "sun", "lilac", "night"]),
    durationMinutes: z.number().positive().optional(),
    timeOfDay: z.enum(["morning", "day", "evening", "any"]),
    cover: illustration,
    coverAlt: text,
    steps: z.array(step).min(2),
    completion: z.object({ title: text, message: text }),
    badge: z.object({ name: text, object: artObject }),
  })
  .superRefine((m, ctx) => {
    uniqueIds(m.steps, ctx, "step");
    if (m.steps.every((s) => s.optional)) {
      ctx.addIssue({ code: "custom", message: "a mission needs at least one required step" });
    }
  });

/** Validates a mission definition, throwing a readable error if it is invalid. */
export function validateMission(input: unknown): Mission {
  const result = missionSchema.safeParse(input);
  if (!result.success) {
    const missionId = (input as { id?: unknown })?.id ?? "(unknown)";
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid mission "${String(missionId)}":\n${details}`);
  }
  return result.data as Mission;
}

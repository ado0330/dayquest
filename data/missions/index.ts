import { validateMission } from "@/lib/validation/mission-schema";
import type { Mission } from "@/types/mission";
import { brushingTeeth } from "./brushing-teeth";
import { cleaningUpToys } from "./cleaning-up-toys";
import { gettingReadyForSchool } from "./getting-ready-for-school";
import { packingSchoolBag } from "./packing-school-bag";
import { preparingForBedtime } from "./preparing-for-bedtime";
import { washingHands } from "./washing-hands";

/**
 * The mission catalogue, in display order. To add a mission, create a data
 * file next to these and add it to this list — no UI changes are needed.
 * Every definition is validated here, so a broken mission fails the build.
 */
const definitions: Mission[] = [
  gettingReadyForSchool,
  brushingTeeth,
  washingHands,
  packingSchoolBag,
  cleaningUpToys,
  preparingForBedtime,
];

export const missions: readonly Mission[] = definitions.map(validateMission);

const byId = new Map(missions.map((m) => [m.id, m]));

if (byId.size !== missions.length) {
  throw new Error("Mission ids must be unique.");
}

export function getMission(id: string): Mission | undefined {
  return byId.get(id);
}

export const missionIds: readonly string[] = missions.map((m) => m.id);

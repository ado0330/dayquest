import type { Metadata } from "next";
import { MissionLibrary } from "@/features/missions/MissionLibrary";

export const metadata: Metadata = { title: "Missions" };

export default function MissionsPage() {
  return <MissionLibrary />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMission, missions } from "@/data/missions";
import { MissionPlayer } from "@/features/missions/MissionPlayer";

// Every mission is known at build time; unknown ids are a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return missions.map((m) => ({ missionId: m.id }));
}

export async function generateMetadata({ params }: PageProps<"/missions/[missionId]">): Promise<Metadata> {
  const { missionId } = await params;
  const mission = getMission(missionId);
  return mission ? { title: mission.title, description: mission.description } : {};
}

export default async function MissionPage({ params }: PageProps<"/missions/[missionId]">) {
  const { missionId } = await params;
  const mission = getMission(missionId);
  if (!mission) notFound();
  return <MissionPlayer mission={mission} />;
}

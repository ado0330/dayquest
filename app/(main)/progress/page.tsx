import type { Metadata } from "next";
import { ProgressScreen } from "@/features/progress/ProgressScreen";

export const metadata: Metadata = { title: "My Adventures" };

export default function ProgressPage() {
  return <ProgressScreen />;
}

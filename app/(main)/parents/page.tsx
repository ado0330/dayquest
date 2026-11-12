import type { Metadata } from "next";
import { ParentArea } from "@/features/settings/ParentArea";

export const metadata: Metadata = { title: "Grown-ups" };

export default function ParentsPage() {
  return <ParentArea />;
}

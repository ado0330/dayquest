import { AppShell } from "@/components/layout/AppShell";

/** Screens with the main navigation: home, missions, adventures, grown-ups. */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

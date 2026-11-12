"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Logo } from "@/components/illustrations/Logo";
import { Icon, type IconName } from "@/components/ui/Icon";
import { setAudioEnabled } from "@/lib/actions";
import { stopSpeaking } from "@/lib/speech";
import { useAppState } from "@/lib/store";
import { OfflineNotice } from "./OfflineNotice";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/missions/", label: "Missions", icon: "map" },
  { href: "/progress/", label: "My Adventures", icon: "trophy" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.replace(/\/$/, ""));
}

function SoundToggle() {
  const voice = useAppState((s) => s.settings.voiceGuidance);
  const effects = useAppState((s) => s.settings.soundEffects);
  const on = voice || effects;
  return (
    <button
      type="button"
      onClick={() => {
        if (on) stopSpeaking();
        setAudioEnabled(!on);
      }}
      aria-pressed={on}
      className="inline-flex min-h-12 items-center gap-2 rounded-full border-[3px] border-ink bg-paper px-3 font-display font-semibold text-ink hover:bg-cream sm:px-4"
    >
      <Icon name={on ? "speaker" : "mute"} />
      <span className="sr-only sm:not-sr-only">{on ? "Sound on" : "Sound off"}</span>
    </button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b-2 border-line/70 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" aria-label="DayQuest home" className="rounded-2xl">
            <Logo />
          </Link>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex min-h-12 items-center gap-2 rounded-full px-4 font-display text-lg font-semibold transition-colors ${
                        active ? "bg-ink text-white" : "text-ink hover:bg-ink/5"
                      }`}
                    >
                      <Icon name={item.icon} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <SoundToggle />
            <Link
              href="/parents/"
              aria-current={isActive(pathname, "/parents/") ? "page" : undefined}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border-[3px] border-ink bg-paper px-3 font-display font-semibold text-ink hover:bg-cream sm:px-4"
            >
              <Icon name="shield" />
              <span className="sr-only sm:not-sr-only">Grown-ups</span>
            </Link>
          </div>
        </div>
      </header>

      <OfflineNotice />

      <main id="main" className="flex-1 pb-28 lg:pb-12">
        {children}
      </main>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-3">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-16 flex-col items-center justify-center gap-0.5 font-display text-sm font-semibold ${
                    active ? "text-sky-deep" : "text-ink-soft"
                  }`}
                >
                  <span
                    className={`flex h-9 w-14 items-center justify-center rounded-full transition-colors ${
                      active ? "bg-sky-soft" : ""
                    }`}
                  >
                    <Icon name={item.icon} className="h-6 w-6" />
                  </span>
                  {item.label === "My Adventures" ? "Adventures" : item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

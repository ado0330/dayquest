import type { Metadata } from "next";
import { ArtObject } from "@/components/illustrations/Scene";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Offline" };

/**
 * Served by the service worker when a page that isn't cached is requested
 * without a connection.
 */
export default function OfflinePage() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-5 px-4 py-16 text-center">
      <ArtObject id="rain-cloud" className="h-40 w-40" />
      <h1 className="text-4xl font-semibold">You&apos;re offline</h1>
      <p className="text-lg text-ink-soft">
        This page isn&apos;t saved on your device yet. Your missions and progress are still here — let&apos;s go back
        to them!
      </p>
      <ButtonLink href="/missions/" size="lg" icon="map">
        See my missions
      </ButtonLink>
    </section>
  );
}

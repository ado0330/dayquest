"use client";

import { ArtObject } from "@/components/illustrations/Scene";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="bg-dots flex min-h-dvh flex-col items-center justify-center gap-5 px-4 py-16 text-center">
      <ArtObject id="teddy" className="h-40 w-40" />
      <h1 className="text-4xl font-semibold text-ink">Oops! Something got mixed up.</h1>
      <p className="max-w-md text-lg text-ink-soft">
        That&apos;s okay. Your progress is saved on this device. Let&apos;s try again.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={reset} size="lg" icon="replay">
          Try again
        </Button>
        <ButtonLink href="/" variant="secondary" size="lg" icon="home">
          Go home
        </ButtonLink>
      </div>
    </main>
  );
}

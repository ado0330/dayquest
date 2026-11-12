import { ArtObject } from "@/components/illustrations/Scene";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="bg-dots flex min-h-dvh flex-col items-center justify-center gap-5 px-4 py-16 text-center">
      <ArtObject id="rain-cloud" className="h-40 w-40 animate-float" />
      <h1 className="text-4xl font-semibold text-ink">Hmm, this path is a mystery!</h1>
      <p className="max-w-md text-lg text-ink-soft">
        We couldn&apos;t find that page. Let&apos;s head back and pick a new adventure.
      </p>
      <ButtonLink href="/" size="lg" icon="home">
        Go home
      </ButtonLink>
    </main>
  );
}

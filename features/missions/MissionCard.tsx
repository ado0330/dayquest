import Link from "next/link";
import { Scene } from "@/components/illustrations/Scene";
import { Icon } from "@/components/ui/Icon";
import { missionStatus } from "@/features/progress/progress";
import type { Mission } from "@/types/mission";
import type { MissionProgress } from "@/types/progress";

export function missionHref(mission: Mission) {
  return `/missions/${mission.id}/`;
}

export function StatusPill({ mission, progress }: { mission: Mission; progress?: MissionProgress }) {
  const status = missionStatus(progress);
  if (status === "in-progress") {
    const step = (progress?.active?.currentStepIndex ?? 0) + 1;
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-sun px-3 py-1 text-sm font-bold text-ink">
        <Icon name="flag" className="h-4 w-4" />
        Step {step} of {mission.steps.length}
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-mint-deep px-3 py-1 text-sm font-bold text-white">
        <Icon name="check" className="h-4 w-4" />
        Done{progress && progress.completions > 1 ? ` ×${progress.completions}` : ""}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-3 py-1 text-sm font-bold text-ink">
      <Icon name="sparkle" className="h-4 w-4" />
      New
    </span>
  );
}

export function actionLabel(progress?: MissionProgress) {
  const status = missionStatus(progress);
  return status === "in-progress" ? "Keep going" : status === "completed" ? "Play again" : "Start";
}

function statusText(mission: Mission, progress?: MissionProgress) {
  const status = missionStatus(progress);
  if (status === "in-progress") return `, on step ${(progress?.active?.currentStepIndex ?? 0) + 1} of ${mission.steps.length}`;
  if (status === "completed") return ", completed";
  return ", new";
}

export function MissionCard({ mission, progress }: { mission: Mission; progress?: MissionProgress }) {
  const action = actionLabel(progress);
  return (
    <Link
      href={missionHref(mission)}
      data-theme={mission.theme}
      aria-label={`${action}: ${mission.title}${statusText(mission, progress)}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border-[3px] border-ink bg-paper shadow-soft transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lift focus-visible:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b-[3px] border-ink bg-theme-soft">
        <Scene spec={mission.cover} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]" />
        <div className="absolute left-3 top-3">
          <StatusPill mission={mission} progress={progress} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-xl font-semibold leading-tight text-ink sm:text-2xl">{mission.title}</h3>
        <p className="text-base text-ink-soft">{mission.description}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft">
            <Icon name="flag" className="h-4 w-4" />
            {mission.steps.length} steps
            {mission.durationMinutes ? (
              <>
                <span aria-hidden="true">·</span>
                <Icon name="clock" className="h-4 w-4" />
                About {mission.durationMinutes} min
              </>
            ) : null}
          </span>
          <span className="inline-flex min-h-11 items-center gap-1 rounded-full border-[3px] border-ink bg-theme-deep px-4 font-display font-semibold text-white transition-transform group-hover:translate-x-0.5">
            {action}
            <Icon name="next" className="h-5 w-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

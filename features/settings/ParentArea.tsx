"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ArtObject } from "@/components/illustrations/Scene";
import { Button } from "@/components/ui/Button";
import { Segmented, Switch } from "@/components/ui/Controls";
import { Dialog } from "@/components/ui/Dialog";
import { Icon, type IconName } from "@/components/ui/Icon";
import { missions } from "@/data/missions";
import { AvatarPicker } from "@/features/onboarding/AvatarPicker";
import { earnedStickers } from "@/features/progress/achievements";
import { missionStatus, summarize } from "@/features/progress/progress";
import { resetAllProgress, updateProfile, updateSettings } from "@/lib/actions";
import { resetOfflineCache, useOfflineStatus } from "@/lib/offline";
import { useSpeech } from "@/lib/speech";
import { getStorageStatus } from "@/lib/storage/local";
import { STORAGE_KEY } from "@/lib/storage/schema";
import { clearAllData, useAppState, useHydrated } from "@/lib/store";
import { ParentGate } from "./ParentGate";
import { lockParentArea, useParentUnlocked } from "./parent-gate";

function Panel({ id, icon, title, children }: { id: string; icon: IconName; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="rounded-card border-2 border-line bg-paper p-5 shadow-soft sm:p-6">
      <h2 id={id} className="mb-2 flex items-center gap-2 text-2xl font-semibold text-ink">
        <Icon name={icon} className="h-6 w-6 text-sky-deep" />
        {title}
      </h2>
      {children}
    </section>
  );
}

const dateFormat = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" });

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateFormat.format(d);
}

const RATES = [
  { value: "0.75", label: "Slow" },
  { value: "0.9", label: "Normal" },
  { value: "1.1", label: "Fast" },
];

function closestRate(rate: number) {
  return RATES.reduce((best, r) => (Math.abs(Number(r.value) - rate) < Math.abs(Number(best.value) - rate) ? r : best)).value;
}

function Dashboard() {
  const router = useRouter();
  const profile = useAppState((s) => s.profile);
  const settings = useAppState((s) => s.settings);
  const progress = useAppState((s) => s.progress);
  const speech = useSpeech();
  const offline = useOfflineStatus();
  const [confirm, setConfirm] = useState<null | "progress" | "everything">(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [nickname, setNickname] = useState(profile.nickname);
  const summary = summarize(progress, missions);
  const stickers = earnedStickers(progress, missions);
  const storage = getStorageStatus();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display font-semibold text-sky-deep">Grown-ups area</p>
          <h1 className="text-4xl font-semibold text-ink">Progress &amp; settings</h1>
        </div>
        <Button variant="secondary" icon="lock" onClick={lockParentArea}>
          Lock
        </Button>
      </div>

      {notice && (
        <p role="status" className="mb-6 flex items-center gap-2 rounded-2xl border-2 border-mint-deep bg-mint-soft p-4 font-semibold text-mint-deep">
          <Icon name="check" className="h-5 w-5" />
          {notice}
        </p>
      )}

      <div className="flex flex-col gap-6">
        <Panel id="overview" icon="trophy" title="Progress overview">
          <dl className="mb-4 grid grid-cols-3 gap-3 text-center">
            {[
              ["Missions completed", `${summary.completedMissions} / ${summary.totalMissions}`],
              ["Times practised", String(summary.totalCompletions)],
              ["Stickers", `${stickers.length}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-cream p-3">
                <dt className="text-sm text-ink-soft">{label}</dt>
                <dd className="font-display text-2xl font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left">
              <caption className="sr-only">Progress for each mission</caption>
              <thead>
                <tr className="border-b-2 border-line text-sm text-ink-soft">
                  <th scope="col" className="py-2 pr-3 font-semibold">Mission</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Status</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Completed</th>
                  <th scope="col" className="py-2 font-semibold">Last completed</th>
                </tr>
              </thead>
              <tbody>
                {missions.map((m) => {
                  const p = progress[m.id];
                  const status = missionStatus(p);
                  return (
                    <tr key={m.id} className="border-b border-line/70 last:border-0">
                      <th scope="row" className="py-3 pr-3 font-semibold text-ink">
                        <span className="flex items-center gap-2">
                          <ArtObject id={m.badge.object} className="h-8 w-8 shrink-0" />
                          {m.title}
                        </span>
                      </th>
                      <td className="py-3 pr-3 text-ink">
                        {status === "in-progress"
                          ? `In progress (step ${(p?.active?.currentStepIndex ?? 0) + 1} of ${m.steps.length})`
                          : status === "completed"
                            ? "Completed"
                            : "Not started"}
                      </td>
                      <td className="py-3 pr-3 text-ink">{p?.completions ? `${p.completions}×` : "—"}</td>
                      <td className="py-3 text-ink">{formatDate(p?.lastCompletedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel id="audio" icon="speaker" title="Audio">
          <div className="divide-y-2 divide-line/60">
            <Switch
              label="Read-aloud buttons"
              description="Shows “Read to me” buttons that speak instructions using this device's built-in voice."
              checked={settings.voiceGuidance}
              onChange={(v) => updateSettings({ voiceGuidance: v })}
            />
            <Switch
              label="Read each step automatically"
              description="Speaks each new step and timer cue without a tap. Off by default."
              checked={settings.autoRead}
              disabled={!settings.voiceGuidance}
              onChange={(v) => updateSettings({ autoRead: v })}
            />
            <Segmented
              label="Speaking speed"
              value={closestRate(settings.speechRate)}
              options={RATES}
              onChange={(v) => updateSettings({ speechRate: Number(v) })}
            />
            <div className="flex flex-wrap items-center gap-3 py-3">
              <Button
                variant="secondary"
                icon="speaker"
                onClick={() => speech.say("Hello! I'm your DayQuest buddy. Let's go on an adventure!", "test-voice")}
                disabled={!speech.supported}
              >
                Test the voice
              </Button>
              <p className="text-sm text-ink-soft" role="status">
                {speech.supported
                  ? speech.error ?? "Speech is provided by your browser and works offline on most devices."
                  : "This browser doesn't support reading aloud. All instructions are always shown as text."}
              </p>
            </div>
            <Switch
              label="Sound effects"
              description="Gentle chimes when a step is done and when a mission is finished."
              checked={settings.soundEffects}
              onChange={(v) => updateSettings({ soundEffects: v })}
            />
          </div>
        </Panel>

        <Panel id="access" icon="sparkle" title="Accessibility">
          <div className="divide-y-2 divide-line/60">
            <Segmented
              label="Text size"
              value={settings.textSize}
              options={[
                { value: "normal", label: "Normal" },
                { value: "large", label: "Large" },
                { value: "x-large", label: "Extra large" },
              ]}
              onChange={(v) => updateSettings({ textSize: v })}
            />
            <Segmented
              label="Animations"
              description="“Follow device” respects the reduce-motion setting on this device."
              value={settings.motion}
              options={[
                { value: "system", label: "Follow device" },
                { value: "reduce", label: "Reduce" },
                { value: "full", label: "Full" },
              ]}
              onChange={(v) => updateSettings({ motion: v })}
            />
            <Switch
              label="High contrast"
              description="Darker text and borders for easier reading."
              checked={settings.highContrast}
              onChange={(v) => updateSettings({ highContrast: v })}
            />
          </div>
        </Panel>

        <Panel id="personal" icon="heart" title="Personalisation">
          <div className="flex flex-col gap-5">
            <AvatarPicker value={profile.avatar} onChange={(id) => updateProfile({ avatar: id })} legend="Buddy" />
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                updateProfile({ nickname });
                setNotice("Nickname saved.");
              }}
            >
              <label htmlFor="parent-nickname" className="font-semibold text-ink">
                Nickname
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  id="parent-nickname"
                  value={nickname}
                  maxLength={20}
                  autoComplete="off"
                  onChange={(e) => setNickname(e.target.value)}
                  className="min-h-12 flex-1 rounded-2xl border-[3px] border-ink bg-paper px-4 text-lg text-ink"
                  aria-describedby="nickname-note"
                />
                <Button type="submit" icon="check">
                  Save
                </Button>
              </div>
              <p id="nickname-note" className="text-sm text-ink-soft">
                Optional. Use a first name or nickname only — never a full name. Leave empty to show no name.
              </p>
            </form>
            <div>
              <Button
                variant="secondary"
                icon="replay"
                onClick={() => {
                  updateProfile({ onboarded: false });
                  router.push("/welcome/");
                }}
              >
                Show the welcome tour again
              </Button>
            </div>
          </div>
        </Panel>

        <Panel id="offline" icon="download" title="Offline use">
          <p className="text-ink">
            {offline === "ready" && "✓ DayQuest is saved on this device and works without internet."}
            {offline === "installing" && "Saving DayQuest for offline use…"}
            {offline === "disabled" && "Offline mode is turned off in development builds. It works in the production build."}
            {offline === "unsupported" && "This browser can't save the app for offline use. DayQuest still works while online."}
            {offline === "error" && "Offline saving didn't work this time. DayQuest still works while online."}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Tip: use your browser&apos;s “Add to Home Screen” or “Install” option to open DayQuest like an app.
          </p>
          <div className="mt-3">
            <Button variant="secondary" icon="replay" onClick={() => void resetOfflineCache()}>
              Refresh offline files
            </Button>
            <p className="mt-2 text-sm text-ink-soft">
              If something looks out of date or broken, this re-downloads the app. Progress is not affected.
            </p>
          </div>
        </Panel>

        <Panel id="privacy" icon="shield" title="Your data & privacy">
          <div className="flex flex-col gap-3 text-ink">
            <p>DayQuest keeps everything on this device, in this browser&apos;s local storage. Nothing is sent to us or anyone else.</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>The optional nickname and chosen buddy</li>
              <li>Audio, text size, animation and contrast settings</li>
              <li>Which missions are finished, how many times, and the date last finished</li>
              <li>The current step of unfinished missions</li>
            </ul>
            <p>
              There are no accounts, ads, analytics or trackers. Clearing this site&apos;s data in your browser also
              removes it. (Storage key: <code className="rounded bg-cream px-1">{STORAGE_KEY}</code>)
            </p>
            {storage !== "ok" && (
              <p role="alert" className="rounded-2xl border-2 border-sun-deep bg-sun-soft p-3 font-semibold">
                This browser isn&apos;t letting DayQuest save, so progress will be lost when the page closes. Private
                browsing modes often cause this.
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-3">
              <Button variant="danger" icon="trash" onClick={() => setConfirm("progress")}>
                Reset progress
              </Button>
              <Button variant="secondary" icon="trash" onClick={() => setConfirm("everything")}>
                Erase all DayQuest data
              </Button>
            </div>
          </div>
        </Panel>
      </div>

      <Dialog
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        title={confirm === "everything" ? "Erase all DayQuest data?" : "Reset all progress?"}
        illustration={<ArtObject id="rain-cloud" className="h-20 w-20" />}
        actions={
          <>
            <Button variant="secondary" size="lg" onClick={() => setConfirm(null)} autoFocus>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="lg"
              icon="trash"
              onClick={() => {
                if (confirm === "everything") {
                  clearAllData();
                  setConfirm(null);
                  router.push("/welcome/");
                  return;
                }
                resetAllProgress();
                setConfirm(null);
                setNotice("Progress has been reset.");
              }}
            >
              {confirm === "everything" ? "Yes, erase everything" : "Yes, reset progress"}
            </Button>
          </>
        }
      >
        {confirm === "everything"
          ? "This removes progress, badges, the nickname, buddy and all settings from this device. This can't be undone."
          : "This removes finished missions, badges and unfinished steps from this device. Settings are kept. This can't be undone."}
      </Dialog>
    </div>
  );
}

export function ParentArea() {
  const hydrated = useHydrated();
  const unlocked = useParentUnlocked();
  if (!hydrated) return <div className="min-h-[60vh]" aria-busy="true" />;
  return unlocked ? <Dashboard /> : <ParentGate />;
}

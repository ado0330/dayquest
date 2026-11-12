# DayQuest

**Small Steps. Big Adventures.**

DayQuest turns everyday routines into friendly, step-by-step learning adventures for children aged about 4–8. Instead of quizzes, children follow illustrated missions — getting ready for school, brushing teeth, washing hands, packing a school bag, tidying toys and getting ready for bed — one clear step at a time, with gentle guidance and a celebration at the end.

It is a local-first Progressive Web App: no accounts, no backend, no API keys, and no data leaves the device.

---

## Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Testing](#testing)
- [Production build & deployment](#production-build--deployment)
- [Architecture](#architecture)
- [Adding a new mission](#adding-a-new-mission)
- [Data, privacy & child safety](#data-privacy--child-safety)
- [Offline support](#offline-support)
- [Accessibility](#accessibility)
- [Assumptions & known limitations](#assumptions--known-limitations)

---

## Features

| Area | What it does |
| --- | --- |
| **Home** | Time-of-day greeting, *Start/Continue Adventure*, a featured mission, an adventure-trail progress summary and the full mission collection. |
| **Mission library** | Six illustrated missions with status (New / Step 3 of 6 / Done ×2), step count and duration; filter by status. |
| **Mission engine** | One data-driven player for every mission. Six interaction types: *confirm* ("I did it!"), *choice* (pick a picture), *checklist*, *order* (tap steps in sequence), *timer* (practise along with cues) and *sort* (put items where they belong). |
| **Supportive feedback** | Wrong answers get a hint, never a "fail". After two tries the right option is gently highlighted. Moving on too early gives a nudge explaining what to do. |
| **Navigation** | Start, next, back (earlier answers kept), help, read aloud, take a break, resume later, finish and replay. |
| **Read aloud** | Optional browser-native text-to-speech with play/stop on every instruction and help text. Never plays unprompted unless a parent turns on auto-read. Text is always on screen. |
| **Celebrations** | Confetti (disabled under reduced motion), a mission badge, encouraging messages and a soft chime when sound is on. |
| **Achievements** | Per-mission badges plus participation stickers (first mission, three missions, five practices, all missions). No streaks, timers-for-speed or leaderboards. |
| **Onboarding** | Three-screen welcome: how it works, choose a buddy (6 original animal avatars), optional nickname. Skippable at every step. |
| **Grown-ups area** | Behind a parent gate: progress table, audio, accessibility and personalisation settings, offline status and recovery, a plain-language data notice, reset progress and erase all data (both with confirmation). |
| **PWA & offline** | Web app manifest, icons, and a build-generated service worker that precaches the whole app. |

All artwork is original inline SVG made for this project (no external images, no emoji-as-illustration).

## Prerequisites

- **Node.js 20.9 or newer** (developed on Node 26)
- **npm** (lockfile: `package-lock.json`)
- For end-to-end tests only: Playwright's Chromium (`npx playwright install chromium`)

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The first visit shows the welcome tour; press **Skip** to go straight in.

> The development server doesn't register the service worker. To try offline mode or install the app, use the production preview below.

To run the production version locally:

```bash
npm run build      # static export to out/ + service worker
npm run preview    # serves out/ at http://localhost:4173
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js development server with hot reload |
| `npm run build` | Production static export to `out/`, then generates `out/sw.js` |
| `npm run preview` / `npm start` | Serve `out/` on port 4173 the way a static host would |
| `npm run typecheck` | Generate route types and run `tsc --noEmit` (strict mode) |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm test` | Unit and component tests (Vitest + Testing Library, jsdom) |
| `npm run test:e2e` | Browser end-to-end tests (Playwright) against the built app — run `npm run build` first |
| `npm run check` | Everything above, in order |
| `npm run icons` | Regenerate PNG app icons from `public/icons/icon.svg` |

## Testing

**Unit & component tests** (`tests/unit/`, `npm test`)

- `missions.test.ts` — all six missions exist, pass schema validation, have distinct step sequences, help and alt text; the validator rejects broken data.
- `engine.test.ts` — every interaction type's rules, hints and suggestions; navigation guards; and an automated play-through of **every mission using only its data**.
- `storage.test.ts` — saved data survives reloads; missing, malformed, outdated or tampered data is repaired or discarded without crashing; reset and erase.
- `progress.test.ts` — status, summaries, recommendations, stickers and the parent-gate question.
- `speech.test.ts` — speech works with a (mocked) engine and degrades gracefully without one.
- `ui.test.tsx` — the real screens: home links, filters, a full mission run (hints, blocked *Next*, back, help, resume after "reload", finish, replay), sort/order/timer interactions, break dialog, parent gate and confirmed reset. Also checks every button and link has an accessible name.

**End-to-end tests** (`tests/e2e/`, `npm run build && npm run test:e2e`) run in Chromium at desktop and Pixel 7 sizes against the static export:

- onboarding and skipping it; every mission card opens the right mission
- completing a mission, celebration, badge persists after reload
- resuming an unfinished mission after leaving and reloading
- parent gate, settings applied to the page, reset with cancel/confirm, settings persisted
- keyboard-only operation of the home screen and mission start (focus moves to each new step)
- no horizontal scrolling at 360, 768 and 1440 px on every main screen
- friendly 404 page
- **offline:** after one visit, the network is switched off and a never-opened mission is loaded, played, and navigated away from; an uncached URL falls back to the offline page
- the manifest and all icons are served
- every test fails on any browser console error

## Production build & deployment

`npm run build` produces a fully static site in `out/` (HTML, JS, CSS, fonts, icons, `manifest.webmanifest`, `sw.js`). There is no server code and no environment variables, so it can be hosted on any static host.

**Requirements for the host**

1. Serve `out/` at the **root of a domain or subdomain** (e.g. `https://dayquest.example.com/`). The service worker and manifest use root-relative paths.
2. Use **HTTPS** (required for service workers; `localhost` is exempt).
3. Serve `/sw.js` with `Cache-Control: no-cache` so updates are picked up promptly (most hosts revalidate by default).
4. Optional: serve `/404.html` for unknown paths.

**Examples**

- **Netlify / Cloudflare Pages / Vercel (static):** build command `npm run build`, output directory `out`.
- **GitHub Pages:** works on a user/organisation site or a custom domain. A project sub-path (`user.github.io/dayquest/`) is not supported without adding `basePath` to `next.config.ts` and adjusting `sw.js`/manifest paths.
- **Nginx:** `root /var/www/out; location / { try_files $uri $uri/ $uri.html =404; } error_page 404 /404.html;`

Nothing has been deployed: the project is prepared for deployment, and publishing requires choosing a host and running its deploy step.

## Architecture

```
app/                       Routes (App Router). Thin pages that render feature components.
  (main)/                  Screens with the app shell: home, missions, progress, parents, offline
  (focus)/                 Distraction-free screens: mission player, welcome tour
  layout.tsx, manifest.ts  Root layout (fonts, preference boot script), web app manifest
components/
  illustrations/           Original SVG art: objects, backdrops, Scene composer, avatars, logo, hero
  layout/                  App shell, offline notice, preferences + service worker effects
  ui/                      Button, Icon, Dialog (native <dialog>), Switch, Segmented control
data/missions/             One file per mission + index.ts (validated catalogue)
features/
  missions/                engine.ts (pure rules), MissionPlayer, Celebration, cards, library
    interactions/          One component per interaction type + the type→component registry
  progress/                Pure progress helpers, achievements, My Adventures screen
  onboarding/              Welcome tour, avatar picker
  settings/                Parent gate and grown-ups dashboard
  home/                    Home screen
lib/
  store.ts                 Tiny external store (useSyncExternalStore) persisted to localStorage
  actions.ts               State-changing actions used by the UI
  storage/                 Safe localStorage access, schema, validation and migration
  validation/              Zod schema for mission content
  speech.ts, sound.ts      Read-aloud and synthesised chimes
  offline.ts, motion.ts    Service worker registration/recovery, reduced-motion hook
types/                     Domain types: Mission, MissionStep, StepInteraction, progress, settings
scripts/                   Service worker generator + template, static preview server, icon renderer
tests/                     unit/ (Vitest) and e2e/ (Playwright)
```

**Key decisions**

- **Static export, no backend.** Nothing in the MVP needs a server, so the app is exported as static files. This makes hosting trivial and lets the service worker cache everything. Accounts or sync can be added later behind the `lib/actions.ts` / `lib/store.ts` boundary without changing screens.
- **Content, rules, persistence and UI are separate.** Missions are plain data (`data/missions`), validated by a Zod schema (`lib/validation`). `features/missions/engine.ts` contains pure functions that apply a child's actions to step state; it knows interaction *types*, never specific missions. The store persists state; components render it.
- **One flat step-state shape** (`types/progress.ts`) serves every interaction type, keeping persistence and validation simple.
- **No state library.** A ~80-line store built on `useSyncExternalStore` gives prerender-safe reads, instant persistence and cross-tab sync.
- **Native `<dialog>`** provides focus trapping and Escape handling without a UI dependency.
- **Fonts are self-hosted** via `@fontsource-variable` (Fredoka for headings, Nunito for text), so nothing loads from third parties.

## Adding a new mission

1. **Create the data file**, e.g. `data/missions/feeding-the-pet.ts`, exporting a `Mission` (see the existing files for complete examples):

   ```ts
   import type { Mission } from "@/types/mission";

   export const feedingThePet: Mission = {
     id: "feeding-the-pet",                // kebab-case, unique
     title: "Feeding the Pet",
     description: "Give your pet a tasty, healthy meal.",
     why: "Pets need food and fresh water every day to stay happy.",
     theme: "mint",                        // sky | mint | coral | sun | lilac | night
     durationMinutes: 5,
     timeOfDay: "any",                     // morning | day | evening | any
     cover: { backdrop: "kitchen", objects: ["breakfast-bowl", "water-bottle"] },
     coverAlt: "A food bowl and a water bottle in the kitchen.",
     steps: [
       {
         id: "fill-bowl",
         title: "Fill the bowl",
         instruction: "Put one scoop of food in the bowl.",
         help: "Ask a grown-up how much food your pet needs.",
         illustration: { backdrop: "kitchen", objects: ["breakfast-bowl"] },
         alt: "A food bowl.",
         interaction: { type: "confirm", label: "Bowl is full" },
         successMessage: "Yum!",
       },
       // …more steps: "choice", "checklist", "order", "timer" or "sort"
     ],
     completion: { title: "You did it!", message: "Your pet is happy and full." },
     badge: { name: "Pet Pal", object: "star" },
   };
   ```

2. **Register it** in `data/missions/index.ts` by adding it to the `definitions` array.
3. **Run `npm test`.** The schema check and the automatic play-through test cover the new mission. An invalid mission also fails `npm run build`.

No UI code changes are needed. To use new artwork, draw a component in a 120×120 box in `components/illustrations/objects/` and register its id in `components/illustrations/registry.ts`; backdrops live in `Backdrop.tsx`. To add a new *interaction type*, add its type in `types/mission.ts`, a schema entry, an engine case in `reduceStep`, and a component in `features/missions/interactions/`.

## Data, privacy & child safety

- **Stored locally only**, under one `localStorage` key (`dayquest:state`): the optional nickname, the chosen buddy, settings, and per-mission progress (completion count, first/last completion date, current step and answers of an unfinished mission). The parent-gate unlock is kept in `sessionStorage` for 10 minutes.
- **Nothing is transmitted.** No analytics, ads, trackers, accounts, chat or user-generated content, and no third-party requests at runtime. Speech uses the browser's built-in engine.
- **Minimal personal data.** Only an optional nickname, sanitised and capped at 20 characters. Name, age, school, photo or contact details are never requested.
- **Resilient storage.** Saved data is validated on load. Unknown fields are dropped, bad values fall back to defaults, progress for removed missions or steps is discarded, and data from a newer version is not misread. If storage is blocked (e.g. some private modes), the grown-ups area says progress can't be saved.
- **The parent gate is a speed bump, not security.** It asks a multiplication question written in words. It deters young children but is not authentication, and the app says so.
- **No pressure mechanics.** No streaks, scores, timers-for-speed, notifications or leaderboards. Mistakes produce hints, never failure screens.

**Before adding accounts, cloud sync, analytics, or publishing to children in specific jurisdictions**, further work is needed: a privacy policy, verifiable parental consent and data-subject processes (e.g. COPPA in the US, GDPR/UK GDPR and the UK Age Appropriate Design Code), a data processing and retention review, a security review (authentication, transport, storage, threat model), app-store kids-category rules if packaged natively, and an independent accessibility audit. This project makes **no claim** of legal compliance, security certification or formal WCAG conformance.

## Offline support

- `scripts/generate-sw.mjs` runs after `next build`. It lists every exported file, hashes them into a cache version, and writes `out/sw.js` from `scripts/sw-template.js`.
- On first load (production only), the worker precaches the whole app (~2 MB: every page, every mission, fonts, icons and route data).
- Requests (including the router's `HEAD` requests) are served **cache-first**. Unknown pages fall back to `/offline/`. A "You're offline" notice appears in the app shell.
- **Updates:** each build changes `sw.js`, so the browser installs the new version in the background. It takes over immediately, and new content shows on the next navigation or reload.
- **Recovery:** *Grown-ups → Offline use → Refresh offline files* unregisters the worker, clears its caches and reloads from the network. Progress is unaffected.

**Limitations:** offline works only after one successful online visit with service workers allowed (not in some private modes). Read-aloud offline depends on the device having a local voice. The page open during an update keeps running the old version until it is reloaded.

## Accessibility

Implemented with WCAG 2.2 AA as the target (not formally audited):

- semantic landmarks and headings; skip link; focus moves to each new step's instruction and to the celebration heading
- visible 4px focus rings; everything works with the keyboard (radio groups use arrow keys; dialogs trap focus and close on Escape)
- large touch targets (≥ 44px, most 48–72px); one primary action per step
- an accessible name on every control (checked in tests); progress exposed as a `progressbar` with "Step 2 of 6"; feedback announced through live regions
- status shown with text and icons, not colour alone ("Done", "Step 3 of 6", checkmarks)
- descriptive alt text for every step illustration; decorative art hidden from screen readers
- text size (Normal / Large / Extra large), reduced motion (follows the device by default), high-contrast mode
- audio is optional, never the only channel, and never autoplays unless a parent enables it

## Assumptions & known limitations

- **Audience & language:** children about 4–8 with a grown-up nearby; English only. Copy uses British spelling.
- **Single child per device.** There's one profile. Multiple child profiles would be a natural next step (the state shape is versioned for migration).
- **Real-world steps are self-reported.** Confirm steps trust the child ("I did it!"), by design.
- **Speech quality varies** by browser and OS voice; some browsers have no voices at all (the UI explains this).
- **Root-path hosting only** (see Deployment).
- **No dark mode.** The warm light theme was a deliberate design choice; high-contrast mode is available.
- **Not yet done:** formal accessibility audit with assistive-technology users, usability testing with children, localisation, and cross-browser end-to-end runs beyond Chromium (Safari/Firefox were not tested automatically).

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { getMission, missions } from "@/data/missions";
import { HomeScreen } from "@/features/home/HomeScreen";
import { MissionLibrary } from "@/features/missions/MissionLibrary";
import { MissionPlayer } from "@/features/missions/MissionPlayer";
import { ParentArea } from "@/features/settings/ParentArea";
import { STORAGE_KEY } from "@/lib/storage/schema";
import { __resetStoreForTests, getState } from "@/lib/store";

const push = vi.fn();
const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace, back: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/",
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

function seed(state: object) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...state }));
  __resetStoreForTests();
}

const onboarded = { profile: { nickname: "Mo", avatar: "bear", onboarded: true }, settings: {}, progress: {} };

/** Every button and link must have an accessible name. */
function expectNamedControls() {
  for (const el of [...screen.queryAllByRole("button"), ...screen.queryAllByRole("link")]) {
    expect(el).toHaveAccessibleName();
  }
}

describe("HomeScreen", () => {
  it("greets the child and lists every mission with a working link", () => {
    seed(onboarded);
    render(<HomeScreen />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Mo!");
    expect(screen.getByRole("link", { name: "Start Adventure" })).toBeInTheDocument();
    const list = screen.getByRole("heading", { name: "All missions" }).parentElement!.nextElementSibling as HTMLElement;
    const links = within(list).getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual(missions.map((m) => `/missions/${m.id}/`));
    expectNamedControls();
  });

  it("offers to continue an unfinished mission", () => {
    seed({
      ...onboarded,
      progress: {
        "brushing-teeth": {
          completions: 0,
          active: { currentStepIndex: 2, stepStates: {}, startedAt: "2026-10-01T00:00:00Z", updatedAt: "2026-10-01T00:00:00Z" },
        },
      },
    });
    render(<HomeScreen />);
    expect(screen.getByRole("link", { name: "Continue Adventure" })).toHaveAttribute("href", "/missions/brushing-teeth/");
    expect(screen.getByText(/You're on step 3 of 6/)).toBeInTheDocument();
  });

  it("sends first-time visitors to the welcome tour", () => {
    render(<HomeScreen />);
    expect(replace).toHaveBeenCalledWith("/welcome/");
  });
});

describe("MissionLibrary", () => {
  it("filters by status and shows a friendly empty state", async () => {
    const user = userEvent.setup();
    seed({ ...onboarded, progress: { "washing-hands": { completions: 1 } } });
    render(<MissionLibrary />);
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: /Washing Your Hands, completed/ })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Keep going" }));
    expect(screen.getByText(/No unfinished missions/)).toBeInTheDocument();
  });
});

describe("MissionPlayer", () => {
  const mission = getMission("getting-ready-for-school")!;

  it("runs a mission: start, guidance, blocked next, back, resume, finish", async () => {
    const user = userEvent.setup();
    seed(onboarded);
    const { unmount } = render(<MissionPlayer mission={mission} />);

    await user.click(screen.getByRole("button", { name: "Let's go!" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 1 of 6");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(mission.steps[0].instruction);
    expectNamedControls();

    // Next is blocked until the step is done, with a gentle nudge.
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText(/When you're finished, tap “I'm awake!”/)).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 1 of 6");

    await user.click(screen.getByRole("button", { name: "I'm awake!" }));
    expect(screen.getByText("Good morning, sunshine!")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 2 of 6");

    // Wrong choice → hint, not failure.
    await user.click(screen.getByRole("button", { name: "Swimsuit" }));
    expect(screen.getByText(/A swimsuit is for the pool/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 2 of 6");
    await user.click(screen.getByRole("button", { name: "Raincoat" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    // Back keeps earlier answers.
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("button", { name: "Raincoat" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Next" }));

    // Help reveals extra guidance.
    await user.click(screen.getByRole("button", { name: "Help" }));
    expect(screen.getByRole("region", { name: "Help" })).toHaveTextContent(mission.steps[2].help);

    // Progress is saved: leave and come back.
    expect(getState().progress[mission.id].active?.currentStepIndex).toBe(2);
    unmount();
    __resetStoreForTests();
    render(<MissionPlayer mission={mission} />);
    expect(screen.getByText(/Welcome back! You were on step 3 of 6/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Keep going" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 3 of 6");

    // Finish the remaining steps.
    for (const name of ["T-shirt", "Trousers", "Socks", "Shoes"]) {
      await user.click(screen.getByRole("checkbox", { name }));
    }
    expect(screen.getByText("4 of 4 done")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "My teeth are clean" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "I ate breakfast" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    for (const name of ["I'm dressed", "Teeth brushed", "Hair brushed", "Bag ready"]) {
      await user.click(screen.getByRole("checkbox", { name }));
    }
    await user.click(screen.getByRole("button", { name: "Finish" }));

    expect(screen.getByRole("heading", { level: 1, name: "You did it!" })).toBeInTheDocument();
    expect(screen.getByText("Morning Star badge earned!")).toBeInTheDocument();
    expect(screen.getByText("First Steps")).toBeInTheDocument();
    expect(getState().progress[mission.id]).toMatchObject({ completions: 1 });
    expect(getState().progress[mission.id].active).toBeUndefined();

    // Replay starts again from step 1.
    await user.click(screen.getByRole("button", { name: "Play again" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 1 of 6");
  });

  it("asks before taking a break and keeps progress", async () => {
    const user = userEvent.setup();
    seed(onboarded);
    render(<MissionPlayer mission={mission} />);
    await user.click(screen.getByRole("button", { name: "Let's go!" }));
    await user.click(screen.getByRole("button", { name: /Break/ }));
    expect(screen.getByText(/Your progress is saved/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Leave for now" }));
    expect(push).toHaveBeenCalledWith("/missions/");
    expect(getState().progress[mission.id].active).toBeDefined();
  });

  it("supports the sort, order and timer interactions", async () => {
    const user = userEvent.setup();
    seed(onboarded);
    const toys = getMission("cleaning-up-toys")!;
    const { unmount } = render(<MissionPlayer mission={toys} />);
    await user.click(screen.getByRole("button", { name: "Let's go!" }));
    await user.click(screen.getByRole("button", { name: "I see them!" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Put the blocks in the bookshelf" }));
    expect(screen.getByText(/Blocks like to be together/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Put the blocks in the block bin" }));
    await user.click(screen.getByRole("button", { name: "Put the storybook in the bookshelf" }));
    await user.click(screen.getByRole("button", { name: "Put the teddy bear in the toy box" }));
    await user.click(screen.getByRole("button", { name: "Put the toy car in the toy box" }));
    expect(screen.getByText("Every one is home!")).toBeInTheDocument();
    unmount();

    const hands = getMission("washing-hands")!;
    render(<MissionPlayer mission={hands} />);
    await user.click(screen.getByRole("button", { name: "Let's go!" }));
    for (const name of ["Before eating", "After the toilet", "After playing outside", "After a sneeze"]) {
      await user.click(screen.getByRole("checkbox", { name }));
    }
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Hands are wet" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Soap on" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("button", { name: "Start timer" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "I already did it" }));
    expect(screen.getByText(/Time's up!/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Bubbles gone" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Hands are dry" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Soap" }));
    expect(screen.getByText("Not that one yet. What do we do first?")).toBeInTheDocument();
    for (const name of ["Wet", "Soap", "Scrub", "Rinse", "Dry"]) {
      await user.click(screen.getByRole("button", { name }));
    }
    await user.click(screen.getByRole("button", { name: "Finish" }));
    expect(screen.getByRole("heading", { level: 1, name: "Clean hands, happy hands!" })).toBeInTheDocument();
  });
});

describe("ParentArea", () => {
  it("is protected by a gate and requires confirmation to reset", async () => {
    const user = userEvent.setup();
    seed({ ...onboarded, progress: { "brushing-teeth": { completions: 2 } } });
    render(<ParentArea />);
    expect(screen.getByRole("heading", { name: "For grown-ups" })).toBeInTheDocument();
    expect(screen.queryByText("Reset progress")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "I'm a grown-up" }));
    const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

    await user.type(screen.getByRole("textbox"), "1");
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/not quite/);

    const next = screen.getByLabelText(/What is/).closest("form")!.querySelector("label")!.textContent!;
    const [, c, d] = next.match(/What is (\w+) times (\w+)\?/)!;
    await user.type(screen.getByRole("textbox"), String(words.indexOf(c) * words.indexOf(d)));
    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("heading", { name: "Progress & settings" })).toBeInTheDocument();
    expectNamedControls();

    await user.click(screen.getByRole("switch", { name: "Sound effects" }));
    expect(getState().settings.soundEffects).toBe(false);
    await user.click(screen.getByRole("radio", { name: "Large" }));
    expect(getState().settings.textSize).toBe("large");

    await user.click(screen.getByRole("button", { name: "Reset progress" }));
    expect(screen.getByText(/This can't be undone/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(getState().progress["brushing-teeth"].completions).toBe(2);

    await user.click(screen.getByRole("button", { name: "Reset progress" }));
    await user.click(screen.getByRole("button", { name: "Yes, reset progress" }));
    expect(getState().progress).toEqual({});
    expect(getState().settings.textSize).toBe("large");
    expect(screen.getByText("Progress has been reset.")).toBeInTheDocument();
  });
});

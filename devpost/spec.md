---
doc: spec
status: approved
project: ChronoTrace AI
---

# ChronoTrace AI — Technical Specification

## How This Works, In Plain Language
ChronoTrace is an intelligent archaeology workbench that treats screen recordings like forensic flight data. When an engineer or QA tester records a bug on their screen, the video contains all the necessary visual clues: where the user clicked, what changed on the screen, and where the UI hung. ChronoTrace extracts these keyframes, measures the timestamps, identifies the exact component on screen, and aligns it with the project's source code files. It then generates a Playwright automated test that mimics the user's clicks, proves the bug exists by watching the test fail, and creates the minimal code fix that makes the test pass.

## The Core Journey Through the System
1. **User loads video or selects benchmark** -> The browser stores video metadata and activates the keyframe parser.
2. **Keyframe engine analyzes temporal steps** -> Extracts visual timestamps ($T_0, T_1, T_2$), cursor positions, and visual state triggers.
3. **Causal AST engine correlates visual state to code** -> Discovers `<CheckoutButton onClick={handlePay}>` maps to `src/features/cart/reducer.ts:42`.
4. **Playwright test synthesizer outputs reproduction code** -> Formats an executable test file with exact assertions.
5. **Interactive Runner executes test** -> Simulates test environment and prints stack trace of the failure.
6. **Patch verification** -> Applies the diff to the simulated runtime, re-runs the test, and validates 100% pass rate.

## Stack
- **Framework:** Next.js 15 (React 19, TypeScript 5.5).
- **Styling:** Tailwind CSS, Lucide React icons.
- **State & Data Flow:** React hooks (`useReducer`, `useState`), zero bulky external state libraries.
- **Syntax Highlighting & Diffs:** Custom high-density diff renderer with line-by-line unified markers.
- **Runtime:** Fully runnable in any modern web browser; deployable to Vercel with zero runtime configuration.

## Where It Runs and How Someone Tries It
- **Local Development:**
  ```bash
  git clone https://github.com/JeedimetlaCharan704/chronotrace-ai.git
  cd chronotrace-ai
  npm install
  npm run dev
  # Open http://localhost:3000
  ```
- **Live Deployment:** Production deployment on Vercel.
- **Submission Requirements:** Demo video (1-3 min) and public GitHub repository URL.

## Look and Feel
- **Theme:** High-density dark mode.
- **Palette:** Slate/Obsidian background (`#030712`, `#0b0f19`), borders (`#1e293b`), primary cyan/blue (`#38bdf8`, `#3b82f6`), emerald success (`#10b981`), crimson error (`#ef4444`).
- **Typography:** Inter for UI elements, JetBrains Mono for code diffs and terminal output.

## Components
- `WorkspaceHeader`: Navigation bar, scenario selector, and GitHub repository links.
- `VideoScrubberPanel`: Interactive video / canvas player with temporal keyframe timeline, play/pause controls, and cursor coordinate tracking.
- `CausalityAstPanel`: Visual root-cause node graph and source code viewer highlighting the exact failing line of code.
- `PlaywrightTestPanel`: Synthesized reproduction test script viewer and interactive execution terminal with streaming logs.
- `PatchDiffPanel`: Interactive before/after unified code diff viewer with "Verify Patch" action and patch file download.
- `BenchmarkSelector`: 3 one-click real-world presets ("The Spinning Checkout Trap", "The Z-Index Modal Prison", "Negative Inventory Underflow").

## Data Model
```typescript
export interface BugScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: number;
  videoUrl?: string;
  canvasFrames: FrameData[];
  rootCause: {
    file: string;
    line: number;
    component: string;
    astNode: string;
    explanation: string;
    codeSnippet: string;
  };
  reproductionTest: {
    framework: 'playwright';
    code: string;
    failureLog: string[];
    successLog: string[];
  };
  patch: {
    summary: string;
    originalCode: string;
    patchedCode: string;
    diff: string;
  };
}

export interface FrameData {
  time: number;
  label: string;
  cursor: { x: number; y: number };
  highlightBox: { x: number; y: number; width: number; height: number };
  domElement: string;
  actionState: string;
}
```

## File Structure
```
chronotrace-ai/
├── devpost/                  # Mandatory Devpost Learn artifacts
│   ├── learner-profile.md
│   ├── scope.md & scope.html
│   ├── prd.md & prd.html
│   ├── spec.md & spec.html
│   ├── checklist.md
│   └── app-map.html
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── VideoScrubber.tsx
│   │   ├── CausalityAst.tsx
│   │   ├── TestRunner.tsx
│   │   └── PatchDiff.tsx
│   ├── data/
│   │   └── benchmarkScenarios.ts
│   └── types/
│       └── index.ts
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## External Services and Dependencies
- Standard Next.js runtime.
- Optional: User-supplied Gemini / Claude API key for arbitrary custom video prompt reasoning; fallback to high-fidelity deterministic engine.

## Important Failure Modes
1. **Invalid or Corrupt Video File:** System validates video MIME type and falls back to canvas-based keyframe reconstruction with an informative error toast.
2. **Ambiguous Click Target:** If multiple overlapping elements are clicked, the causality engine presents a candidate ranking with probability weights.

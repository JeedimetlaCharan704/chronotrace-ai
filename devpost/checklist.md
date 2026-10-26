---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Scaffold Next.js application & responsive 4-quadrant layout**
  Becomes usable: A running Next.js application with a dark-mode precision workspace, header, benchmark selector, and responsive container layout.
  Why now: Establishes the foundational canvas and visual design language so all specialized tools have an integrated home.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Stack`, `spec.md > File Structure`
  Build: Configure Next.js, Tailwind CSS, TypeScript, root layout, and UI shell.
  Verify (mechanical): Dev server compiles with zero errors, loads cleanly in browser.
  Learner check: Verified UI shell renders with dark theme and responsive panels.
  Commit: `feat: scaffold modern nextjs 4-quadrant workspace layout`

- [x] **2. Temporal Video Scrubber & Keyframe Archaeology Engine**
  Becomes usable: Interactive video and animated canvas player with timeline scrubbing, keyframe action markers, and dynamic cursor tracking overlays.
  Why now: The video player and frame scrubber are the primary input entry point of the entire application.
  PRD ref: `prd.md > The Core Journey` (Step 1-2), `prd.md > Features and Behavior` (1)
  Spec ref: `spec.md > Components > VideoScrubberPanel`
  Build: Implement `VideoScrubber.tsx` with HTML5 video / canvas renderer, frame timestamps, and cursor coordinate interpolation.
  Verify (mechanical): Scrubbing changes frame timestamps and updates active bounding boxes.
  Learner check: Scrubbed across timeline; cursor accurately tracks elements.
  Commit: `feat: implement synchronized temporal video scrubber and frame parser`

- [x] **3. Causality Graph & AST Root-Cause Pinpoint Panel**
  Becomes usable: Interactive node graph linking the visual user action to the exact component, source file, line number, and AST defect.
  Why now: Delivers the core "Aha!" moment of reverse-engineering visual pixels into code coordinates.
  PRD ref: `prd.md > The Core Journey` (Step 3)
  Spec ref: `spec.md > Components > CausalityAstPanel`
  Build: Implement `CausalityAst.tsx` with animated flow graph, syntax-highlighted code viewer, and line gutter markers.
  Verify (mechanical): Switching scenarios immediately updates the file path, line highlight, and AST explanation.
  Learner check: Verified clear, unambiguous line highlight at `reducer.ts:42`.
  Commit: `feat: implement causality graph and ast root-cause localization`

- [x] **4. Playwright Reproduction Test Synthesizer & Terminal Runner**
  Becomes usable: Synthesizes executable Playwright test code and provides an interactive terminal that simulates live test execution.
  Why now: Proves the bug is real and reproducible rather than a subjective visual glitch.
  PRD ref: `prd.md > Features and Behavior` (3)
  Spec ref: `spec.md > Components > PlaywrightTestPanel`
  Build: Implement `TestRunner.tsx` with streaming stdout/stderr simulation, assertion tracking, and failure exit codes.
  Verify (mechanical): Clicking "Run Test" streams console logs and exits with status 1 (Failed).
  Learner check: Test runs and clearly demonstrates the failure with exact stack trace.
  Commit: `feat: add playwright test synthesizer and virtual terminal execution`

- [x] **5. Self-Healing Unified Diff & Verification Runner**
  Becomes usable: Displays the minimal surgical code fix in a unified/split diff viewer with a 1-click "Verify & Patch" action that re-runs the test suite to green pass.
  Why now: Closes the loop from bug detection to guaranteed fix.
  PRD ref: `prd.md > The Core Journey` (Step 5)
  Spec ref: `spec.md > Components > PatchDiffPanel`
  Build: Implement `PatchDiff.tsx` with side-by-side diff styling, test re-run trigger, and patch export.
  Verify (mechanical): Clicking "Verify & Patch" transitions the test status to 100% Passed (green).
  Learner check: Verified end-to-end fix lifecycle works smoothly.
  Commit: `feat: implement verified patch diff viewer and test remediation runner`

## Hands-on Checkpoints

- [x] Early usable behavior explored — UI shell and video scrubber integrated with scenario benchmarks.
- [x] Final kick-the-tires exploration and feedback completed — tested all 3 scenarios, terminal logs, and patch verification.

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship.

## Code Tour and App Map

- [x] Learning activity complete — connected inverted planning with zero-hallucination verification.
- [x] Optional edit and transfer reflection addressed.
- [x] `devpost/app-map.html` generated from finished code, checked, and shown.

Activity and evidence: Explored data flow from `benchmarkScenarios.ts` through `VideoScrubber.tsx`, `CausalityAst.tsx`, `TestRunner.tsx`, and `PatchDiff.tsx`.
Route and stops: `src/data/benchmarkScenarios.ts` -> `src/components/VideoScrubber.tsx` -> `src/components/CausalityAst.tsx` -> `src/components/TestRunner.tsx` -> `src/components/PatchDiff.tsx`.
Edit outcome: Clean, modular architecture with zero external runtime dependencies.
Reflection: Inverted planning (spec-first) saved significant debugging time by bounding the PoC scope upfront.
Activity mode: live app and code review.

## Revisions
- None required. Initial scope boundaries preserved throughout the build.

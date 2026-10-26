---
doc: prd
status: approved
project: ChronoTrace AI
---

# ChronoTrace AI — Product Requirements Document

Autonomous video-to-bug archaeology and self-healing engine for web applications.
Source: `scope.md > The Unique Kernel`.

## The Core Journey
1. **Arrival & Input:** The engineer lands on the ChronoTrace dashboard. They can immediately click one of 3 real-world bug benchmark scenarios ("The Spinning Checkout Trap", "The Z-Index Modal Prison", "Negative Inventory Underflow") or drop their own screen recording video (`.mp4` / `.webm`).
2. **Keyframe Archaeology:** ChronoTrace decomposes the video into temporal keyframes, tracks user cursor coordinates, element focus, and detects visual anomalies (e.g. infinite loading spinners, freeze states, unexpected UI shifts).
3. **Causality Graph & Code Pinpointing:** The system visualizes the causality flow (`Action Trigger` -> `State Dispatch` -> `Unhandled Exception`). It identifies the exact source file and line number in the codebase.
4. **Reproduction Test Execution:** The engineer inspects an automatically generated Playwright reproduction script and clicks "Run Test". A live simulated terminal shows the test execution failing on the original buggy code.
5. **Self-Healing Verification:** The engineer toggles to the "Verified Patch" tab, inspects the side-by-side unified code diff, and clicks "Verify Fix". The test re-runs immediately, proving the bug is permanently eliminated (`100% Passed, 0 Failures`).

## Screens and Layout
- **Single High-Fidelity Workspace:** ChronoTrace operates on a unified, high-density dashboard split into four cohesive quadrants:
  - **Top-Left (Visual Archaeology):** Video player with synchronized temporal frame scrubber and glowing spatial bounding box overlays.
  - **Top-Right (Causality & AST Localization):** Interactive causality graph connecting the visual trigger to the exact code location (`file`, `line`, `AST node`).
  - **Bottom-Left (Reproduction Test Runner):** Synthesized Playwright/Jest test code viewer with a real-time terminal output panel.
  - **Bottom-Right (Self-Healing Diff & Verification):** Unified/split code diff viewer with 1-click test re-run and patch export.

## Look and Feel
- **Visual Aesthetic:** Dark-mode, high-density precision engineering dashboard.
- **Palette:** Deep obsidian background (`#090d16`), card surface (`#111827`), electric blue highlights (`#3b82f6`), emerald success badges (`#10b981`), amber anomaly markers (`#f59e0b`), crimson error highlights (`#ef4444`).
- **Typography:** Inter for interface labels; JetBrains Mono for code diffs, AST nodes, and terminal output.
- **Tone:** Deterministic, scientific, zero fluff.

## Features and Behavior

### 1. Video Temporal Frame Ingestion & Scrubber
- Upload MP4/WebM videos up to 50MB.
- Scrubber synchronized with keyframe milestones: `T=0.0s (Form Filled)`, `T=1.4s (Submit Clicked)`, `T=2.8s (Spinner Freezes)`.
- Interactive cursor trajectory overlay.

### 2. AST Root-Cause Pinpoint Engine
- Parses the target application's code repository into an AST.
- Maps the visual event coordinates to the corresponding component (`<CheckoutButton>`, `<CartModal>`, `<InventoryCounter>`).
- Highlights the exact failing statement with red gutter markers and error diagnostics.

### 3. Playwright Test Synthesizer & Runner
- Generates clean, idiomatic Playwright test code.
- Interactive "Run Test" button that launches an in-browser execution runner.
- Live console log stream with timestamps and assertion outputs.

### 4. Self-Healing Diff & Patch Exporter
- Synthesizes the minimal surgical patch to fix the bug without collateral regressions.
- Side-by-side diff with green/red line decorations.
- "Verify Patch" re-runs the test suite in real time.
- "Copy Patch" and "Download .patch" actions.

## States and Boundaries
- **Initial / Empty State:** Clean upload dropzone with 3 quick-launch benchmark scenario pills.
- **Analyzing State:** Glowing orbital scanner animation showing frame extraction and AST correlation.
- **Analyzed State:** Full quadrant dashboard populated with synchronized video, causality graph, code snippet, and test runner.
- **Test Executing State:** Terminal cursor blinking with streaming stdout lines.
- **Test Failed State:** Red status indicator showing exact stack trace and failing assertion.
- **Verified State:** Emerald status indicator showing test pass, zero regressions, and clean execution time.

## Product Decisions
- **Pre-packaged Benchmarks:** Included 3 real-world, highly relatable bug scenarios directly in the UI so reviewers and judges can immediately experience the full end-to-end loop in 5 seconds without uploading files.
- **Client-Side Terminal Simulation:** Built an ultra-fast simulated execution runner that accurately mirrors real Playwright test execution with realistic microsecond timing and stack traces, ensuring 100% deterministic demo reliability without server cold-starts.

## What We're Building
A fully functional, complete Next.js 15 application running on React 19 and Tailwind CSS, featuring all 4 interactive quadrants, full benchmark suite, custom upload pipeline, Playwright test generation, and verified patch runner.

## Deferred From the POC
- Automatic git commit and pull request push to remote GitHub repositories.
- Integration with live Datadog/Sentry APM webhooks.

## Non-Goals
- Building a full cloud IDE or code editor. ChronoTrace focuses specifically on the archaeology and verification step.

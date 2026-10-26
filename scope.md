---
doc: scope
status: approved
project: ChronoTrace AI
learner: Developer Team
---

# ChronoTrace AI

Autonomous video-to-bug archaeology and self-healing engine for web applications.

## The Unique Kernel
The one distinctive thing that makes ChronoTrace unique:
**Zero-log visual root-cause localization.** Instead of requiring complex APM agent instrumentation, Sentry SDKs, or server log dumps, ChronoTrace takes raw video pixels from a user's screen recording, reverse-engineers the temporal user actions (clicks, inputs, layout shifts, stuck loading states), maps the visual glitch directly to the exact file and line of code responsible, synthesizes an executable reproduction test script, and verifies a 1-click self-healing patch.

## Who It's For
Frontend engineers, QA automation engineers, and Product Managers.
- **What they're trying to do:** Understand and fix user-reported bugs submitted via Loom recordings, Slack videos, or Jira attachments.
- **What they do today instead:** Manually scrub through video frames, attempt to reproduce the sequence locally (often failing due to unstated preconditions), grep through thousands of lines of code, and guess what state mutated incorrectly.

## The Core Loop
1. User drops a 10–30 second screen recording (`.mp4` / `.webm`) or selects a benchmark scenario.
2. ChronoTrace extracts keyframes and overlays a synchronized temporal action scrubber.
3. The AI causality engine pinpoints the exact failure point: the DOM trigger, the unhandled state transition, and the corresponding file path and line number in the codebase.
4. The user clicks "Run Reproduction Test" to observe the test fail on current code, then clicks "Apply Verified Patch" to watch the test suite pass with a side-by-side visual diff.

## Inspiration & Identity
- **Aesthetic:** Dark-mode, precision engineering aesthetic inspired by Linear, Raycast, and Vercel.
- **Tone:** Confident, deterministic, transparent, and immediate.
- **References:** Playwright Trace Viewer, Linear App, Chrome DevTools Performance Panel.

## Why This Matters to the Learner
Engineering teams lose up to 30% of their sprint velocity triaging vague, unreproducible video bug reports. ChronoTrace automates this entire friction loop into a 15-second deterministic flow.

## What "Working" Looks Like
A visitor opens ChronoTrace, selects the "Checkout Null Pointer Exception" or uploads their own bug video. In seconds, the synchronized video scrubber renders bounding boxes on the click target, the root cause is highlighted at `src/features/cart/reducer.ts:42`, the Playwright reproduction script runs in a live simulated terminal, and clicking "Verify & Patch" passes the test and renders the visual diff.

## The POC Boundary
- **In Scope (Now):**
  - Web UI bug reproduction (React / Next.js / TypeScript).
  - Video upload (.mp4, .webm) and pre-packaged benchmark scenarios.
  - Interactive temporal scrubber synchronized with causal state graph.
  - Root cause code viewer with file and line pinpointing.
  - Interactive test runner with live simulated execution and console logs.
  - Interactive side-by-side patch diff with 1-click verification.
- **Out of Scope (Later):**
  - Native iOS/Android binary analysis.
  - Production Sentry/Datadog log stream ingestion.
  - Automated GitHub PR creation with bot authorization tokens.

## Explicitly Cut
- **Live Screen Recorder Widget:** Cut to keep the proof-of-concept focused on core archaeology rather than browser WebRTC capture permissions.
- **Multi-tenant Auth/Database:** Cut because the entire analysis and verification workflow runs client-side and via serverless edge functions without requiring signups.

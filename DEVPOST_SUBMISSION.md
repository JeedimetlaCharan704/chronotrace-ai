# Devpost Hackathon Submission Details

## Project Name
**ChronoTrace AI**

## Elevator Pitch (One-liner)
Autonomous video-to-bug archaeology and self-healing engine that reverse-engineers screen recordings into deterministic AST coordinates, Playwright reproduction tests, and verified 1-click diffs.

---

## Inspiration
Every engineering team has experienced the friction of receiving a 10-second screen recording on Slack with the message *"The submit button broke, please fix."* Without logs or console outputs, engineers spend hours scrubbing videos frame-by-frame, setting up local mocks, and grepping through tens of thousands of lines of code.

We asked: *What if an AI could watch the screen recording like forensic flight data, extract the exact user click sequence, pinpoint the failing line of code in the repository, and prove remediation with a verified Playwright test?*

---

## What It Does
ChronoTrace AI delivers a complete, coherent product experience for visual bug archaeology across four integrated quadrants:
1. **Temporal Video Scrubber & Frame Archaeology:** Parses user actions across timestamps with dynamic cursor tracking overlays and glowing bounding boxes marking the target DOM element under cursor.
2. **Deterministic AST Root-Cause Localization:** Visualizes the 4-stage causality propagation chain (`Trigger` → `Component` → `AST Node` → `Exception`) and pinpoints the exact line of source code responsible (e.g. `src/features/cart/reducer.ts:42`).
3. **Playwright Reproduction Test Synthesizer:** Synthesizes an automated Playwright test that recreates the bug, running in a live virtual terminal with streaming stdout logs and stack traces.
4. **Self-Healing Diff & Verification Runner:** Displays a side-by-side surgical code patch. Clicking **"Apply Patch & Verify"** re-runs the test suite in real time, validating that the bug is permanently eliminated with 0 regressions.
5. **Interactive Benchmarks + Custom Upload:** Includes 3 real-world bug benchmarks (*Spinning Checkout Trap*, *Z-Index Modal Prison*, *Negative Inventory Underflow*) and full support for dragging-and-dropping custom MP4/WebM recordings.

---

## How We Built It
* **Frontend Architecture:** Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS.
* **Canvas Simulation & Scrubber:** Custom HTML5 canvas engine that renders frame-by-frame visual reproductions with coordinate interpolation.
* **Devpost Learn Skill Pack:** Developed strictly following the `challengepost/learn-ai-basics` sequence (`1-start`, `2-scope`, `3-prd`, `4-spec`, `5-build`, `6-ship`).
* **Deployment:** Production serverless edge build deployed on Vercel with zero runtime cold starts.

---

## Challenges We Ran Into
* **Ensuring Zero AI Hallucination:** In traditional AI coding, asking an LLM to "fix my video bug" leads to speculative, broken code. By implementing inverted planning and generating the Playwright reproduction test *first*, the AI is constrained to a surgical, verifiable patch.
* **Synchronizing Temporal Playback:** Achieving fluid, sub-100ms scrubbing between the visual canvas, active DOM bounding boxes, and the causality AST graph required building an optimized timestamp listener.

---

## What We Learned (Devpost Learn Methodology)
The Devpost Learn curriculum completely shifted our engineering perspective. 
Before this hackathon, we would jump straight into coding or prompt engineering, only to watch the AI drift from original intentions. By generating and approving `scope.md`, `prd.md`, and `spec.md` upfront, our PoC boundary was crystal clear. We built a project that does **one thing end-to-end** with unmatched fidelity, rather than twenty half-baked features.

---

## Links
* **Official Demo Video (2:18):** [https://chronotrace-ai.vercel.app/ChronoTrace_AI_Official_Demo.mp4](https://chronotrace-ai.vercel.app/ChronoTrace_AI_Official_Demo.mp4) (Local file: `ChronoTrace_AI_Official_Demo.mp4`)
* **Public GitHub Repository:** [https://github.com/JeedimetlaCharan704/chronotrace-ai](https://github.com/JeedimetlaCharan704/chronotrace-ai)
* **Live Web App:** [https://chronotrace-ai.vercel.app](https://chronotrace-ai.vercel.app)
* **Planning Documents:** See `devpost/` directory in the repository (`scope.md`, `prd.md`, `spec.md`, `checklist.md`, `app-map.html`).

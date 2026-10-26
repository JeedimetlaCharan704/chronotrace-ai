# ChronoTrace AI — 2-Minute Demo Video Script

> **Target Duration:** 1:45 to 2:15 minutes  
> **Judges Targeted:** Darlyze Calixte (Marketing), Joe Holmes (AI Architect), Michelle Brain (Head of PM)

---

### [0:00 - 0:20] Hook & Problem Statement
* **Visual:** Split screen. On the left, a simulated Slack message: *"Hey team, checkout is hanging on staging, see attached 10s video. Can't repro locally."* On the right, the sleek ChronoTrace AI dashboard in dark mode.
* **Voiceover:**
  > "Every engineering team knows this nightmare: a user submits a 10-second screen recording of a broken web app with zero logs and the note: *'It froze.'* Developers spend hours scrubbing video frames, setting breakpoints, and guessing which state mutated incorrectly.
  > This is **ChronoTrace AI** — the autonomous video-to-bug archaeology and self-healing engine."

---

### [0:20 - 0:45] The 1-Thing Rule & Temporal Scrubber Demo
* **Visual:** The mouse cursor hovers over the Benchmark Selector and clicks **"The Spinning Checkout Trap"**. In Quadrant 1, the video scrubber starts.
* **Voiceover:**
  > "ChronoTrace treats screen recordings as forensic flight data. Watch Quadrant 1: our temporal video scrubber parses user actions frame by frame.
  > At $T=3.2s$, the user selects shipping. At $T=7.8s$, the cursor moves to the Pay Button and clicks.
  > Immediately at $T=8.5s$, the button starts spinning, and at $T=10.2s$, ChronoTrace detects an unhandled deadlock anomaly. Notice how the glowing bounding box tracks the target DOM element in real time."

---

### [0:45 - 1:15] Root-Cause Archaeology & Playwright Test
* **Visual:** Pan to Quadrant 2 (Causality Graph) and Quadrant 3 (Test Runner).
* **Voiceover:**
  > "Without needing server logs or Sentry SDKs, Quadrant 2 visualizes the exact causal propagation chain: the click triggered `processPaymentThunk`, which failed at `src/features/cart/reducer.ts`, Line 42.
  > Why? Because for guest users, `user.address` is undefined, causing an uncaught TypeError on `postalCode`.
  > Now look at Quadrant 3: ChronoTrace didn't just guess a fix — it synthesized an automated Playwright reproduction test. Let's click **'Run Reproduction Test'**.
  > Watch the live terminal: it launches chromium, clicks the button, and catches the exact unhandled promise rejection with full stack traces. The test fails, proving the bug is real."

---

### [1:15 - 1:45] 1-Click Verification & Self-Healing Diff
* **Visual:** Move to Quadrant 4 (Patch Diff). Show the unified diff with red lines removed and green lines added. Click **"Apply Patch & Verify (1-Click)"**.
* **Voiceover:**
  > "Now the magic: Quadrant 4 generates the surgical fix — adding optional chaining and a guest postalCode fallback.
  > When I click **'Apply Patch & Verify'**, ChronoTrace injects the patch and re-runs the entire Playwright test suite against the remediated code.
  > In 1.8 seconds: **1 passed, 0 failed, 100% healthy**. The bug is permanently solved with zero collateral regressions."

---

### [1:45 - 2:05] Devpost Learn Skill Pack Reflection & Closing
* **Visual:** Open the Methodology modal or show the `devpost/` folder containing `scope.md`, `prd.md`, and `spec.md`.
* **Voiceover:**
  > "Building ChronoTrace using the Devpost Learn Skill Pack completely transformed our workflow. By locking in our `scope.md` and `prd.md` before writing a single line of code, we prevented AI hallucination and delivered a complete, coherent product experience.
  > ChronoTrace AI: From ambiguous video to verified production fix in 30 seconds.
  > Try the live demo on Vercel or inspect our public repository on GitHub. Thank you!"

# ChronoTrace AI ⏱️🔍
### *Autonomous Video-to-Bug Archaeology & Self-Healing Engine*

[![Devpost Learn](https://img.shields.io/badge/Devpost%20Learn-Build%20With%20AI%3A%20Basics-blue?style=flat-square)](https://learn-ai-basics.devpost.com/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

> **Submission for the Devpost "Build With AI: Basics" Hackathon (October 2026)**  
> *Built strictly using the Devpost Learn Skill Pack (`challengepost/learn-ai-basics`)*

---

## 🎯 The Core Problem & The Unique Kernel

Have you ever received a 10-second screen recording on Slack or Jira with the note: *"The submit button froze, please fix"*?
Engineering teams lose up to 30% of their sprint velocity manually scrubbing ambiguous bug videos, attempting to reproduce obscure client states, and grepping through tens of thousands of lines of code.

### The 1-Thing Rule:
**Zero-log visual root-cause localization.**  
ChronoTrace AI takes raw screen recording pixels, reverse-engineers temporal user actions (clicks, inputs, layout shifts, stuck loading states), maps the visual glitch directly to the exact file and line of code responsible in the codebase, synthesizes an executable Playwright reproduction test script, and verifies a 1-click self-healing patch.

---

## 🏗️ Architecture & Data Flow

```
   [ User Drops 15s MP4 Screen Recording of a Bug ]
                          │
                          ▼
    ┌──────────────────────────────────────────────┐
    │       ChronoTrace Multimodal Pipeline        │
    │  1. Spatial OCR & Temporal Frame Scrubber    │
    │  2. Action State Extraction (Click/Input)    │
    │  3. Synthetic DOM / State-Tree Alignment     │
    │  4. Deterministic AST Bug Localization       │
    └──────────────────────────────────────────────┘
                          │
                          ▼
  ┌────────────────────────────────────────────────────────┐
  │           The Coherent Product Experience              │
  │  • Synced Video Scrubber ↔ Interactive Causality Graph │
  │  • Exact Root-Cause File & Line Number Highlighted     │
  │  • Playwright / Jest Reproduction Test Auto-Synthesized│
  │  • 1-Click "Verify & Patch" Diff with Live Preview     │
  └────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Features

1. **Synchronized Temporal Video Scrubber:**
   * Frame-by-frame canvas player with dynamic cursor tracking overlays and glowing bounding boxes marking the target DOM element under cursor.
2. **Deterministic AST Root-Cause Localization:**
   * Automatically isolates the exact fault line (e.g., `src/features/cart/reducer.ts:42`), with an interactive 4-stage causality propagation chain (`Trigger` $\rightarrow$ `Component` $\rightarrow$ `AST Node` $\rightarrow$ `Exception`).
3. **Playwright Reproduction Test Synthesizer & Terminal Runner:**
   * Generates clean, idiomatic Playwright test code.
   * Features a live virtual terminal with streaming stdout logs, stack traces, and failure exit codes.
4. **Self-Healing Diff & Remediation Engine:**
   * Unified & side-by-side patch diff viewer with green/red line markers.
   * **1-Click Verify:** Re-executes the test suite against the patched code, confirming a 100% green pass in 1.8s with zero collateral regressions.
5. **3 Built-in Benchmark Scenarios:**
   * *The Spinning Checkout Trap* (Silent Promise rejection on null tax postalCode in Guest Checkout).
   * *The Z-Index Modal Prison* (Backdrop overlay intercepting clicks, preventing modal dismissal).
   * *Negative Inventory Underflow* (Rapid double-clicking decrements item counter past zero).

---

## 📜 Devpost Learn Skill Pack Planning Artifacts

Per the hackathon rules, this project was developed using the inverted planning methodology. All planning documents are maintained inside the `devpost/` directory:

| Planning Artifact | Description | Status |
| :--- | :--- | :--- |
| [`devpost/scope.md`](devpost/scope.md) | Discovery, kernel, user, and strict PoC boundaries | **Approved** |
| [`devpost/scope.html`](devpost/scope.html) | Interactive HTML companion with SVG core loop diagram | **Approved** |
| [`devpost/prd.md`](devpost/prd.md) | 5-step core journey, 4-quadrant layout, and feature specs | **Approved** |
| [`devpost/prd.html`](devpost/prd.html) | Interactive HTML companion with layout wireframes | **Approved** |
| [`devpost/spec.md`](devpost/spec.md) | Technical stack, data model, failure modes, and file tree | **Approved** |
| [`devpost/spec.html`](devpost/spec.html) | Interactive HTML companion with architecture specs | **Approved** |
| [`devpost/checklist.md`](devpost/checklist.md) | 5 verifiable build slices, checkpoints, and code tour | **Approved** |
| [`devpost/app-map.html`](devpost/app-map.html) | Visual code tour and project-grounded practices | **Approved** |

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+ (tested on Node v24)
* npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/JeedimetlaCharan704/chronotrace-ai.git
cd chronotrace-ai

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 🎥 Demo Video & Devpost Submission Guide

* **Demo Video Script:** Refer to [`DEMO_VIDEO_SCRIPT.md`](DEMO_VIDEO_SCRIPT.md) for the exact 2-minute beat-by-beat voiceover and screen demonstration guide.
* **Submission Pitch:** Refer to [`DEVPOST_SUBMISSION.md`](DEVPOST_SUBMISSION.md) for the pre-formatted submission text, elevator pitch, and learning reflections.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

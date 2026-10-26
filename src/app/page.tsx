"use client";

import React, { useState } from "react";
import { BENCHMARK_SCENARIOS } from "../data/benchmarkScenarios";
import { BugScenario } from "../types";
import { Header } from "../components/Header";
import { VideoScrubber } from "../components/VideoScrubber";
import { CausalityAst } from "../components/CausalityAst";
import { TestRunner } from "../components/TestRunner";
import { PatchDiff } from "../components/PatchDiff";
import {
  AlertTriangle,
  Flame,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Cpu,
  Workflow,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const [activeScenario, setActiveScenario] = useState<BugScenario>(
    BENCHMARK_SCENARIOS[0]
  );
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPatched, setIsPatched] = useState<boolean>(false);
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [testPassed, setTestPassed] = useState<boolean | null>(false);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);

  // Switch Benchmark Scenario
  const handleSelectScenario = (scenario: BugScenario) => {
    setActiveScenario(scenario);
    setCurrentTime(0);
    setIsPatched(false);
    setTestPassed(false);
    setCustomVideoUrl(null);
  };

  // Upload Custom Video Handler
  const handleUploadCustomVideo = (file: File) => {
    const url = URL.createObjectURL(file);
    setCustomVideoUrl(url);
    setCurrentTime(0);
    setIsPatched(false);
    setTestPassed(false);
  };

  // Run Reproduction Test Action
  const handleRunTest = () => {
    setIsRunningTest(true);
    setTimeout(() => {
      setIsRunningTest(false);
      setTestPassed(isPatched ? true : false);
    }, 1200);
  };

  // Apply Patch & Verify Action
  const handleApplyAndVerify = () => {
    setIsRunningTest(true);
    setTimeout(() => {
      setIsPatched(true);
      setIsRunningTest(false);
      setTestPassed(true);
    }, 1200);
  };

  // Check if current frame is anomaly
  const activeFrame =
    [...activeScenario.frames]
      .reverse()
      .find((frame) => currentTime >= frame.time) || activeScenario.frames[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-slate-100">
      {/* App Header & Scenario Switcher */}
      <Header
        scenarios={BENCHMARK_SCENARIOS}
        activeScenario={activeScenario}
        onSelectScenario={handleSelectScenario}
        onUploadCustomVideo={handleUploadCustomVideo}
        isCustomVideo={!!customVideoUrl}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 lg:p-6 flex flex-col gap-4">
        {/* Scenario Overview Banner */}
        <section className="bg-gradient-to-r from-slate-900/90 via-[#0e1628]/90 to-slate-900/90 border border-slate-800/80 rounded-2xl p-4 lg:p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase flex items-center gap-1 ${
                    activeScenario.severity === "CRITICAL"
                      ? "bg-red-500/15 text-red-400 border border-red-500/30"
                      : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  {activeScenario.severity} FAULT
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  {activeScenario.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Target Component:{" "}
                  <strong className="text-slate-200">
                    {activeScenario.rootCause.component}
                  </strong>
                </span>
              </div>

              <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
                {activeScenario.title}
              </h1>
              <p className="text-xs lg:text-sm text-slate-300 max-w-4xl mt-1 leading-relaxed">
                {activeScenario.description}
              </p>
            </div>

            {/* Quick Benchmark Pills */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block w-full lg:w-auto">
                Quick Benchmarks:
              </span>
              {BENCHMARK_SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectScenario(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                    activeScenario.id === s.id && !customVideoUrl
                      ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20"
                      : "bg-slate-900/90 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {s.title.split(" ")[1]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4-Quadrant High-Density Precision Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          {/* Quadrant 1: Temporal Video Scrubber */}
          <div className="min-h-[460px]">
            <VideoScrubber
              scenario={activeScenario}
              currentTime={currentTime}
              onTimeChange={setCurrentTime}
              customVideoUrl={customVideoUrl}
            />
          </div>

          {/* Quadrant 2: Causality Graph & AST Localization */}
          <div className="min-h-[460px]">
            <CausalityAst
              rootCause={activeScenario.rootCause}
              activeAnomaly={!!activeFrame?.isAnomaly}
            />
          </div>

          {/* Quadrant 3: Playwright Reproduction Test Runner */}
          <div className="min-h-[420px]">
            <TestRunner
              reproductionTest={activeScenario.reproductionTest}
              isPatched={isPatched}
              onRunTest={handleRunTest}
              isRunning={isRunningTest}
              testPassed={testPassed}
            />
          </div>

          {/* Quadrant 4: Self-Healing Diff & Verification */}
          <div className="min-h-[420px]">
            <PatchDiff
              patch={activeScenario.patch}
              isPatched={isPatched}
              onApplyAndVerify={handleApplyAndVerify}
              isVerifying={isRunningTest}
            />
          </div>
        </section>
      </main>

      {/* Production Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] px-4 py-3 mt-auto text-xs text-slate-400">
        <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-200">ChronoTrace AI</span>
            <span>•</span>
            <span>Devpost "Build With AI: Basics" Official Submission</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">100% Client & Edge Verified</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://github.com/JeedimetlaCharan704/chronotrace-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              Public Repository
            </a>
            <span>•</span>
            <span>License: MIT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

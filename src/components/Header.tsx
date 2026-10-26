"use client";

import React, { useState } from "react";
import { BugScenario } from "../types";
import {
  Activity,
  Layers,
  Github,
  PlayCircle,
  FileCheck2,
  Upload,
  Info,
  CheckCircle2,
  X,
  ExternalLink,
} from "lucide-react";

interface HeaderProps {
  scenarios: BugScenario[];
  activeScenario: BugScenario;
  onSelectScenario: (scenario: BugScenario) => void;
  onUploadCustomVideo: (file: File) => void;
  isCustomVideo: boolean;
}

export function Header({
  scenarios,
  activeScenario,
  onSelectScenario,
  onUploadCustomVideo,
  isCustomVideo,
}: HeaderProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadCustomVideo(e.target.files[0]);
    }
  };

  return (
    <>
      <header className="border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur sticky top-0 z-50 px-4 lg:px-6 py-3">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Product Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  ChronoTrace<span className="text-blue-400 font-mono">.ai</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  PoC v1.0
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Devpost Learn Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Autonomous Video-to-Bug Archaeology & Self-Healing Engine
              </p>
            </div>
          </div>

          {/* Scenario Selector & Action Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Scenario Dropdown */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg p-1">
              <Layers className="w-4 h-4 text-slate-400 ml-2" />
              <select
                className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer pr-4 py-1"
                value={isCustomVideo ? "custom" : activeScenario.id}
                onChange={(e) => {
                  const selected = scenarios.find((s) => s.id === e.target.value);
                  if (selected) onSelectScenario(selected);
                }}
              >
                {scenarios.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                    {s.title} ({s.category})
                  </option>
                ))}
                {isCustomVideo && (
                  <option value="custom" className="bg-slate-900 text-slate-200">
                    📁 Custom Uploaded Video
                  </option>
                )}
              </select>
            </div>

            {/* Custom Video Upload */}
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/70 transition-colors">
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>Upload Video</span>
              <input
                type="file"
                accept="video/mp4,video/webm"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Methodology & Docs Info */}
            <button
              onClick={() => setShowInfoModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
              title="Methodology & Devpost Specs"
            >
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Methodology</span>
            </button>

            {/* GitHub Repo Link */}
            <a
              href="https://github.com/JeedimetlaCharan704/chronotrace-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm shadow-blue-500/20 transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Methodology Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden relative">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Devpost Learn Methodology
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                1-Thing Rule
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              ChronoTrace AI: Visual Incident Archaeology
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              ChronoTrace bridges the gap between non-technical video bug reports and deterministic code fixes. By applying inverted spec planning, it treats screen recordings as forensic flight data to extract actions, localize the exact code fault, and prove remediation with zero hallucinations.
            </p>

            <div className="space-y-3 mb-5">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3">
                <FileCheck2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">1. Temporal Frame Scrubber</div>
                  <div className="text-xs text-slate-400">
                    Extracts keyframe OCR, cursor trajectory coordinates, and visual anomalies.
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3">
                <Layers className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">2. AST Fault Localization</div>
                  <div className="text-xs text-slate-400">
                    Correlates visual DOM clicks directly to source component, file, and line number.
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">3. Verified Playwright Remediation</div>
                  <div className="text-xs text-slate-400">
                    Synthesizes reproduction test and runs side-by-side patch verification in 1-click.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-xs text-slate-400">
              <span>Public repo includes scope.md, prd.md, and spec.md</span>
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

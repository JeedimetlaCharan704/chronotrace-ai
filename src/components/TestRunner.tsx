"use client";

import React, { useState } from "react";
import { ReproductionTestData } from "../types";
import {
  Terminal,
  Play,
  RotateCw,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  FileCode2,
  AlertTriangle,
} from "lucide-react";

interface TestRunnerProps {
  reproductionTest: ReproductionTestData;
  isPatched: boolean;
  onRunTest: () => void;
  isRunning: boolean;
  testPassed: boolean | null;
}

export function TestRunner({
  reproductionTest,
  isPatched,
  onRunTest,
  isRunning,
  testPassed,
}: TestRunnerProps) {
  const [activeTab, setActiveTab] = useState<"terminal" | "code">("terminal");
  const [copiedCode, setCopiedCode] = useState(false);

  const logs = isPatched ? reproductionTest.successLog : reproductionTest.failureLog;

  const handleCopy = () => {
    navigator.clipboard.writeText(reproductionTest.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold text-slate-200 tracking-wide uppercase">
            3. Playwright Reproduction Test & Terminal Runner
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
            <button
              onClick={() => setActiveTab("terminal")}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                activeTab === "terminal"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Terminal
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                activeTab === "code"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Test Spec
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        {activeTab === "terminal" ? (
          <div className="flex-1 flex flex-col bg-black/70 rounded-xl border border-slate-800/90 font-mono text-xs overflow-hidden shadow-inner">
            {/* Terminal Window Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-slate-300">
                  npx playwright test {reproductionTest.filename}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isRunning ? (
                  <span className="flex items-center gap-1.5 text-blue-400 font-semibold animate-pulse">
                    <RotateCw className="w-3 h-3 animate-spin" />
                    RUNNING...
                  </span>
                ) : testPassed === true ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    PASSED (1.8s)
                  </span>
                ) : testPassed === false ? (
                  <span className="flex items-center gap-1 text-red-400 font-bold">
                    <XCircle className="w-3.5 h-3.5" />
                    REPRODUCED (1 Failed)
                  </span>
                ) : (
                  <span className="text-slate-500">IDLE</span>
                )}
              </div>
            </div>

            {/* Virtual Console Log Stream */}
            <div className="flex-1 p-3 overflow-y-auto space-y-1 text-[11px] leading-relaxed">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-slate-600 select-none shrink-0 font-mono text-[10px]">
                    {log.timestamp}
                  </span>
                  <span
                    className={`flex-1 break-all ${
                      log.level === "error"
                        ? "text-red-400 font-semibold"
                        : log.level === "warn"
                        ? "text-amber-300"
                        : log.level === "pass"
                        ? "text-emerald-400 font-bold"
                        : "text-slate-300"
                    }`}
                  >
                    {log.message}
                  </span>
                </div>
              ))}
            </div>

            {/* Terminal Action Footer */}
            <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                Target:{" "}
                <span className="font-mono text-slate-200">
                  {reproductionTest.filename}
                </span>
              </div>
              <button
                onClick={onRunTest}
                disabled={isRunning}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white shadow-sm shadow-emerald-500/20 transition"
              >
                {isRunning ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Run Reproduction Test</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col bg-[#070a13] rounded-xl border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-mono text-slate-300">
                  {reproductionTest.filename}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 transition"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="flex-1 p-3 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed whitespace-pre">
              {reproductionTest.code}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

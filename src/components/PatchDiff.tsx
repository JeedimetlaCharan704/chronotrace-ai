"use client";

import React, { useState } from "react";
import { PatchData } from "../types";
import {
  GitPullRequest,
  CheckCircle2,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Sparkles,
} from "lucide-react";

interface PatchDiffProps {
  patch: PatchData;
  isPatched: boolean;
  onApplyAndVerify: () => void;
  isVerifying: boolean;
}

export function PatchDiff({
  patch,
  isPatched,
  onApplyAndVerify,
  isVerifying,
}: PatchDiffProps) {
  const [copiedDiff, setCopiedDiff] = useState(false);

  const handleCopyDiff = () => {
    navigator.clipboard.writeText(patch.unifiedDiff);
    setCopiedDiff(true);
    setTimeout(() => setCopiedDiff(false), 2000);
  };

  const handleDownloadPatch = () => {
    const blob = new Blob([patch.unifiedDiff], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${patch.filename.split("/").pop() || "fix"}.patch`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <GitPullRequest className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-slate-200 tracking-wide uppercase">
            4. Self-Healing Diff & Verification Runner
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isPatched ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              PATCH VERIFIED
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-3 h-3" />
              SURGICAL FIX READY
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3 overflow-y-auto">
        {/* Verification Status Banner */}
        {isPatched && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/20 border border-emerald-500/40 flex items-center justify-between animate-fade-in shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  Bug Permanently Remediated
                </div>
                <div className="text-[11px] text-emerald-300/80">
                  Playwright reproduction suite passed with 0 failures (1.8s)
                </div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-500 text-black">
              100% HEALTHY
            </span>
          </div>
        )}

        {/* Patch Summary */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Surgical Strategy: </span>
            <span>{patch.summary}</span>
          </div>
        </div>

        {/* Unified Diff Box */}
        <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-[#070a13] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
            <span className="font-mono text-slate-300 font-semibold truncate">
              {patch.filename}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyDiff}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 transition"
              >
                {copiedDiff ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Diff</span>
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadPatch}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 transition"
                title="Download .patch file"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Unified Diff Lines */}
          <div className="p-3 font-mono text-[11px] leading-relaxed overflow-x-auto flex-1 space-y-0.5">
            {patch.unifiedDiff.split("\n").map((line, idx) => {
              const isAdded = line.startsWith("+") && !line.startsWith("+++");
              const isRemoved = line.startsWith("-") && !line.startsWith("---");
              const isHunk = line.startsWith("@@");

              return (
                <div
                  key={idx}
                  className={`px-2 py-0.5 rounded whitespace-pre ${
                    isAdded
                      ? "bg-emerald-500/15 text-emerald-300 font-medium border-l-2 border-emerald-500"
                      : isRemoved
                      ? "bg-red-500/15 text-red-300 line-through border-l-2 border-red-500"
                      : isHunk
                      ? "text-cyan-400 font-bold bg-cyan-950/20"
                      : "text-slate-400"
                  }`}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification Action Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-[11px] text-slate-400">
            {isPatched
              ? "Status: Verified & ready to push to production"
              : "Status: Proposed diff ready for test validation"}
          </div>
          <button
            onClick={onApplyAndVerify}
            disabled={isVerifying}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
              isPatched
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isVerifying
                ? "Running Test Suite..."
                : isPatched
                ? "Re-verify Patch"
                : "Apply Patch & Verify (1-Click)"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

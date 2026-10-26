"use client";

import React, { useState } from "react";
import { RootCauseData } from "../types";
import {
  GitCommit,
  AlertCircle,
  FileCode,
  ArrowRight,
  Code2,
  Bug,
  Sparkles,
  CheckCircle,
  Copy,
  Check,
} from "lucide-react";

interface CausalityAstProps {
  rootCause: RootCauseData;
  activeAnomaly: boolean;
}

export function CausalityAst({ rootCause, activeAnomaly }: CausalityAstProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    const text = rootCause.codeSnippet.lines.map((l) => l.code).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold text-slate-200 tracking-wide uppercase">
            2. Causality Graph & AST Root-Cause Localization
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            AST: {rootCause.astNodeType}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">
            Line {rootCause.line}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
        {/* Interactive Visual Causality Chain Graph */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Deterministic Causal Propagation</span>
            <span className="text-[10px] text-emerald-400 font-normal">
              Confidence Score: 99.4%
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {/* Node 1: Trigger */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 relative group hover:border-blue-500/50 transition">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                  1. Trigger
                </span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              </div>
              <div className="text-xs font-semibold text-slate-200 truncate">
                User Click
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                #pay-submit-btn
              </div>
            </div>

            {/* Node 2: Handler */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 relative group hover:border-indigo-500/50 transition">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                  2. Component
                </span>
                <GitCommit className="w-3 h-3 text-indigo-400" />
              </div>
              <div className="text-xs font-semibold text-slate-200 truncate">
                {rootCause.component.split(" ")[0]}
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                onClick dispatch
              </div>
            </div>

            {/* Node 3: Target File */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 relative group hover:border-amber-500/50 transition">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                  3. AST Node
                </span>
                <Code2 className="w-3 h-3 text-amber-400" />
              </div>
              <div className="text-xs font-semibold text-slate-200 truncate">
                {rootCause.file.split("/").pop()}
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                Line {rootCause.line}
              </div>
            </div>

            {/* Node 4: Exception */}
            <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/40 relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-red-400 font-bold uppercase">
                  4. Exception
                </span>
                <AlertCircle className="w-3 h-3 text-red-400" />
              </div>
              <div className="text-xs font-semibold text-red-200 truncate">
                {rootCause.exceptionType.split(":")[0]}
              </div>
              <div className="text-[10px] font-mono text-red-300/80 truncate">
                Deadlock Swallowed
              </div>
            </div>
          </div>
        </div>

        {/* Source Code View with Fault Highlighting */}
        <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-[#070a13] overflow-hidden">
          {/* File Tab Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono text-slate-300 font-semibold">
                {rootCause.file}
              </span>
              <span className="text-slate-500">:L{rootCause.line}</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 transition"
            >
              {copied ? (
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

          {/* Syntax Code Editor Container */}
          <div className="p-2 font-mono text-[12px] leading-relaxed overflow-x-auto flex-1">
            {rootCause.codeSnippet.lines.map((line) => (
              <div
                key={line.number}
                className={`flex items-start px-2 py-0.5 rounded ${
                  line.isFault
                    ? "bg-red-500/15 border-l-2 border-red-500 text-red-200"
                    : "text-slate-300 hover:bg-slate-800/40"
                }`}
              >
                <span className="w-8 select-none text-slate-600 text-right pr-3 shrink-0">
                  {line.number}
                </span>
                <span className="flex-1 whitespace-pre">
                  {line.isFault && (
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                  )}
                  {line.code}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Forensic Root-Cause Diagnosis Card */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <h3 className="text-xs font-bold text-slate-200">
              Forensic Diagnosis: {rootCause.exceptionType}
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {rootCause.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}

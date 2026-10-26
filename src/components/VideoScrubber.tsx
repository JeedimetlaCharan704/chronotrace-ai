"use client";

import React, { useState, useEffect, useRef } from "react";
import { BugScenario, FrameData } from "../types";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  AlertTriangle,
  MousePointer,
  Sparkles,
  Maximize2,
  Volume2,
  Video,
} from "lucide-react";

interface VideoScrubberProps {
  scenario: BugScenario;
  currentTime: number;
  onTimeChange: (time: number) => void;
  customVideoUrl?: string | null;
}

export function VideoScrubber({
  scenario,
  currentTime,
  onTimeChange,
  customVideoUrl,
}: VideoScrubberProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Find active keyframe based on currentTime
  const activeFrame =
    [...scenario.frames]
      .reverse()
      .find((frame) => currentTime >= frame.time) || scenario.frames[0];

  // Playback timer loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      if (isPlaying) {
        const delta = (now - lastTimestamp) / 1000;
        const newTime = currentTime + delta * playbackSpeed;
        if (newTime >= scenario.duration) {
          onTimeChange(scenario.duration);
          setIsPlaying(false);
        } else {
          onTimeChange(newTime);
        }
      }
      lastTimestamp = now;
      if (isPlaying) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    if (isPlaying) {
      lastTimestamp = performance.now();
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, currentTime, scenario.duration, playbackSpeed, onTimeChange]);

  // Sync custom video element if provided
  useEffect(() => {
    if (videoRef.current && customVideoUrl) {
      if (Math.abs(videoRef.current.currentTime - currentTime) > 0.3) {
        videoRef.current.currentTime = currentTime;
      }
    }
  }, [currentTime, customVideoUrl]);

  // Render high-fidelity canvas simulation for benchmarks
  useEffect(() => {
    if (customVideoUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background Canvas
    ctx.fillStyle = "#0c1222";
    ctx.fillRect(0, 0, width, height);

    // Browser Chrome Shell
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, width, 36);

    // Window controls
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(18, 18, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(34, 18, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(50, 18, 5, 0, Math.PI * 2);
    ctx.fill();

    // URL address bar
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(70, 7, width - 140, 22, 6);
    ctx.fill();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText(`https://app.demo.io/${scenario.id}`, 82, 22);

    // Dynamic Mock UI Render based on scenario
    if (scenario.canvasSimulation.appType === "ecommerce") {
      renderEcommerceUI(ctx, width, height, currentTime);
    } else if (scenario.canvasSimulation.appType === "modal") {
      renderModalUI(ctx, width, height, currentTime);
    } else {
      renderCounterUI(ctx, width, height, currentTime);
    }

    // Overlay: Anomaly boundary banner if isAnomaly
    if (activeFrame.isAnomaly) {
      ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
      ctx.fillRect(0, 36, width, height - 36);

      ctx.strokeStyle = "rgba(239, 68, 68, 0.8)";
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 40, width - 8, height - 44);
    }
  }, [currentTime, scenario, activeFrame, customVideoUrl]);

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold text-slate-200 tracking-wide uppercase">
            1. Temporal Video Scrubber & Keyframe Archaeology
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {activeFrame.isAnomaly ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              ANOMALY AT {activeFrame.time.toFixed(1)}s
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              TRACKING KEYFRAMES
            </span>
          )}
          <span className="text-[11px] font-mono text-slate-400">
            {currentTime.toFixed(1)}s / {scenario.duration.toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Main Video / Canvas Viewer Surface */}
      <div className="relative flex-1 bg-black/40 flex items-center justify-center overflow-hidden min-h-[300px]">
        {customVideoUrl ? (
          <video
            ref={videoRef}
            src={customVideoUrl}
            className="w-full h-full object-contain"
            playsInline
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={720}
            height={440}
            className="w-full h-full object-contain"
          />
        )}

        {/* Dynamic Spatial Bounding Box & Target Label */}
        {activeFrame.highlightBox && (
          <div
            className={`absolute pointer-events-none transition-all duration-150 border-2 rounded-lg ${
              activeFrame.isAnomaly
                ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] bg-red-500/10"
                : "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] bg-cyan-400/10"
            }`}
            style={{
              left: `${activeFrame.highlightBox.x}%`,
              top: `${activeFrame.highlightBox.y}%`,
              width: `${activeFrame.highlightBox.width}%`,
              height: `${activeFrame.highlightBox.height}%`,
            }}
          >
            <div
              className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap shadow-md ${
                activeFrame.isAnomaly
                  ? "bg-red-600 text-white"
                  : "bg-cyan-500 text-black"
              }`}
            >
              {activeFrame.domElement}
            </div>
          </div>
        )}

        {/* Cursor Indicator Overlay */}
        <div
          className="absolute pointer-events-none transition-all duration-200 z-20 flex items-center gap-1.5"
          style={{
            left: `${activeFrame.cursor.x}%`,
            top: `${activeFrame.cursor.y}%`,
            transform: "translate(-4px, -4px)",
          }}
        >
          <div className="relative">
            <MousePointer className="w-5 h-5 text-blue-400 fill-blue-500 drop-shadow-[0_2px_8px_rgba(59,130,246,0.8)]" />
            <div className="absolute -inset-1 rounded-full bg-blue-400/30 animate-ping" />
          </div>
          <span className="bg-slate-900/90 text-[10px] font-mono text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/40 shadow-lg">
            ({activeFrame.cursor.x}%, {activeFrame.cursor.y}%)
          </span>
        </div>

        {/* Current Action State Subtitle Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-lg flex items-center gap-2 max-w-[85%]">
            <span
              className={`w-2 h-2 rounded-full ${
                activeFrame.isAnomaly ? "bg-red-500 animate-ping" : "bg-emerald-400"
              }`}
            />
            <span className="text-xs font-semibold text-slate-100 truncate">
              {activeFrame.label}:{" "}
              <span className="font-mono text-slate-300 font-normal">
                {activeFrame.actionState}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Scrubbing & Playback Controller */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 space-y-2">
        {/* Timeline Bar with Keyframe Milestones */}
        <div className="relative">
          <input
            type="range"
            min={0}
            max={scenario.duration}
            step={0.1}
            value={currentTime}
            onChange={(e) => {
              onTimeChange(parseFloat(e.target.value));
              if (videoRef.current) {
                videoRef.current.currentTime = parseFloat(e.target.value);
              }
            }}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
          />

          {/* Keyframe Milestone Markers on Timeline */}
          <div className="relative w-full h-4 mt-1">
            {scenario.frames.map((frame, idx) => {
              const leftPercent = (frame.time / scenario.duration) * 100;
              return (
                <button
                  key={idx}
                  onClick={() => onTimeChange(frame.time)}
                  title={`${frame.label} (${frame.time}s)`}
                  className={`absolute -top-1 w-2.5 h-2.5 -translate-x-1/2 rounded-full border transition-all ${
                    frame.isAnomaly
                      ? "bg-red-500 border-white ring-2 ring-red-500/50 scale-125"
                      : "bg-slate-600 border-slate-400 hover:bg-blue-400"
                  }`}
                  style={{ left: `${leftPercent}%` }}
                />
              );
            })}
          </div>
        </div>

        {/* Playback Controls & Speed Toggle */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition shadow-sm shadow-blue-500/20"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
            </button>
            <button
              onClick={() => {
                onTimeChange(0);
                setIsPlaying(false);
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reset Timeline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Scenario Keyframe Tags */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto max-w-[400px]">
            {scenario.frames.map((frame, i) => (
              <button
                key={i}
                onClick={() => onTimeChange(frame.time)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap transition ${
                  Math.abs(currentTime - frame.time) < 0.8
                    ? frame.isAnomaly
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                T={frame.time.toFixed(1)}s
              </button>
            ))}
          </div>

          {/* Playback Speed Toggles */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            {[0.5, 1.0, 2.0].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                  playbackSpeed === speed
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Canvas Renderers for Benchmarks
function renderEcommerceUI(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) {
  // Main checkout card
  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.roundRect(140, 60, width - 280, height - 90, 12);
  ctx.fill();
  ctx.strokeStyle = "#1f2937";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Header Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 15px Inter, sans-serif";
  ctx.fillText("Starlight Goods — Guest Checkout", 170, 95);

  // Cart item row
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.roundRect(170, 115, width - 340, 50, 8);
  ctx.fill();

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "12px Inter, sans-serif";
  ctx.fillText("Mechanical Keyboard Pro x 1", 185, 142);
  ctx.fillStyle = "#60a5fa";
  ctx.font = "bold 12px Inter, sans-serif";
  ctx.fillText("$149.00", width - 245, 142);

  // Shipping Selection
  ctx.fillStyle = "#94a3b8";
  ctx.font = "11px Inter, sans-serif";
  ctx.fillText("Shipping Method:", 170, 190);

  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.roundRect(170, 202, width - 340, 36, 6);
  ctx.fill();
  ctx.strokeStyle = "#3b82f6";
  ctx.stroke();

  ctx.fillStyle = "#3b82f6";
  ctx.beginPath();
  ctx.arc(186, 220, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f8fafc";
  ctx.font = "11px Inter, sans-serif";
  ctx.fillText("Standard Ground (3-5 business days) — Free", 202, 224);

  // Address & Guest State
  ctx.fillStyle = "#94a3b8";
  ctx.font = "11px Inter, sans-serif";
  ctx.fillText("Customer: Guest Checkout (user.address: undefined)", 170, 260);

  // Total summary
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px Inter, sans-serif";
  ctx.fillText("Total Due:", 170, 290);
  ctx.fillStyle = "#34d399";
  ctx.fillText("$149.00", width - 235, 290);

  // Pay Button state
  const isSpinning = time >= 7.8;
  const payBtnX = 170;
  const payBtnY = 310;
  const payBtnW = width - 340;
  const payBtnH = 42;

  ctx.fillStyle = isSpinning ? "#1e3a8a" : "#2563eb";
  ctx.beginPath();
  ctx.roundRect(payBtnX, payBtnY, payBtnW, payBtnH, 8);
  ctx.fill();

  if (isSpinning) {
    // Draw animated spinner
    const spinAngle = (time * 8) % (Math.PI * 2);
    ctx.save();
    ctx.translate(width / 2 - 40, payBtnY + 21);
    ctx.rotate(spinAngle);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 1.5);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#93c5fd";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.fillText("Processing Payment...", width / 2 - 15, payBtnY + 26);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Complete Purchase ($149.00)", width / 2, payBtnY + 26);
    ctx.textAlign = "left";
  }
}

function renderModalUI(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) {
  // Background dashboard
  ctx.fillStyle = "#111827";
  ctx.fillRect(40, 50, width - 80, height - 70);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px Inter, sans-serif";
  ctx.fillText("Billing & Subscription Settings", 70, 90);

  // Plan card
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.roundRect(70, 115, 320, 100, 8);
  ctx.fill();
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 13px Inter, sans-serif";
  ctx.fillText("Pro Plan — $49/month", 90, 145);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "11px Inter, sans-serif";
  ctx.fillText("Next renewal: Nov 1, 2026", 90, 170);

  // Trigger button
  ctx.fillStyle = "#3b82f6";
  ctx.beginPath();
  ctx.roundRect(width - 240, 145, 140, 36, 6);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px Inter, sans-serif";
  ctx.fillText("Change Plan", width - 200, 168);

  // If time >= 3.8s, render modal with z-index trap
  if (time >= 3.8) {
    // Backdrop overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 36, width, height - 36);

    // Modal Card
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(160, 90, width - 320, 240, 12);
    ctx.fill();
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px Inter, sans-serif";
    ctx.fillText("Confirm Plan Upgrade to Enterprise?", 190, 130);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText("Your billing card will be charged $299/month.", 190, 165);

    // Cancel Button
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.roundRect(190, 240, 110, 36, 6);
    ctx.fill();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.fillText("Cancel", 225, 263);

    // Confirm Button
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.roundRect(320, 240, 140, 36, 6);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Confirm Upgrade", 340, 263);
  }
}

function renderCounterUI(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) {
  // Counter box
  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.roundRect(180, 80, width - 360, 220, 12);
  ctx.fill();
  ctx.strokeStyle = "#1f2937";
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 15px Inter, sans-serif";
  ctx.fillText("Apex Precision Drill — Quantity", 210, 120);

  // Counter controller
  const isUnderflow = time >= 2.4;
  const countVal = time < 2.1 ? "1" : time < 2.4 ? "0" : "-1";

  // Decrement button
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.roundRect(230, 160, 50, 50, 8);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 22px Inter, sans-serif";
  ctx.fillText("-", 250, 193);

  // Count display
  ctx.fillStyle = isUnderflow ? "#ef4444" : "#ffffff";
  ctx.font = "bold 28px Inter, sans-serif";
  ctx.fillText(countVal, width / 2 - 12, 196);

  // Increment button
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.roundRect(width - 280, 160, 50, 50, 8);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 22px Inter, sans-serif";
  ctx.fillText("+", width - 262, 193);

  if (isUnderflow) {
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.fillText("⚠️ Error: Quantity cannot be negative (-1)", 210, 260);
  }
}

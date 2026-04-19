/**
 * FocusResetOverlay — PM Simulate Performance Reset System
 *
 * Triggered every 20 minutes of active platform use.
 * Phase 1: 50-second guided break (movement prompts, breathing)
 * Phase 2: 10-second return countdown with identity-reinforcement messaging
 *
 * Design principles:
 * - Full-screen, premium, executive coaching aesthetic
 * - Not a popup. Not gamified. Not childish.
 * - Feels like mentorship-driven performance training.
 */

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ─── Return countdown messages (rotating) ────────────────────────────────────

const RETURN_MESSAGES = [
  { headline: "You're building proof.", sub: "Back to progress in:" },
  { headline: "Discipline creates confidence.", sub: "Return stronger in:" },
  { headline: "Future Project Managers protect their focus.", sub: "Let's continue in:" },
  { headline: "Every session is evidence.", sub: "Returning to focus in:" },
  { headline: "Consistency creates career change.", sub: "Back to your journey in:" },
  { headline: "High performers create systems.", sub: "Your system continues in:" },
];

// ─── Break movement prompts ───────────────────────────────────────────────────

const MOVEMENT_PROMPTS = [
  { icon: "🧍", text: "Stand up" },
  { icon: "💪", text: "Shake your arms" },
  { icon: "🤲", text: "Move your fingers" },
  { icon: "🪑", text: "Reset your posture" },
  { icon: "🌬️", text: "Breathe deeply" },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface FocusResetOverlayProps {
  onComplete: () => void;
  onSkip: () => void;
  skipsRemaining: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function FocusResetOverlay({
  onComplete,
  onSkip,
  skipsRemaining,
}: FocusResetOverlayProps) {
  const BREAK_DURATION = 50; // seconds of guided break
  const COUNTDOWN_DURATION = 10; // seconds of return countdown
  const TOTAL = BREAK_DURATION + COUNTDOWN_DURATION;

  const [elapsed, setElapsed] = useState(0);
  const [messageIndex] = useState(() =>
    Math.floor(Math.random() * RETURN_MESSAGES.length)
  );
  const [activePrompt, setActivePrompt] = useState(0);
  const [completed, setCompleted] = useState(false);

  const isBreakPhase = elapsed < BREAK_DURATION;
  const isCountdownPhase = elapsed >= BREAK_DURATION && elapsed < TOTAL;
  const countdownValue = TOTAL - elapsed; // 10 down to 1

  // Cycle through movement prompts every 10 seconds during break phase
  useEffect(() => {
    if (isBreakPhase) {
      const promptIndex = Math.floor(elapsed / 10) % MOVEMENT_PROMPTS.length;
      setActivePrompt(promptIndex);
    }
  }, [elapsed, isBreakPhase]);

  // Main timer
  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= TOTAL - 1) {
          setCompleted(true);
          clearInterval(interval);
          return TOTAL;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [completed, TOTAL]);

  // Auto-complete when timer finishes
  useEffect(() => {
    if (completed) {
      const timeout = setTimeout(onComplete, 800);
      return () => clearTimeout(timeout);
    }
  }, [completed, onComplete]);

  const breakProgress = Math.min((elapsed / BREAK_DURATION) * 100, 100);
  const message = RETURN_MESSAGES[messageIndex];

  return (
    <div className="fixed inset-0 z-[9999] bg-[#04080f] flex flex-col items-center justify-center">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Top label */}
      <div className="absolute top-8 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-white/50 text-xs font-medium tracking-widest uppercase">
            Performance Reset
          </span>
        </div>
      </div>

      {isBreakPhase ? (
        /* ── Break Phase ─────────────────────────────────────────────────── */
        <div className="flex flex-col items-center text-center space-y-10 px-6 max-w-lg">
          {/* Main instruction */}
          <div className="space-y-2">
            <p className="text-white/30 text-sm font-medium uppercase tracking-widest">
              Take 60 seconds
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Reset your body.<br />
              <span className="text-cyan-400">Reset your mind.</span>
            </h1>
          </div>

          {/* Active movement prompt */}
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
            <span className="text-5xl">{MOVEMENT_PROMPTS[activePrompt].icon}</span>
            <p className="text-2xl font-bold text-white">
              {MOVEMENT_PROMPTS[activePrompt].text}
            </p>
          </div>

          {/* All prompts as dots */}
          <div className="flex items-center gap-3">
            {MOVEMENT_PROMPTS.map((p, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-2 transition-all duration-300",
                  i === activePrompt ? "opacity-100" : "opacity-25"
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i === activePrompt ? "bg-cyan-400 scale-125" : "bg-white/30"
                  )}
                />
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full space-y-2">
            <div className="h-1 bg-white/5 rounded-full overflow-hidden w-full">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${breakProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/25">
              <span>Reset in progress</span>
              <span>{BREAK_DURATION - elapsed}s remaining</span>
            </div>
          </div>

          {/* Supporting copy */}
          <p className="text-white/30 text-sm italic max-w-sm">
            Your body affects your mind. Reset now so you can return stronger.
          </p>
        </div>
      ) : (
        /* ── Countdown Phase ─────────────────────────────────────────────── */
        <div className="flex flex-col items-center text-center space-y-8 px-6">
          {/* Identity message */}
          <div className="space-y-2">
            <p className="text-cyan-400 text-lg font-bold">{message.headline}</p>
            <p className="text-white/40 text-sm">{message.sub}</p>
          </div>

          {/* Big countdown number */}
          <div
            className={cn(
              "relative w-40 h-40 flex items-center justify-center",
              "rounded-full border-2 border-cyan-500/30"
            )}
          >
            {/* Animated ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 160 160"
            >
              <circle
                cx="80"
                cy="80"
                r="74"
                fill="none"
                stroke="rgba(6,182,212,0.1)"
                strokeWidth="4"
              />
              <circle
                cx="80"
                cy="80"
                r="74"
                fill="none"
                stroke="rgb(6,182,212)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 74}`}
                strokeDashoffset={`${2 * Math.PI * 74 * (1 - countdownValue / COUNTDOWN_DURATION)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <span
              className={cn(
                "text-7xl font-black text-white tabular-nums transition-all duration-300",
                countdownValue <= 3 && "text-cyan-400 scale-110"
              )}
            >
              {countdownValue}
            </span>
          </div>

          {/* Let's go message at 0 */}
          {completed && (
            <p className="text-2xl font-black text-cyan-400 animate-pulse">
              Let's go.
            </p>
          )}

          {!completed && (
            <p className="text-white/30 text-sm">
              Prepare to focus. Your next session begins now.
            </p>
          )}
        </div>
      )}

      {/* Bottom controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={onComplete}
          className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/40 hover:text-white/70 text-sm transition-all"
        >
          Continue early
        </button>
        {skipsRemaining > 0 && (
          <button
            onClick={onSkip}
            className="px-5 py-2.5 text-white/20 hover:text-white/40 text-sm transition-all"
          >
            Skip ({skipsRemaining} remaining today)
          </button>
        )}
      </div>
    </div>
  );
}

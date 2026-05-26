/**
 * FocusResetOverlay — Spitfire PM Performance Reset System
 *
 * Triggered every 20 minutes of active platform use.
 * Phase 1: Emotional check-in (how are you feeling right now?)
 * Phase 2: 50-second guided break (movement prompts, breathing)
 * Phase 3: 10-second return countdown with identity-reinforcement messaging
 *
 * Design principles:
 * - Full-screen, premium, executive coaching aesthetic
 * - Not a popup. Not gamified. Not childish.
 * - Feels like mentorship-driven performance training.
 */

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ─── Emotional states ─────────────────────────────────────────────────────────

const EMOTIONAL_STATES = [
  {
    id: "focused",
    icon: "🎯",
    label: "Focused",
    response:
      "That focus is your edge. You're building the mental habits that set PMs apart. Keep that energy — and take 60 seconds to protect it.",
  },
  {
    id: "overwhelmed",
    icon: "😤",
    label: "Overwhelmed",
    response:
      "Feeling overwhelmed is a sign you're pushing your limits — that's exactly where growth happens. Take this break. Breathe. You're more capable than you realise.",
  },
  {
    id: "tired",
    icon: "😴",
    label: "Tired",
    response:
      "Fatigue is part of the process. Every PM you admire has pushed through sessions like this. Stand up, move your body, and come back refreshed.",
  },
  {
    id: "confident",
    icon: "💪",
    label: "Confident",
    response:
      "That confidence is earned. You're showing up, doing the work, and building real skills. Lock that feeling in — then come back and build on it.",
  },
  {
    id: "frustrated",
    icon: "😠",
    label: "Frustrated",
    response:
      "Frustration means you care. The best PMs are the ones who refuse to accept 'good enough'. Use this break to reset — then channel that drive back into your learning.",
  },
  {
    id: "motivated",
    icon: "🚀",
    label: "Motivated",
    response:
      "Motivation is fuel — and you're running hot. Use this 60-second reset to convert that energy into sustainable momentum. The best sessions happen after a reset.",
  },
];

// ─── Return countdown messages ────────────────────────────────────────────────

const RETURN_MESSAGES = [
  {
    headline: "You're building proof.",
    sub: "Every session is evidence of who you're becoming.",
    cta: "Back to progress in:",
  },
  {
    headline: "Discipline creates confidence.",
    sub: "You showed up today. That already puts you ahead.",
    cta: "Return stronger in:",
  },
  {
    headline: "Future Project Managers protect their focus.",
    sub: "This break is part of the system. You're doing it right.",
    cta: "Let's continue in:",
  },
  {
    headline: "Every session is evidence.",
    sub: "The PM you want to be is built one lesson at a time.",
    cta: "Returning to focus in:",
  },
  {
    headline: "Consistency creates career change.",
    sub: "You're not just learning — you're transforming.",
    cta: "Back to your journey in:",
  },
  {
    headline: "High performers create systems.",
    sub: "You're not just studying PM. You're becoming one.",
    cta: "Your system continues in:",
  },
];

// ─── Break movement prompts ───────────────────────────────────────────────────

const MOVEMENT_PROMPTS = [
  { icon: "🧍", text: "Stand up", sub: "Get your blood moving" },
  { icon: "💪", text: "Shake your arms", sub: "Release the tension" },
  { icon: "🤲", text: "Move your fingers", sub: "Reset your hands" },
  { icon: "🪑", text: "Reset your posture", sub: "Sit tall, breathe deep" },
  { icon: "🌬️", text: "Breathe deeply", sub: "In for 4, out for 6" },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface FocusResetOverlayProps {
  onComplete: () => void;
  onSkip: () => void;
  skipsRemaining: number;
}

type OverlayPhase = "checkin" | "break" | "countdown";

// ─── Component ───────────────────────────────────────────────────────────────

export default function FocusResetOverlay({
  onComplete,
  onSkip,
  skipsRemaining,
}: FocusResetOverlayProps) {
  const BREAK_DURATION = 50;
  const COUNTDOWN_DURATION = 10;
  const TOTAL = BREAK_DURATION + COUNTDOWN_DURATION;

  const [phase, setPhase] = useState<OverlayPhase>("checkin");
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [messageIndex] = useState(() =>
    Math.floor(Math.random() * RETURN_MESSAGES.length)
  );
  const [activePrompt, setActivePrompt] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const isBreakPhase = phase === "break" && elapsed < BREAK_DURATION;
  const isCountdownPhase = phase === "countdown" || (phase === "break" && elapsed >= BREAK_DURATION);
  const countdownValue = Math.max(0, TOTAL - elapsed);

  // Cycle through movement prompts every 10 seconds during break phase
  useEffect(() => {
    if (phase === "break" && elapsed < BREAK_DURATION) {
      const promptIndex = Math.floor(elapsed / 10) % MOVEMENT_PROMPTS.length;
      setActivePrompt(promptIndex);
    }
  }, [elapsed, phase]);

  // Main timer — only runs during break phase
  useEffect(() => {
    if (phase !== "break" && phase !== "countdown") return;
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
  }, [phase, completed, TOTAL]);

  // Transition from break to countdown
  useEffect(() => {
    if (phase === "break" && elapsed >= BREAK_DURATION) {
      setPhase("countdown");
    }
  }, [elapsed, phase]);

  // Auto-complete when timer finishes
  useEffect(() => {
    if (completed) {
      const timeout = setTimeout(onComplete, 1000);
      return () => clearTimeout(timeout);
    }
  }, [completed, onComplete]);

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotion(emotionId);
    setShowResponse(true);
  };

  const handleStartBreak = () => {
    setPhase("break");
  };

  const breakProgress = Math.min((elapsed / BREAK_DURATION) * 100, 100);
  const message = RETURN_MESSAGES[messageIndex];
  const selectedEmotionData = EMOTIONAL_STATES.find((e) => e.id === selectedEmotion);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#04080f] flex flex-col items-center justify-center overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Top label */}
      <div className="absolute top-8 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-border rounded-full">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-foreground/50 text-xs font-medium tracking-widest uppercase">
            Performance Reset
          </span>
        </div>
      </div>

      {/* ── Phase 1: Emotional Check-In ──────────────────────────────────── */}
      {phase === "checkin" && (
        <div className="flex flex-col items-center text-center space-y-8 px-6 max-w-xl w-full">
          <div className="space-y-3">
            <p className="text-foreground/30 text-sm font-medium uppercase tracking-widest">
              20 minutes of focused learning
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
              How are you feeling<br />
              <span className="text-cyan-400">right now?</span>
            </h1>
            <p className="text-foreground/40 text-sm max-w-sm mx-auto">
              Your mentor wants to know. Be honest — this shapes your break.
            </p>
          </div>

          {!showResponse ? (
            <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
              {EMOTIONAL_STATES.map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => handleEmotionSelect(emotion.id)}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-border hover:border-cyan-500/40 rounded-2xl transition-all duration-200 group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                    {emotion.icon}
                  </span>
                  <span className="text-foreground/60 text-xs font-medium">{emotion.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="w-full max-w-lg space-y-6">
              {/* Mentor response */}
              <div className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 text-left space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedEmotionData?.icon}</span>
                  <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wide">
                    Your Mentor Says
                  </span>
                </div>
                <p className="text-foreground/80 text-base leading-relaxed">
                  {selectedEmotionData?.response}
                </p>
              </div>

              <button
                onClick={handleStartBreak}
                className="w-full py-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/60 rounded-2xl text-cyan-300 font-bold text-base transition-all duration-200"
              >
                Start my 60-second reset →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Phase 2: Break ───────────────────────────────────────────────── */}
      {phase === "break" && elapsed < BREAK_DURATION && (
        <div className="flex flex-col items-center text-center space-y-10 px-6 max-w-lg">
          <div className="space-y-2">
            <p className="text-foreground/30 text-sm font-medium uppercase tracking-widest">
              Take 60 seconds
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
              Reset your body.<br />
              <span className="text-cyan-400">Reset your mind.</span>
            </h1>
          </div>

          {/* Active movement prompt */}
          <div className="w-full bg-white/5 border border-border rounded-2xl p-8 space-y-3">
            <span className="text-5xl">{MOVEMENT_PROMPTS[activePrompt].icon}</span>
            <p className="text-2xl font-bold text-foreground">
              {MOVEMENT_PROMPTS[activePrompt].text}
            </p>
            <p className="text-foreground/40 text-sm">{MOVEMENT_PROMPTS[activePrompt].sub}</p>
          </div>

          {/* Prompt progress dots */}
          <div className="flex items-center gap-3">
            {MOVEMENT_PROMPTS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i === activePrompt ? "bg-cyan-400 scale-125" : "bg-white/20"
                )}
              />
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
            <div className="flex justify-between text-xs text-foreground/25">
              <span>Reset in progress</span>
              <span>{BREAK_DURATION - elapsed}s remaining</span>
            </div>
          </div>

          <p className="text-foreground/30 text-sm italic max-w-sm">
            Your body affects your mind. Reset now so you can return stronger.
          </p>
        </div>
      )}

      {/* ── Phase 3: Countdown ───────────────────────────────────────────── */}
      {(phase === "countdown" || (phase === "break" && elapsed >= BREAK_DURATION)) && (
        <div className="flex flex-col items-center text-center space-y-8 px-6">
          <div className="space-y-2">
            <p className="text-cyan-400 text-xl font-bold">{message.headline}</p>
            <p className="text-foreground/50 text-sm max-w-xs mx-auto">{message.sub}</p>
            <p className="text-foreground/30 text-xs mt-2">{message.cta}</p>
          </div>

          {/* Big countdown number */}
          <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-2 border-cyan-500/30">
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
                "text-7xl font-black text-foreground tabular-nums transition-all duration-300",
                countdownValue <= 3 && "text-cyan-400 scale-110"
              )}
            >
              {completed ? "✓" : countdownValue}
            </span>
          </div>

          {completed ? (
            <p className="text-2xl font-black text-cyan-400 animate-pulse">
              Let's go. You've got this.
            </p>
          ) : (
            <p className="text-foreground/30 text-sm">
              Prepare to focus. Your next session begins now.
            </p>
          )}
        </div>
      )}

      {/* Bottom controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
        {phase !== "checkin" && (
          <button
            onClick={onComplete}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-border rounded-xl text-foreground/40 hover:text-foreground/70 text-sm transition-all"
          >
            Continue early
          </button>
        )}
        {skipsRemaining > 0 && (
          <button
            onClick={onSkip}
            className="px-5 py-2.5 text-foreground/20 hover:text-foreground/40 text-sm transition-all"
          >
            Skip ({skipsRemaining} remaining today)
          </button>
        )}
      </div>
    </div>
  );
}

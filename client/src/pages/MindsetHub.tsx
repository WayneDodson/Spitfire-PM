/**
 * Mindset Hub — PM Simulate
 *
 * This is not a content page. It is an identity transformation page.
 * The goal: move users from "I'm trying to study PM" to "I live like someone
 * preparing for leadership."
 *
 * Sections:
 * 1. Core Mindset Message — the daily behaviour challenge
 * 2. Social Feed Awareness — intentional digital environment design
 * 3. 20-Minute Reset System — performance habit introduction
 * 4. Habit Reinforcement — consistency over motivation
 * 5. Identity Shift — language that changes self-concept
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Zap,
  Droplets,
  Target,
  TrendingUp,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  Flame,
  Eye,
  Shield,
  Clock,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Identity Affirmations ────────────────────────────────────────────────────

const IDENTITY_STATEMENTS = [
  {
    quote: "High performers do not wait for motivation. They create systems.",
    attribution: "Performance Psychology",
  },
  {
    quote: "Future employers hire evidence, not intention. Every session is proof.",
    attribution: "Career Transition Principle",
  },
  {
    quote: "Discipline creates confidence. Confidence comes from repetition.",
    attribution: "Habit Science",
  },
  {
    quote: "Career change does not happen by accident. It happens through repeated daily action.",
    attribution: "PM Simulate Core Belief",
  },
  {
    quote: "Project Managers solve problems before they become excuses.",
    attribution: "Leadership Mindset",
  },
  {
    quote: "Your attention shapes your future. Protect it like a professional.",
    attribution: "Focus Discipline",
  },
];

// ─── Social Feed Actions ──────────────────────────────────────────────────────

const FEED_ACTIONS = [
  {
    icon: "🔇",
    action: "Mute or unfollow 3 accounts that consume your attention without adding value",
    impact: "Reduces cognitive noise by up to 40%",
  },
  {
    icon: "✅",
    action: "Follow 5 Project Management professionals or PM thought leaders today",
    impact: "Your feed starts reflecting your future",
  },
  {
    icon: "📌",
    action: "Save one PM insight, article, or case study per day",
    impact: "Builds a personal knowledge library over time",
  },
  {
    icon: "🔕",
    action: "Set a 30-minute daily limit on passive social scrolling",
    impact: "Reclaims 3.5 hours per week for your transition",
  },
  {
    icon: "🎯",
    action: "Search: 'Project Management career change' and follow those stories",
    impact: "Normalises your journey and builds community",
  },
];

// ─── Habit Pillars ────────────────────────────────────────────────────────────

const HABIT_PILLARS = [
  {
    icon: Clock,
    title: "Consistency over intensity",
    body: "20 focused minutes daily outperforms 3-hour weekend sessions. Your brain learns through repetition, not volume.",
    colour: "cyan",
  },
  {
    icon: Target,
    title: "Progress over perfection",
    body: "A completed lesson with 70% understanding beats a lesson abandoned at 95% comprehension. Move forward.",
    colour: "blue",
  },
  {
    icon: Flame,
    title: "Execution over theory",
    body: "Reading about PM does not make you a PM. Running simulations, making decisions, and receiving feedback does.",
    colour: "orange",
  },
  {
    icon: Shield,
    title: "Environment over willpower",
    body: "Willpower depletes. Environment does not. Design your study space, your feeds, and your schedule to support your goal.",
    colour: "purple",
  },
];

// ─── Daily Checklist ─────────────────────────────────────────────────────────

const DAILY_HABITS = [
  "Complete at least one lesson or simulation today",
  "Drink water before your first study session",
  "Stand and reset after every 20 minutes of focus",
  "Review one PM concept from yesterday before starting today",
  "Spend 5 minutes on a PM-related article, podcast, or post",
  "Write one thing you learned today — even one sentence",
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function MindsetHub() {
  const [, navigate] = useLocation();
  const [checkedHabits, setCheckedHabits] = useState<Set<number>>(new Set());
  const [activeQuote, setActiveQuote] = useState(0);

  const toggleHabit = (index: number) => {
    setCheckedHabits((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const nextQuote = () => {
    setActiveQuote((prev) => (prev + 1) % IDENTITY_STATEMENTS.length);
  };

  const completedCount = checkedHabits.size;
  const totalHabits = DAILY_HABITS.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-foreground/40 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
                <Brain className="h-3.5 w-3.5 text-foreground" />
              </div>
              <span className="font-bold text-base">Mindset Hub</span>
            </div>
          </div>
          <span className="text-xs text-foreground/30 hidden sm:block">
            Identity · Discipline · Focus · Consistency
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-medium">
            <Brain className="h-4 w-4" />
            Performance Psychology
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight">
            This platform does not just<br />
            <span className="text-violet-400">teach Project Management.</span>
          </h1>
          <p className="text-xl text-foreground/50 max-w-2xl mx-auto leading-relaxed">
            It helps you become the type of person who successfully transitions into a PM career.
            That means changing habits, identity, focus, and daily behaviour — not just knowledge.
          </p>
        </section>

        {/* ── Core Challenge ───────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-violet-500/10 to-purple-900/20 border border-violet-500/20 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-black">
              Is your daily behaviour helping you become a Project Manager?
            </h2>
            <p className="text-foreground/60 text-lg leading-relaxed">
              Career change does not happen by accident. It happens through repeated action,
              focus, discipline, and intentional daily choices.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Endless social media scrolling", blocks: true },
                { label: "Low-value content consumption", blocks: true },
                { label: "Passive entertainment loops", blocks: true },
                { label: "Inconsistent study habits", blocks: true },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 bg-red-500/5 border border-red-500/15 rounded-xl p-4"
                >
                  <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  <span className="text-foreground/60 text-sm">{item.label}</span>
                </div>
              ))}
            </div>
            <p className="text-foreground/80 font-semibold text-lg">
              These are not character flaws. They are environmental defaults.
              <span className="text-violet-400"> You can redesign your environment.</span>
            </p>
          </div>
        </section>

        {/* ── Identity Affirmation Rotator ─────────────────────────────────── */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl font-black text-foreground/90">Your Daily Affirmation</h2>
          <div className="relative bg-card border border-border rounded-2xl p-10 max-w-2xl mx-auto">
            <div className="absolute top-4 right-4 text-foreground/20">
              <Star className="h-5 w-5" />
            </div>
            <blockquote className="text-xl md:text-2xl font-bold text-foreground leading-relaxed mb-4">
              "{IDENTITY_STATEMENTS[activeQuote].quote}"
            </blockquote>
            <p className="text-violet-400 text-sm font-medium tracking-widest uppercase">
              {IDENTITY_STATEMENTS[activeQuote].attribution}
            </p>
          </div>
          <Button
            onClick={nextQuote}
            variant="outline"
            className="border-border text-foreground/50 hover:text-white bg-transparent gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Next affirmation
          </Button>
        </section>

        {/* ── Social Feed Awareness ─────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-2xl font-black">Social Feed Awareness</h2>
            </div>
            <p className="text-foreground/50 text-lg max-w-2xl">
              Your social media feeds train your mind. What you repeatedly consume becomes what
              you repeatedly think about. Your feed should support your future — not distract from it.
            </p>
          </div>

          <div className="grid gap-4">
            {FEED_ACTIONS.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-card border border-border rounded-xl p-5 hover:border-blue-500/20 transition-colors"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div className="space-y-1 flex-1">
                  <p className="text-foreground/80 font-medium">{item.action}</p>
                  <p className="text-blue-400/70 text-sm">{item.impact}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-foreground/20 flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>

          <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-6 text-center">
            <p className="text-foreground/70 text-lg italic">
              "Your future is often hidden inside your daily habits.
              <span className="text-blue-300"> What you repeatedly consume becomes what you repeatedly think about.</span>"
            </p>
          </div>
        </section>

        {/* ── 20-Minute Reset System ────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-black">20-Minute Energy Reset System</h2>
            </div>
            <p className="text-foreground/50 text-lg max-w-2xl">
              Every 20 minutes of focused learning, the platform triggers a 1-minute performance reset.
              This is not a distraction. It is a performance tool used by elite athletes, surgeons, and executives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🧠",
                title: "Improves retention",
                body: "Short breaks prevent cognitive saturation. Your brain consolidates information during micro-recovery.",
              },
              {
                icon: "🩸",
                title: "Improves blood flow",
                body: "Standing and moving for 60 seconds increases oxygen to the brain by up to 20%, sharpening focus.",
              },
              {
                icon: "🔄",
                title: "Resets posture & energy",
                body: "Prolonged sitting degrades posture and compresses breathing. A reset restores both within 60 seconds.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-6 space-y-3"
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-foreground/50 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-400/20 rounded-2xl p-8 text-center space-y-4">
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">
              When your reset timer triggers
            </p>
            <div className="space-y-2 text-foreground/80 text-lg">
              <p>Stand up.</p>
              <p>Shake your arms.</p>
              <p>Move your fingers.</p>
              <p>Reset your posture.</p>
              <p>Breathe deeply.</p>
            </div>
            <p className="text-foreground/50 italic">
              Your body affects your mind. Reset now so you can return stronger.
            </p>
          </div>
        </section>

        {/* ── Hydration System ─────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <Droplets className="h-5 w-5 text-sky-400" />
              </div>
              <h2 className="text-2xl font-black">60-Minute Hydration System</h2>
            </div>
            <p className="text-foreground/50 text-lg max-w-2xl">
              Every 60 minutes, the platform reminds you to hydrate. Not as a wellness prompt —
              as a performance habit. Dehydration reduces cognitive performance by up to 15%.
              High performers protect their energy.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { stat: "15%", label: "Cognitive decline from mild dehydration" },
              { stat: "60 min", label: "Optimal hydration reminder interval" },
              { stat: "2–3L", label: "Daily water target for sustained focus" },
              { stat: "1 glass", label: "Before every study session — non-negotiable" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-card border border-sky-500/10 rounded-xl p-5 flex items-center gap-4"
              >
                <span className="text-2xl font-black text-sky-400">{item.stat}</span>
                <span className="text-foreground/60 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Four Habit Pillars ────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-400" />
              </div>
              <h2 className="text-2xl font-black">The Four Pillars of Habit Change</h2>
            </div>
            <p className="text-foreground/50 text-lg max-w-2xl">
              Most people fail career transitions not because they lack intelligence — but because
              they rely on motivation instead of systems. These four pillars replace motivation with structure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {HABIT_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              const colours: Record<string, string> = {
                cyan: "from-cyan-500/10 to-cyan-900/10 border-cyan-500/15 text-cyan-400",
                blue: "from-blue-500/10 to-blue-900/10 border-blue-500/15 text-blue-400",
                orange: "from-orange-500/10 to-orange-900/10 border-orange-500/15 text-orange-400",
                purple: "from-purple-500/10 to-purple-900/10 border-purple-500/15 text-purple-400",
              };
              const colourClass = colours[pillar.colour] ?? colours.cyan;
              return (
                <div
                  key={i}
                  className={cn(
                    "bg-gradient-to-br border rounded-xl p-6 space-y-3",
                    colourClass
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <h3 className="font-bold text-foreground">{pillar.title}</h3>
                  </div>
                  <p className="text-foreground/60 text-sm leading-relaxed">{pillar.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Daily Habit Checklist ─────────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-black">Today's Performance Checklist</h2>
              <p className="text-foreground/40 text-sm">
                {completedCount} of {totalHabits} completed today
              </p>
            </div>
            {completedCount === totalHabits && (
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                <CheckCircle2 className="h-5 w-5" />
                Full day completed
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / totalHabits) * 100}%` }}
            />
          </div>

          <div className="space-y-3">
            {DAILY_HABITS.map((habit, i) => (
              <button
                key={i}
                onClick={() => toggleHabit(i)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200",
                  checkedHabits.has(i)
                    ? "bg-green-500/5 border-green-500/20 text-foreground/80"
                    : "bg-card border-border text-foreground/60 hover:border-border/60 hover:text-foreground/80"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    checkedHabits.has(i)
                      ? "bg-green-500 border-green-500"
                      : "border-border/70"
                  )}
                >
                  {checkedHabits.has(i) && (
                    <CheckCircle2 className="h-3 w-3 text-foreground" />
                  )}
                </div>
                <span className={cn("text-sm font-medium", checkedHabits.has(i) && "line-through opacity-60")}>
                  {habit}
                </span>
              </button>
            ))}
          </div>

          <p className="text-foreground/30 text-xs text-center">
            This checklist resets daily. Consistency — not perfection — is the goal.
          </p>
        </section>

        {/* ── Identity Shift CTA ────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-violet-500/15 to-purple-900/20 border border-violet-500/20 rounded-2xl p-10 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-black">
            You are not trying to study PM.
          </h2>
          <p className="text-xl text-violet-300 font-bold">
            You are living like someone preparing for leadership.
          </p>
          <p className="text-foreground/50 max-w-xl mx-auto">
            Every session, every reset, every glass of water, every lesson completed —
            is evidence. Evidence that you are already becoming the person who gets the job.
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-violet-600 hover:bg-violet-500 text-foreground font-bold px-8 py-3 rounded-xl gap-2"
          >
            Return to your journey
            <ChevronRight className="h-4 w-4" />
          </Button>
        </section>

      </div>
    </div>
  );
}

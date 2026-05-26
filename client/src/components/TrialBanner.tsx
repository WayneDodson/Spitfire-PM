/**
 * TrialBanner — shown to users during their 7-day free trial.
 *
 * Displays:
 * - Day X of 7 progress
 * - Engagement dots (active days)
 * - Loyalty Access progress bar
 * - Motivational copy that shifts based on progress
 * - CTA to upgrade when trial expires
 */

import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Flame, Star, Lock, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MOTIVATIONAL_COPY = [
  "Day 1 — you've made the decision. Most people never do.",
  "Day 2 — you're already ahead of 80% of career changers.",
  "Day 3 — momentum is building. Keep going.",
  "Day 4 — halfway there. You're proving you're serious.",
  "Day 5 — strong consistency. Loyalty Access is within reach.",
  "Day 6 — one more day. You're building proof, not just knowledge.",
  "Day 7 — final day. You've earned this.",
];

const FOUNDER_CLOSE_COPY = [
  "You're closer than you think.",
  "Most users stop here — keep going.",
  "Future employers want this thinking.",
  "You're proving you belong in this role.",
  "Strong decision. Don't stop now.",
];

export function TrialBanner() {
  const [, navigate] = useLocation();
  const { data: trial, isLoading } = trpc.trial.getStatus.useQuery(undefined, {
    refetchInterval: 60_000, // refresh every minute
  });

  if (isLoading || !trial) return null;

  // Don't show if trial hasn't started
  if (!trial.trialStartedAt) return null;

  // Don't show if trial is over and user has a subscription (handled elsewhere)
  if (trial.trialExpired && !trial.founderAccessEarned) {
    return (
      <div className="bg-gradient-to-r from-amber-950/80 to-orange-950/80 border-b border-amber-800/40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-200">
              Your 7-day free trial has ended.{" "}
              <span className="font-semibold">Continue your career transition journey</span> — choose the plan that fits your commitment.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => navigate("/subscribe")}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold flex-shrink-0 text-xs"
          >
            Continue Access
          </Button>
        </div>
      </div>
    );
  }

  // Don't show if trial is over and user earned Loyalty Access (they should upgrade)
  if (trial.trialExpired && trial.founderAccessEarned) {
    return (
      <div className="bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-b border-cyan-800/40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Star className="h-4 w-4 text-cyan-400 flex-shrink-0" />
            <p className="text-sm text-cyan-200">
              <span className="font-bold text-cyan-300">Loyalty Access Unlocked.</span>{" "}
              Your consistency earned you £19/month — lock it in before this offer expires.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => navigate("/subscribe")}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex-shrink-0 text-xs"
          >
            Claim Loyalty Access
          </Button>
        </div>
      </div>
    );
  }

  // Active trial — show progress
  if (!trial.trialActive) return null;

  const dayIndex = Math.max(0, trial.dayNumber - 1);
  const motivationalCopy = MOTIVATIONAL_COPY[Math.min(dayIndex, MOTIVATIONAL_COPY.length - 1)];
  const founderCloseIdx = Math.floor(Math.random() * FOUNDER_CLOSE_COPY.length);
  const isNearFounder = trial.founderProgress >= 60 && !trial.founderAccessEarned;
  const founderEarned = trial.founderAccessEarned;

  return (
    <div className={cn(
      "border-b transition-all",
      founderEarned
        ? "bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border-cyan-800/40"
        : "bg-gradient-to-r from-slate-900/80 to-slate-800/80 border-white/5"
    )}>
      <div className="max-w-6xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-4 flex-wrap">

          {/* Left: Day counter + dots */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Flame className={cn("h-4 w-4", founderEarned ? "text-cyan-400" : "text-orange-400")} />
              <span className={cn("text-sm font-bold", founderEarned ? "text-cyan-300" : "text-white")}>
                Day {trial.dayNumber} of 7
              </span>
            </div>

            {/* 7-day activity dots */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 7 }).map((_, i) => {
                const dayDate = trial.trialStartedAt
                  ? new Date(new Date(trial.trialStartedAt).getTime() + i * 24 * 60 * 60 * 1000)
                  : null;
                const dayStr = dayDate?.toISOString().slice(0, 10);
                const isActive = trial.engagementRows.some((r) => r.date === dayStr);
                const isPast = i < trial.dayNumber - 1;
                const isToday = i === trial.dayNumber - 1;

                return (
                  <div
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      isActive
                        ? founderEarned
                          ? "bg-cyan-400"
                          : "bg-orange-400"
                        : isPast
                          ? "bg-white/15"
                          : isToday
                            ? "bg-white/30 ring-1 ring-white/40"
                            : "bg-white/8"
                    )}
                    title={`Day ${i + 1}${isActive ? " — active" : isPast ? " — missed" : ""}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Centre: Motivational copy or Founder status */}
          <div className="hidden sm:block flex-1 text-center">
            {founderEarned ? (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-300">
                  Commitment Reward Activated — Loyalty Access Earned
                </span>
              </div>
            ) : isNearFounder ? (
              <span className="text-xs text-white/50">
                {FOUNDER_CLOSE_COPY[founderCloseIdx]}
              </span>
            ) : (
              <span className="text-xs text-white/40">{motivationalCopy}</span>
            )}
          </div>

          {/* Right: Loyalty progress or days remaining */}
          <div className="flex items-center gap-3">
            {!founderEarned && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs text-white/30">Loyalty Access</span>
                <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-700"
                    style={{ width: `${trial.founderProgress}%` }}
                  />
                </div>
                <span className="text-xs text-white/40">{trial.founderProgress}%</span>
              </div>
            )}

            {trial.daysRemaining > 0 && (
              <span className="text-xs text-white/30">
                {trial.daysRemaining} day{trial.daysRemaining !== 1 ? "s" : ""} free remaining
              </span>
            )}

            {founderEarned && (
              <Button
                size="sm"
                onClick={() => navigate("/subscribe")}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs h-7 px-3"
              >
                <Zap className="h-3 w-3 mr-1" />
                Claim £19/mo
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * TrialBanner — shown to users during and after their 7-day free trial.
 *
 * States:
 * - Active trial: shows "X days left in your free trial" with progress dots and upgrade CTA
 * - Trial expired: shows locked banner with upgrade CTA
 * - Subscribed: hidden
 */

import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Flame, Lock, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TrialBanner() {
  const [, navigate] = useLocation();
  const { data: trial, isLoading } = trpc.trial.getStatus.useQuery(undefined, {
    refetchInterval: 60_000,
  });
  const { data: me } = trpc.auth.me.useQuery();

  if (isLoading || !trial) return null;

  // Admin users never see trial banners — they have unrestricted access
  if ((me as any)?.role === 'admin') return null;

  // Trial hasn't started yet (shouldn't happen after auth.me fix, but guard anyway)
  if (!trial.trialStartedAt) return null;

  // Trial expired — no subscription
  if (trial.trialExpired) {
    return (
      <div className="bg-gradient-to-r from-rose-950/90 to-orange-950/90 border-b border-rose-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-rose-400 flex-shrink-0" />
            <p className="text-sm text-rose-200">
              <span className="font-bold">Your 7-day free trial has ended.</span>{" "}
              Subscribe to continue your PM career transition journey.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => navigate("/subscribe")}
            className="bg-rose-500 hover:bg-rose-400 text-white font-bold flex-shrink-0 text-xs h-7 px-3"
          >
            Subscribe — £19.99/mo
            <ArrowRight className="ml-1.5 h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  // Active trial
  if (!trial.trialActive) return null;

  const urgencyColor =
    trial.daysRemaining <= 1
      ? "text-rose-400"
      : trial.daysRemaining <= 3
      ? "text-amber-400"
      : "text-cyan-400";

  const bannerBg =
    trial.daysRemaining <= 1
      ? "from-rose-950/80 to-orange-950/80 border-rose-800/40"
      : trial.daysRemaining <= 3
      ? "from-amber-950/80 to-orange-950/80 border-amber-800/40"
      : "from-slate-900/90 to-slate-800/90 border-border";

  return (
    <div className={cn("bg-gradient-to-r border-b transition-all", bannerBg)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4 flex-wrap">

          {/* Left: flame + days remaining */}
          <div className="flex items-center gap-3">
            <Flame className={cn("h-4 w-4 flex-shrink-0", urgencyColor)} />
            <div className="flex items-center gap-2">
              <span className={cn("text-sm font-bold", urgencyColor)}>
                {trial.daysRemaining === 0
                  ? "Last day of your free trial"
                  : trial.daysRemaining === 1
                  ? "1 day left in your free trial"
                  : `${trial.daysRemaining} days left in your free trial`}
              </span>
              <span className="text-foreground/30 text-xs hidden sm:inline">
                · Levels 1 &amp; 2 free · Levels 3–7 require subscription
              </span>
            </div>
          </div>

          {/* Centre: 7-dot progress */}
          <div className="hidden md:flex items-center gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => {
              const dayDate = trial.trialStartedAt
                ? new Date(new Date(trial.trialStartedAt).getTime() + i * 24 * 60 * 60 * 1000)
                : null;
              const dayStr = dayDate?.toISOString().slice(0, 10);
              const isActive = trial.engagementRows?.some((r: any) => r.date === dayStr);
              const isPast = i < trial.dayNumber - 1;
              const isToday = i === trial.dayNumber - 1;

              return (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    isActive
                      ? urgencyColor.replace("text-", "bg-")
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
            <span className="text-xs text-foreground/30 ml-1">Day {trial.dayNumber} of 7</span>
          </div>

          {/* Right: upgrade CTA */}
          <Button
            size="sm"
            onClick={() => navigate("/subscribe")}
            className={cn(
              "font-bold flex-shrink-0 text-xs h-7 px-3",
              trial.daysRemaining <= 3
                ? "bg-amber-500 hover:bg-amber-400 text-black"
                : "bg-cyan-500 hover:bg-cyan-400 text-black"
            )}
          >
            <Zap className="h-3 w-3 mr-1" />
            Unlock Full Access
          </Button>
        </div>
      </div>
    </div>
  );
}

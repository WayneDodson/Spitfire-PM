import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import ShareProgress from "@/components/ShareProgress";
import { BrandedLoader } from "@/components/BrandedLoader";
import {
  Share2,
  BookOpen,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Crown,
  Layers,
  LayoutDashboard,
  Lock,
  LogOut,
  TrendingUp,
  Users,
  Target,
  User,
  Zap,
  BarChart3,
  Flame,
  Star,
  ChevronRight,
  ArrowRight,
  Shield,
  Brain,
  Pencil,
  Award,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { XPProgressBar } from "@/components/XPProgressBar";
import { OnboardingModal } from "@/components/OnboardingModal";
import FullCurriculumCelebration from "@/components/FullCurriculumCelebration";

// Motivational messages keyed by progress milestones
const MOTIVATIONAL_MESSAGES = [
  { threshold: 0, msg: "You can do this. Every expert was once a beginner." },
  { threshold: 10, msg: "You've started. That already puts you ahead of most people." },
  { threshold: 25, msg: "You're building proof, not just knowledge." },
  { threshold: 40, msg: "30% of people never get this far — keep going." },
  { threshold: 55, msg: "Confidence comes from repetition. You're doing the reps." },
  { threshold: 70, msg: "Future employers want this thinking. You're developing it." },
  { threshold: 85, msg: "You're closer than you think. The finish line is in sight." },
  { threshold: 95, msg: "Almost there. You've earned the right to say: I know I can do this." },
];

function getMotivationalMessage(progress: number): string {
  const match = [...MOTIVATIONAL_MESSAGES].reverse().find((m) => progress >= m.threshold);
  return match?.msg ?? MOTIVATIONAL_MESSAGES[0].msg;
}

// Confidence score: composite of progress + completed levels
function getConfidenceScore(completedLevels: number, overallProgress: number): number {
  const base = completedLevels * 12;
  const progressBonus = overallProgress * 0.16;
  return Math.min(100, Math.round(base + progressBonus));
}

// Interview readiness: more demanding — needs at least 2 levels + 40% progress
function getReadinessScore(completedLevels: number, overallProgress: number): number {
  if (completedLevels === 0) return Math.round(overallProgress * 0.1);
  const base = completedLevels * 10;
  const bonus = overallProgress * 0.2;
  return Math.min(100, Math.round(base + bonus));
}

function ReadinessRing({ value, label, color }: { value: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-foreground">{value}</span>
        </div>
      </div>
      <span className="text-xs text-foreground/50 text-center leading-tight">{label}</span>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [copiedLink, setCopiedLink] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showFullCelebration, setShowFullCelebration] = useState(false);
  const fullCelebrationShownRef = useRef(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navTo = (path: string) => {
    setMobileMenuOpen(false);
    setLocation(path);
  };

  // Close mobile menu on outside click or scroll
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#dash-nav")) setMobileMenuOpen(false);
    };
    const handleScroll = () => setMobileMenuOpen(false);
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mobileMenuOpen]);

  const { data: levels } = trpc.levels.getAll.useQuery();
  const { data: levelProgress } = trpc.levels.getMyProgress.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: referralData } = trpc.referrals.getMyReferralCount.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: trialStatus } = trpc.trial.getStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: simStats } = trpc.simulations.stats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const userProgress = levelProgress?.progress;
  const referralCount = referralData?.count || 0;
  const hasActiveSubscription = levelProgress?.hasActiveSubscription || false;

  useEffect(() => {
    if (user && !user.displayName) {
      setShowOnboarding(true);
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("subscribed") === "true") {
      toast.success("Subscription activated! You now have access to all 7 levels.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const completedLevels = userProgress?.filter((p: any) => p.completed).length || 0;
  const totalLevels = 7;

  // Full curriculum completion: all 7 levels done + all Advanced simulations passed
  const advancedSimsCompleted = simStats?.byDifficulty?.advanced?.completed ?? 0;
  const advancedSimsTotal = simStats?.byDifficulty?.advanced?.total ?? 1;
  const allAdvancedPassed = advancedSimsTotal > 0 && advancedSimsCompleted >= advancedSimsTotal;
  const isFullyComplete = completedLevels >= totalLevels && allAdvancedPassed;

  useEffect(() => {
    if (isFullyComplete && !fullCelebrationShownRef.current) {
      fullCelebrationShownRef.current = true;
      // Small delay so the dashboard has rendered first
      setTimeout(() => setShowFullCelebration(true), 800);
    }
  }, [isFullyComplete]);
  const overallProgress = (completedLevels / totalLevels) * 100;

  const currentLevelProgress =
    userProgress?.find((p: any) => !p.completed) ||
    userProgress?.find((p: any) => p.completed) ||
    null;
  const currentLevelPercent = currentLevelProgress?.progressPercent || 0;

  const confidenceScore = useMemo(
    () => getConfidenceScore(completedLevels, overallProgress),
    [completedLevels, overallProgress]
  );
  const readinessScore = useMemo(
    () => getReadinessScore(completedLevels, overallProgress),
    [completedLevels, overallProgress]
  );
  const motivationalMsg = useMemo(
    () => getMotivationalMessage(overallProgress),
    [overallProgress]
  );

  const referralLink = user?.referralCode
    ? `${window.location.origin}/?ref=${user.referralCode}`
    : "";

  const copyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getLevelStatus = (level: any) => {
    const progress = userProgress?.find((p: any) => p.levelId === level.id);
    if (progress?.completed) return "completed";
    if (progress && !progress.completed) return "in_progress";
    // Admin users and founder access users bypass all level locks
    if (user?.role === "admin" || (user as any)?.founderAccessEarned) return "unlocked";
    // Trial expired — block all levels until subscription
    if (!hasActiveSubscription && trialStatus?.trialExpired) return "trial_expired";
    if (level.accessType === "free") return "unlocked";
    // referral type is no longer used — treat same as paid
    if (level.accessType === "referral") return hasActiveSubscription ? "unlocked" : "locked";
    if (level.accessType === "paid") return hasActiveSubscription ? "unlocked" : "locked";
    return "locked";
  };

  if (loading) {
    return <BrandedLoader />;
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  const firstName = (user?.displayName || user?.name || "there").split(" ")[0];

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header id="dash-nav" className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
          {/* Main header row */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Target className="h-3.5 w-3.5 text-foreground" />
              </div>
              <span className="font-bold text-base">Spitfire PM</span>
            </div>

            {/* Desktop nav — hidden below lg */}
            <nav className="hidden lg:flex gap-1 flex-1 justify-center">
              <Button variant="ghost" size="sm" onClick={() => setLocation("/simulations")} className="text-amber-400/70 hover:text-amber-300">
                <Zap className="h-4 w-4 mr-1.5" />Simulations
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setLocation("/one-to-one-coaching")} className="text-amber-300/80 hover:text-amber-200">
                <Users className="h-4 w-4 mr-1.5" />Coaching
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setLocation("/achievements")} className="text-foreground/60 hover:text-white">
                <Award className="h-4 w-4 mr-1.5" />Achievements
              </Button>
              {user?.role === "admin" && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setLocation("/admin/cancellations")} className="text-rose-400/70 hover:text-rose-300">
                    <Shield className="h-4 w-4 mr-1.5" />Admin
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setLocation("/admin/questions")} className="text-amber-400/70 hover:text-amber-300">
                    <Pencil className="h-4 w-4 mr-1.5" />Questions
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={() => setLocation("/mindset")} className="text-purple-400/70 hover:text-purple-300">
                <Brain className="h-4 w-4 mr-1.5" />Mindset
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setLocation("/glossary")} className="text-foreground/60 hover:text-white">
                <BookOpen className="h-4 w-4 mr-1.5" />Glossary
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setLocation("/frameworks")} className="text-foreground/60 hover:text-white">
                <Layers className="h-4 w-4 mr-1.5" />Frameworks
              </Button>
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <ThemeToggle />
              {/* Name + email — desktop only */}
              <button
                onClick={() => setLocation("/profile")}
                className="text-sm text-right hidden lg:block hover:opacity-80 transition-opacity cursor-pointer"
              >
                <p className="font-medium text-foreground">{user?.displayName || user?.name}</p>
                <p className="text-foreground/40 text-xs">{user?.email}</p>
              </button>
              <Button variant="ghost" size="sm" onClick={() => setLocation("/profile")} className="text-foreground/40 hover:text-white" title="My Profile">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => logout()} className="text-foreground/40 hover:text-white" title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
              {/* Burger — visible below lg */}
              <button
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-border text-foreground/60 hover:text-white hover:border-cyan-400/40 transition-colors"
                onClick={() => setMobileMenuOpen(v => !v)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile / tablet dropdown — animated slide-down */}
          <div
            className="lg:hidden overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out"
            style={{
              display: "grid",
              gridTemplateRows: mobileMenuOpen ? "1fr" : "0fr",
              opacity: mobileMenuOpen ? 1 : 0,
            }}
            aria-hidden={!mobileMenuOpen}
          >
            <div className="min-h-0">
              <div className="border-t border-border px-4 py-3 flex flex-col gap-1 bg-background/95">
                <button onClick={() => navTo("/dashboard")} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-cyan-400/90 hover:text-cyan-300 hover:bg-white/5 transition-colors text-left">
                  <LayoutDashboard className="h-4 w-4 shrink-0" />Dashboard
                </button>
                <div className="border-t border-border/30 my-1" />
                <button onClick={() => navTo("/simulations")} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-amber-400/80 hover:text-amber-300 hover:bg-white/5 transition-colors text-left">
                  <Zap className="h-4 w-4 shrink-0" />Simulations
                </button>
                <button onClick={() => navTo("/one-to-one-coaching")} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-amber-300/90 hover:text-amber-200 hover:bg-white/5 transition-colors text-left">
                  <Users className="h-4 w-4 shrink-0" />Coaching
                </button>
                <button onClick={() => navTo("/achievements")} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-white hover:bg-white/5 transition-colors text-left">
                  <Award className="h-4 w-4 shrink-0" />Achievements
                </button>
                <button onClick={() => navTo("/mindset")} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-purple-400/80 hover:text-purple-300 hover:bg-white/5 transition-colors text-left">
                  <Brain className="h-4 w-4 shrink-0" />Mindset
                </button>
                <button onClick={() => navTo("/glossary")} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-white hover:bg-white/5 transition-colors text-left">
                  <BookOpen className="h-4 w-4 shrink-0" />Glossary
                </button>
                <button onClick={() => navTo("/frameworks")} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-white hover:bg-white/5 transition-colors text-left">
                  <Layers className="h-4 w-4 shrink-0" />Frameworks
                </button>
                {user?.role === "admin" && (
                  <>
                    <div className="border-t border-border/40 my-1" />
                    <button onClick={() => navTo("/admin/cancellations")} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-rose-400/80 hover:text-rose-300 hover:bg-white/5 transition-colors text-left">
                      <Shield className="h-4 w-4 shrink-0" />Admin
                    </button>
                    <button onClick={() => navTo("/admin/questions")} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-amber-400/80 hover:text-amber-300 hover:bg-white/5 transition-colors text-left">
                      <Pencil className="h-4 w-4 shrink-0" />Questions
                    </button>
                    <button onClick={() => navTo("/admin/coaching")} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-emerald-400/80 hover:text-emerald-300 hover:bg-white/5 transition-colors text-left">
                      <Users className="h-4 w-4 shrink-0" />Coaching Admin
                    </button>
                  </>
                )}
                <div className="border-t border-border/40 my-1" />
                <button onClick={() => navTo("/profile")} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-white hover:bg-white/5 transition-colors text-left">
                  <User className="h-4 w-4 shrink-0" />
                  <span className="truncate">{user?.displayName || user?.name}</span>
                  <span className="text-foreground/40 text-xs ml-auto truncate hidden sm:block">{user?.email}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Welcome + Motivational banner */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-400/20 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-1">
                  Welcome back
                </p>
                <h2 className="text-3xl font-black mb-2">
                  {firstName}
                  {completedLevels > 0 ? ` — you're building proof.` : ` — let's start building proof.`}
                </h2>
                <p className="text-foreground/60 italic text-sm">"{motivationalMsg}"</p>
              </div>
              <div className="flex-shrink-0">
                <XPProgressBar />
              </div>
            </div>
          </div>

          {/* Readiness + Confidence rings */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Confidence Score */}
            <div className="bg-muted/60 border border-border rounded-2xl p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-xs text-foreground/40 uppercase tracking-widest mb-1">Confidence Score</p>
                  <h3 className="text-lg font-bold">How ready do you feel?</h3>
                  <p className="text-foreground/50 text-sm mt-1">
                    Built from your simulation performance and progress.
                  </p>
                </div>
                <BarChart3 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-6">
                <ReadinessRing value={confidenceScore} label="Confidence" color="#22d3ee" />
                <div className="flex-1">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/50">Levels completed</span>
                      <span className="text-foreground font-medium">{completedLevels} / {totalLevels}</span>
                    </div>
                    <Progress value={overallProgress} className="h-1.5 bg-white/10" />
                    <p className="text-xs text-foreground/30">
                      {confidenceScore < 40
                        ? "Keep going — confidence builds with every scenario."
                        : confidenceScore < 70
                        ? "You're developing real PM thinking. Keep the momentum."
                        : "Strong confidence. You're ready to start performing."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interview Readiness */}
            <div className="bg-muted/60 border border-border rounded-2xl p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-xs text-foreground/40 uppercase tracking-widest mb-1">Interview Readiness</p>
                  <h3 className="text-lg font-bold">Before you walk into the room…</h3>
                  <p className="text-foreground/50 text-sm mt-1">
                    Know exactly how prepared you are before the interview.
                  </p>
                </div>
                <Target className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-6">
                <ReadinessRing
                  value={readinessScore}
                  label="Readiness"
                  color={readinessScore >= 70 ? "#4ade80" : readinessScore >= 40 ? "#facc15" : "#f87171"}
                />
                <div className="flex-1 space-y-2">
                  {[
                    { label: "Scenario experience", done: completedLevels >= 1 },
                    { label: "Stakeholder practice", done: completedLevels >= 2 },
                    { label: "Risk & change control", done: completedLevels >= 3 },
                    { label: "Full PM simulation", done: completedLevels >= 5 },
                  ].map(({ label, done }) => (
                    <div key={label} className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          done ? "bg-green-500/20" : "bg-white/5"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="h-3 w-3 text-green-400" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        )}
                      </div>
                      <span className={done ? "text-foreground/70" : "text-foreground/30"}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/60 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                <p className="text-xs text-foreground/40 uppercase tracking-widest">Current Level</p>
              </div>
              <p className="text-2xl font-black">{Math.round(currentLevelPercent)}%</p>
              <Progress value={currentLevelPercent} className="mt-2 h-1 bg-white/10" />
              <p className="text-xs text-foreground/30 mt-1.5">
                {currentLevelProgress
                  ? `Level ${levels?.find((l: any) => l.id === currentLevelProgress.levelId)?.orderIndex || 1} progress`
                  : "Start your first level"}
              </p>
            </div>

            <div className="bg-muted/60 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-orange-400" />
                <p className="text-xs text-foreground/40 uppercase tracking-widest">Momentum</p>
              </div>
              <p className="text-2xl font-black">{completedLevels > 0 ? `${completedLevels}` : "0"}</p>
              <p className="text-xs text-foreground/30 mt-1.5">
                {completedLevels === 0
                  ? "Complete your first level"
                  : completedLevels === 1
                  ? "Level completed — keep it up!"
                  : `${completedLevels} levels done — strong momentum`}
              </p>
            </div>

            <div className="bg-muted/60 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <p className="text-xs text-foreground/40 uppercase tracking-widest">Time Invested</p>
              </div>
              <p className="text-2xl font-black">{completedLevels * 6}h</p>
              <p className="text-xs text-foreground/30 mt-1.5">
                {42 - completedLevels * 6}h to full readiness
              </p>
            </div>

            <div className="bg-muted/60 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-purple-400" />
                <p className="text-xs text-foreground/40 uppercase tracking-widest">Access</p>
              </div>
              <p className="text-2xl font-black">{hasActiveSubscription ? "Pro" : "Free"}</p>
              <p className="text-xs text-foreground/30 mt-1.5">
                {hasActiveSubscription ? "All 7 levels unlocked" : "Upgrade for Levels 3–7"}
              </p>
            </div>
          </div>

          {/* Trial progress card — shown during trial period */}
          {trialStatus && !trialStatus.trialExpired && !hasActiveSubscription && (
            <div className={`rounded-2xl p-6 border ${
              trialStatus.founderAccessEarned
                ? 'bg-cyan-950/30 border-cyan-500/40'
                : 'bg-muted/50 border-border'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    trialStatus.founderAccessEarned ? 'bg-cyan-400/20' : 'bg-white/5'
                  }`}>
                    {trialStatus.founderAccessEarned
                      ? <Star className="h-5 w-5 text-cyan-400" />
                      : <Flame className="h-5 w-5 text-orange-400" />}
                  </div>
                  <div className="flex-1">
                    {trialStatus.founderAccessEarned ? (
                      <>
                        <h3 className="font-black text-lg text-cyan-400 mb-1">Loyalty Access Earned</h3>
                        <p className="text-foreground/60 text-sm">
                          Your consistency during the free trial unlocked PM Readiness Member Pricing at £19/month.
                          Claim it before your trial ends.
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-bold text-lg mb-1">
                          Day {trialStatus.dayNumber} of 7 — Free Trial
                        </h3>
                        <p className="text-foreground/50 text-sm">
                          Log in consistently and complete lessons to earn Loyalty Access at £19/month.
                          {trialStatus.activeDays >= 3
                            ? " You're building a strong streak — keep going."
                            : " Consistency is what separates people who get hired from people who don't."}
                        </p>
                        <div className="flex gap-1.5 mt-3">
                          {Array.from({ length: 7 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full ${
                                i < trialStatus.activeDays
                                  ? 'bg-cyan-400'
                                  : i === trialStatus.activeDays
                                  ? 'bg-cyan-400/30'
                                  : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-foreground/30 mt-1.5">
                          {trialStatus.activeDays} of 7 days active
                          {trialStatus.activeDays >= 5 ? ' — Loyalty Access threshold reached!' : ` — ${5 - trialStatus.activeDays} more days needed for Loyalty Access`}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {trialStatus.founderAccessEarned ? (
                    <Button
                      onClick={() => setLocation('/subscribe?tier=founder')}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black font-black whitespace-nowrap"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Claim Loyalty Access
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setLocation('/subscribe')}
                      className="border-border/70 text-foreground/60 hover:text-white bg-transparent whitespace-nowrap"
                    >
                      View Plans
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Referral section */}
          {!hasActiveSubscription && user?.role !== "admin" && !(user as any)?.founderAccessEarned && (
            <div className="bg-gradient-to-r from-cyan-500/5 to-blue-600/5 border border-cyan-400/20 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cyan-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Share2 className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Unlock Level 3 — free</h3>
                    <p className="text-foreground/50 text-sm">
                      Share your link with one person making a career change. When they sign up, Level 3 unlocks for you — no payment needed.
                    </p>
                    <p className="text-xs text-foreground/30 mt-1.5">
                      You've referred {referralCount} {referralCount === 1 ? "person" : "people"} so far
                      {referralCount >= 1 ? " — Level 3 is unlocked!" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 flex-shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="w-56 px-3 py-2 bg-white/5 border border-border rounded-lg text-sm text-foreground/60 font-mono"
                    />
                    <Button
                      onClick={copyReferralLink}
                      variant="outline"
                      className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/5"
                    >
                      {copiedLink ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <ShareProgress
                    achievement="Unlock Level 3 free on Spitfire PM — just share your referral link!"
                    compact={false}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Levels grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black">Your Simulation Path</h3>
                <p className="text-foreground/40 text-sm mt-0.5">
                  Each level builds the proof you need to get hired.
                </p>
              </div>
              {!hasActiveSubscription && completedLevels >= 1 && user?.role !== "admin" && !(user as any)?.founderAccessEarned && (
                <Button
                  onClick={() => setLocation("/subscribe")}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold gap-2"
                >
                  <Crown className="h-4 w-4" />
                  Unlock All Levels — £20/month
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
               {levels?.map((level: any) => {
                const status = getLevelStatus(level);
                const progress = userProgress?.find((p: any) => p.levelId === level.id);
                const isLocked = status === "locked";
                const isTrialExpired = status === "trial_expired";
                const isCompleted = status === "completed";
                const isInProgress = status === "in_progress";
                const isAnyLocked = isLocked || isTrialExpired;
                return (
                  <div
                    key={level.id}
                    className={`relative bg-card border rounded-2xl p-6 transition-all ${
                      isTrialExpired
                        ? "border-amber-500/20 opacity-70"
                        : isLocked
                        ? "border-border opacity-50"
                        : isCompleted
                        ? "border-green-500/30 bg-green-500/5"
                        : isInProgress
                        ? "border-cyan-400/30"
                        : "border-border hover:border-cyan-400/20"
                    }`}
                  >
                    {/* Status badge */}
                    <div className="absolute top-4 right-4">
                      {isTrialExpired ? (
                        <Crown className="h-5 w-5 text-amber-500/60" />
                      ) : isLocked ? (
                        <Lock className="h-5 w-5 text-foreground/20" />
                      ) : isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : isInProgress ? (
                        <Zap className="h-5 w-5 text-cyan-400" />
                      ) : (
                        <Star className="h-5 w-5 text-foreground/20" />
                      )}
                    </div>

                    <p className="text-xs text-foreground/30 uppercase tracking-widest mb-1">
                      Level {level.orderIndex}
                    </p>
                    <h4 className="font-bold text-lg mb-2 pr-6">{level.title}</h4>
                    <p className="text-foreground/50 text-sm leading-relaxed mb-4 line-clamp-2">
                      {level.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-foreground/30 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {level.estimatedHours}h
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" />
                        {level.accessType === "free"
                          ? "Free"
                          : level.accessType === "referral"
                          ? "1 Referral"
                          : "Pro"}
                      </div>
                    </div>

                    {isInProgress && progress && (
                      <div className="mb-4 space-y-1.5">
                        <div className="flex justify-between text-xs text-foreground/40">
                          <span>Progress</span>
                          <span>{progress.progressPercent}%</span>
                        </div>
                        <Progress value={progress.progressPercent} className="h-1.5 bg-white/10" />
                      </div>
                    )}

                    <Button
                      className={`w-full font-semibold ${
                        isTrialExpired
                          ? "bg-amber-500 hover:bg-amber-400 text-black"
                          : isLocked
                          ? "bg-white/5 text-foreground/20 cursor-not-allowed"
                          : isCompleted
                          ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                          : "bg-cyan-500 hover:bg-cyan-400 text-black"
                      }`}
                      disabled={isLocked}
                      onClick={() => {
                        if (isTrialExpired) {
                          setLocation("/subscribe");
                        } else if (isLocked) {
                          if (level.accessType === "referral") {
                            toast.info("Refer 1 friend to unlock this level — it's completely free!");
                          } else {
                            setLocation("/subscribe");
                          }
                        } else {
                          setLocation(`/level/${level.id}`);
                        }
                      }}
                    >
                      {isTrialExpired ? (
                        <>
                          <Crown className="h-4 w-4 mr-2" />
                          Subscribe to Continue
                        </>
                      ) : isLocked ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          {level.accessType === "referral" ? "Refer to Unlock" : "Upgrade to Unlock"}
                        </>
                      ) : isCompleted ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Review Level
                        </>
                      ) : isInProgress ? (
                        <>
                          Continue
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </>
                      ) : (
                        <>
                          Start Level
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Qualification Prep */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black">Qualification Prep</h3>
                <p className="text-foreground/40 text-sm mt-0.5">
                  Study for APM PFQ and PMQ with full module content and practice quizzes.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setLocation("/qualification-prep")}
                className="border-border/70 text-foreground/60 hover:text-white bg-transparent"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div
                className="bg-emerald-500/[0.05] border border-emerald-500/20 rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:border-emerald-400/40 transition-colors"
                onClick={() => setLocation("/qualification-prep/pfq")}
              >
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-emerald-200">PFQ — Project Fundamentals</p>
                  <p className="text-foreground/40 text-sm">Foundation level · 4 modules · ~12 hours</p>
                </div>
                <ChevronRight className="h-4 w-4 text-emerald-400/40 ml-auto" />
              </div>
              <div
                className="bg-blue-500/[0.05] border border-blue-500/20 rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:border-blue-400/40 transition-colors"
                onClick={() => setLocation("/qualification-prep/pmq")}
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-blue-200">PMQ — Project Management</p>
                  <p className="text-foreground/40 text-sm">Practitioner level · 4 modules · ~20 hours</p>
                </div>
                <ChevronRight className="h-4 w-4 text-blue-400/40 ml-auto" />
              </div>
            </div>
          </div>

          {/* Advanced Modules — locked until core curriculum complete */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black">Advanced Modules</h3>
                <p className="text-foreground/40 text-sm mt-0.5">
                  Specialist frameworks unlocked after completing all 7 core levels.
                </p>
              </div>
              {completedLevels < totalLevels && (
                <span className="flex items-center gap-1.5 text-xs text-foreground/30 border border-border rounded-full px-3 py-1">
                  <Lock className="h-3.5 w-3.5" />
                  Complete all 7 levels to unlock
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Lean Methodology",
                  subtitle: "Eliminate waste, maximise value",
                  description: "Learn Lean principles, value stream mapping, and how to apply continuous improvement in project environments.",
                  icon: <TrendingUp className="h-5 w-5 text-green-400" />,
                  colour: "bg-green-500/[0.05] border-green-500/20",
                  iconBg: "bg-green-500/10",
                  comingSoon: true,
                },
                {
                  title: "Six Sigma",
                  subtitle: "Data-driven quality control",
                  description: "Master DMAIC, statistical process control, and defect reduction techniques used in high-stakes projects.",
                  icon: <BarChart3 className="h-5 w-5 text-blue-400" />,
                  colour: "bg-blue-500/[0.05] border-blue-500/20",
                  iconBg: "bg-blue-500/10",
                  comingSoon: true,
                },
                {
                  title: "PRINCE2 Practitioner",
                  subtitle: "Structured project governance",
                  description: "Go beyond the foundation — learn how to tailor PRINCE2 to real projects and prepare for the Practitioner exam.",
                  icon: <Shield className="h-5 w-5 text-purple-400" />,
                  colour: "bg-purple-500/[0.05] border-purple-500/20",
                  iconBg: "bg-purple-500/10",
                  comingSoon: true,
                },
                {
                  title: "MSP — Managing Successful Programmes",
                  subtitle: "Programme-level leadership",
                  description: "Understand how to manage portfolios of related projects, align them to organisational strategy, and deliver transformational change.",
                  icon: <Layers className="h-5 w-5 text-amber-400" />,
                  colour: "bg-amber-500/[0.05] border-amber-500/20",
                  iconBg: "bg-amber-500/10",
                  comingSoon: true,
                },
                {
                  title: "MoP — Management of Portfolios",
                  subtitle: "Strategic portfolio management",
                  description: "Learn how organisations select, prioritise, and govern their project portfolios to maximise strategic value and return.",
                  icon: <Target className="h-5 w-5 text-cyan-400" />,
                  colour: "bg-cyan-500/[0.05] border-cyan-500/20",
                  iconBg: "bg-cyan-500/10",
                  comingSoon: true,
                },
                {
                  title: "Change Management",
                  subtitle: "Lead people through change",
                  description: "Explore ADKAR, Kotter's 8-step model, and practical techniques for managing the human side of project delivery.",
                  icon: <Users className="h-5 w-5 text-rose-400" />,
                  colour: "bg-rose-500/[0.05] border-rose-500/20",
                  iconBg: "bg-rose-500/10",
                  comingSoon: true,
                },
              ].map((mod) => {
                const isUnlocked = completedLevels >= totalLevels || user?.role === "admin" || (user as any)?.founderAccessEarned;
                return (
                  <div
                    key={mod.title}
                    className={`relative rounded-2xl border p-5 transition-all ${
                      isUnlocked
                        ? `${mod.colour} cursor-pointer hover:opacity-90`
                        : "border-border bg-card opacity-50"
                    }`}
                    onClick={() => {
                      if (!isUnlocked) {
                        toast.info("Complete all 7 core levels to unlock Advanced Modules.");
                      } else {
                        toast.info(`${mod.title} — content coming soon!`);
                      }
                    }}
                  >
                    {/* Lock / Coming Soon badge */}
                    <div className="absolute top-4 right-4">
                      {isUnlocked ? (
                        <span className="text-xs font-semibold text-foreground/30 border border-border rounded-full px-2 py-0.5">Coming Soon</span>
                      ) : (
                        <Lock className="h-4 w-4 text-foreground/20" />
                      )}
                    </div>

                    <div className={`w-10 h-10 ${mod.iconBg} rounded-lg flex items-center justify-center mb-3`}>
                      {mod.icon}
                    </div>
                    <h4 className="font-bold text-base mb-0.5 pr-16">{mod.title}</h4>
                    <p className="text-xs text-foreground/40 mb-2">{mod.subtitle}</p>
                    <p className="text-sm text-foreground/50 leading-relaxed line-clamp-3">{mod.description}</p>

                    {!isUnlocked && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-foreground/30">
                        <Lock className="h-3 w-3" />
                        Complete all 7 levels to unlock
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Reference Materials</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div
                className="bg-purple-500/[0.05] border border-purple-500/20 rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:border-purple-400/40 transition-colors col-span-full md:col-span-2"
                onClick={() => setLocation("/mindset")}
              >
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-purple-200">Mindset Hub</p>
                  <p className="text-foreground/40 text-sm">Social media awareness, habit reinforcement, and identity conditioning for your PM transition</p>
                </div>
                <ChevronRight className="h-4 w-4 text-purple-400/40 ml-auto" />
              </div>
              <div
                className="bg-muted/60 border border-border rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:border-cyan-400/20 transition-colors"
                onClick={() => setLocation("/glossary")}
              >
                <div className="w-10 h-10 bg-cyan-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="font-semibold">PM Glossary</p>
                  <p className="text-foreground/40 text-sm">60+ essential project management terms</p>
                </div>
                <ChevronRight className="h-4 w-4 text-foreground/20 ml-auto" />
              </div>
              <div
                className="bg-muted/60 border border-border rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:border-cyan-400/20 transition-colors"
                onClick={() => setLocation("/frameworks")}
              >
                <div className="w-10 h-10 bg-cyan-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Layers className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="font-semibold">Frameworks Reference</p>
                  <p className="text-foreground/40 text-sm">Waterfall, Agile, Scrum, PRINCE2 & more</p>
                </div>
                <ChevronRight className="h-4 w-4 text-foreground/20 ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <OnboardingModal
        open={showOnboarding}
        onComplete={() => {
          setShowOnboarding(false);
          window.location.reload();
        }}
      />

      {showFullCelebration && (
        <FullCurriculumCelebration
          userName={user?.displayName || user?.name}
          onDismiss={() => setShowFullCelebration(false)}
        />
      )}
    </>
  );
}

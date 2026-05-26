import { useState, useMemo, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { BrandedLoader } from "@/components/BrandedLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Mic,
  FileText,
  Layers,
  Clock,
  CheckCircle2,
  Lock,
  PlayCircle,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Trophy,
  Star,
  GraduationCap,
  FlaskConical,
} from "lucide-react";
import TierCelebration from "@/components/TierCelebration";

// ─── types ────────────────────────────────────────────────────────────────────

type SimType = "all" | "decision_sim" | "interview_sim" | "build_sim" | "full_project";
type Difficulty = "beginner" | "intermediate" | "advanced";

// ─── helpers ─────────────────────────────────────────────────────────────────

const TYPE_META: Record<string, { label: string; icon: React.ReactNode; colour: string }> = {
  decision_sim: { label: "Decision Sim", icon: <Zap className="h-3.5 w-3.5" />, colour: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  interview_sim: { label: "Interview Sim", icon: <Mic className="h-3.5 w-3.5" />, colour: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  build_sim: { label: "Build Sim", icon: <FileText className="h-3.5 w-3.5" />, colour: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  full_project: { label: "Full Project", icon: <Layers className="h-3.5 w-3.5" />, colour: "bg-purple-500/15 text-purple-600 border-purple-500/30" },
};

const DIFFICULTY_META: Record<Difficulty, { label: string; colour: string; headerColour: string; icon: React.ReactNode; description: string }> = {
  beginner: {
    label: "Beginner",
    colour: "bg-green-500/15 text-green-700 border-green-500/30",
    headerColour: "from-green-500/10 to-transparent border-green-500/20",
    icon: <Star className="h-5 w-5 text-green-600" />,
    description: "Build your foundation — core PM concepts and straightforward decisions.",
  },
  intermediate: {
    label: "Intermediate",
    colour: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
    headerColour: "from-yellow-500/10 to-transparent border-yellow-500/20",
    icon: <Star className="h-5 w-5 text-yellow-600" />,
    description: "Apply your knowledge — multi-stakeholder scenarios and competing priorities.",
  },
  advanced: {
    label: "Advanced",
    colour: "bg-red-500/15 text-red-700 border-red-500/30",
    headerColour: "from-red-500/10 to-transparent border-red-500/20",
    icon: <Trophy className="h-5 w-5 text-red-600" />,
    description: "Prove your readiness — complex projects, crises, and interview-level challenges.",
  },
};

const TAG_LABEL: Record<string, string> = {
  high_impact: "High Impact",
  interview_favourite: "Interview Favourite",
  common_scenario: "Common Scenario",
  confidence_builder: "Confidence Builder",
  exam_prep: "Exam Prep",
};

// ─── DifficultySection ────────────────────────────────────────────────────────

function DifficultySection({
  difficulty,
  sims,
  isAuthenticated,
  onOpen,
  defaultOpen,
}: {
  difficulty: Difficulty;
  sims: any[];
  isAuthenticated: boolean;
  onOpen: (sim: any) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const meta = DIFFICULTY_META[difficulty];

  const completedInTier = sims.filter((s) => s.userProgress?.status === "completed").length;
  const total = sims.length;
  const pct = total > 0 ? Math.round((completedInTier / total) * 100) : 0;
  const tierComplete = total > 0 && completedInTier === total;

  return (
    <section className={`rounded-xl border bg-gradient-to-b ${meta.headerColour} overflow-hidden`}>
      {/* Section header */}
      <button
        className="w-full px-6 py-5 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="shrink-0">{meta.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold text-foreground">{meta.label}</h2>
            <span className="text-sm text-muted-foreground">{total} simulations</span>
            {tierComplete && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                <CheckCircle2 className="h-3 w-3" />
                Tier Complete!
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{meta.description}</p>
          {isAuthenticated && (
            <div className="flex items-center gap-3 mt-3">
              <Progress value={pct} className="h-2 flex-1 max-w-xs" />
              <span className="text-xs text-muted-foreground shrink-0">
                {completedInTier}/{total} completed
              </span>
            </div>
          )}
        </div>
        <div className="shrink-0 text-muted-foreground">
          {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>

      {/* Cards grid */}
      {open && (
        <div className="px-6 pb-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sims.map((sim) => {
            const typeMeta = TYPE_META[sim.type];
            const progress = sim.userProgress;
            const isLocked = sim.accessType === "pro" && !isAuthenticated;
            const isCompleted = progress?.status === "completed";
            const isInProgress = progress?.status === "in_progress";

            return (
              <Card
                key={sim.id}
                className={`group relative flex flex-col transition-shadow hover:shadow-md ${
                  isLocked ? "opacity-70" : "cursor-pointer"
                } ${isCompleted ? "border-emerald-500/30 bg-emerald-500/5" : ""}`}
                onClick={() => !isLocked && onOpen(sim)}
              >
                {/* Completed ribbon */}
                {isCompleted && (
                  <div className="absolute top-3 right-3 z-10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                )}
                {isInProgress && !isCompleted && (
                  <div className="absolute top-3 right-3 z-10">
                    <RotateCcw className="h-4 w-4 text-amber-500" />
                  </div>
                )}

                <CardHeader className="pb-2">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${typeMeta?.colour}`}>
                      {typeMeta?.icon}
                      {typeMeta?.label}
                    </span>
                    {sim.categoryTag && (
                      <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full border bg-muted text-muted-foreground">
                        {TAG_LABEL[sim.categoryTag] ?? sim.categoryTag}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base leading-snug pr-6">{sim.title}</CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col flex-1 gap-3">
                  <CardDescription className="text-sm leading-relaxed line-clamp-3">
                    {sim.description}
                  </CardDescription>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {sim.estimatedMinutes} min
                    </span>

                    {isLocked ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Lock className="h-3.5 w-3.5" />
                        Pro
                      </span>
                    ) : isCompleted ? (
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                        <RotateCcw className="h-3 w-3" />
                        Retry
                      </Button>
                    ) : (
                      <Button size="sm" className="h-7 text-xs gap-1">
                        <PlayCircle className="h-3 w-3" />
                        {isInProgress ? "Continue" : "Start"}
                      </Button>
                    )}
                  </div>

                  {/* Best score */}
                  {progress?.bestScore != null && (
                    <div className="text-xs text-muted-foreground">
                      Best score: <span className="font-semibold text-foreground">{progress.bestScore}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}

// ─── SimulationHub ────────────────────────────────────────────────────────────

export default function SimulationHub() {
  const [, setLocation] = useLocation();
  const searchStr = useSearch();
  const { isAuthenticated } = useAuth();

  const [typeFilter, setTypeFilter] = useState<SimType>("all");
  const [showInterviewBank, setShowInterviewBank] = useState(false);
  const [celebrationTier, setCelebrationTier] = useState<Difficulty | null>(null);
  // Track which tiers we've already celebrated so we don't re-fire on re-render
  const [celebratedTiers, setCelebratedTiers] = useState<Set<Difficulty>>(new Set());

  // Check if we arrived from a completed simulation
  const justCompletedSimId = useMemo(() => {
    const p = new URLSearchParams(searchStr);
    return p.get("completed") ? parseInt(p.get("completed")!, 10) : null;
  }, [searchStr]);

  const { data: sims, isLoading } = trpc.simulations.list.useQuery({
    type: typeFilter !== "all" ? typeFilter : undefined,
    isInterviewBank: showInterviewBank ? true : undefined,
  });

  // Fetch advanced module simulations separately
  const { data: advancedSims } = trpc.simulations.list.useQuery({
    accessType: "advanced",
  }, { enabled: !showInterviewBank });

  const { data: stats } = trpc.simulations.stats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  type SimItem = NonNullable<typeof sims>[number];

  // Group into difficulty tiers (excluding interview bank)
  const tierGroups = useMemo(() => {
    const groups: Record<Difficulty, SimItem[]> = { beginner: [], intermediate: [], advanced: [] };
    if (!sims) return groups;
    for (const s of sims) {
      if (!s.isInterviewBank && (s.difficulty === "beginner" || s.difficulty === "intermediate" || s.difficulty === "advanced")) {
        groups[s.difficulty as Difficulty].push(s);
      }
    }
    return groups;
  }, [sims]);

  const interviewBankSims = useMemo(() => sims?.filter((s) => s.isInterviewBank) ?? [], [sims]);

  // Group advanced module simulations by moduleName
  const advancedModuleGroups = useMemo(() => {
    const groups: Record<string, NonNullable<typeof advancedSims>> = {};
    if (!advancedSims) return groups;
    for (const s of advancedSims) {
      const mod = s.moduleName ?? "Other";
      if (!groups[mod]) groups[mod] = [];
      groups[mod].push(s);
    }
    return groups;
  }, [advancedSims]);

  // Check if core curriculum is complete (all 3 difficulty tiers fully completed)
  const coreComplete = useMemo(() => {
    if (!sims || sims.length === 0) return false;
    const coreSims = sims.filter((s) => !s.isInterviewBank && s.accessType !== "advanced");
    if (coreSims.length === 0) return false;
    return coreSims.every((s) => s.userProgress?.status === "completed");
  }, [sims]);

  const MODULE_ORDER = [
    "Lean Methodology",
    "Six Sigma",
    "PRINCE2 Practitioner",
    "MSP: Managing Successful Programmes",
    "MoP — Management of Portfolios",
    "Change Management",
  ];

  // Detect newly completed tiers and fire celebration
  useEffect(() => {
    if (!isAuthenticated || !justCompletedSimId || !sims || sims.length === 0) return;
    const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];
    for (const diff of difficulties) {
      if (celebratedTiers.has(diff)) continue;
      const tierSims = tierGroups[diff] ?? [];
      if (tierSims.length === 0) continue;
      const allComplete = tierSims.every((s) => s.userProgress?.status === "completed");
      if (allComplete) {
        setCelebrationTier(diff);
        setCelebratedTiers((prev) => {
          const next = new Set<Difficulty>();
          prev.forEach((t) => next.add(t));
          next.add(diff);
          return next;
        });
        break;
      }
    }
  }, [sims, justCompletedSimId, isAuthenticated, tierGroups, celebratedTiers]);

  const totalSims = sims?.filter((s) => !s.isInterviewBank).length ?? 0;
  const completedCount = stats?.totalCompleted ?? 0;

  function handleOpen(sim: NonNullable<typeof sims>[number]) {
    if (sim.type === "decision_sim" || sim.type === "full_project") {
      setLocation(`/simulations/decision/${sim.id}`);
    } else if (sim.type === "interview_sim") {
      setLocation(`/simulations/interview/${sim.id}`);
    } else if (sim.type === "build_sim") {
      setLocation(`/simulations/build/${sim.id}`);
    }
  }

  if (isLoading) return <BrandedLoader message="Loading simulations..." />;

  const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];

  return (
    <div className="min-h-screen bg-background">
      {/* Tier celebration overlay */}
      {celebrationTier && (
        <TierCelebration
          tier={celebrationTier}
          onDismiss={() => setCelebrationTier(null)}
        />
      )}

      {/* ── Sticky nav bar ── */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <span className="text-foreground/30 text-sm ml-1">/ Simulation Hub</span>
        </div>
      </div>

      {/* ── Header ── */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Simulation Hub</h1>
              <p className="text-muted-foreground mt-1">
                Practice real PM decisions, nail interview questions, and build career-ready documents.
              </p>
            </div>
            {isAuthenticated && (
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{completedCount}</div>
                  <div className="text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{totalSims}</div>
                  <div className="text-muted-foreground">Available</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Type filter pills ── */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", "decision_sim", "interview_sim", "build_sim", "full_project"] as SimType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                typeFilter === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              {t !== "all" && TYPE_META[t]?.icon}
              {t === "all" ? "All Types" : TYPE_META[t]?.label}
            </button>
          ))}

          <button
            onClick={() => setShowInterviewBank((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              showInterviewBank
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-card text-muted-foreground border-border hover:border-blue-500/50"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Interview Bank
          </button>
        </div>
      </div>

      {/* ── Difficulty sections ── */}
      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-6">
        {!showInterviewBank && (
          <>
            {difficulties.map((diff, i) => {
              const tierSims = tierGroups[diff] ?? [];
              if (tierSims.length === 0) return null;
              return (
                <DifficultySection
                  key={diff}
                  difficulty={diff}
                  sims={tierSims}
                  isAuthenticated={isAuthenticated}
                  onOpen={handleOpen}
                  defaultOpen={i === 0}
                />
              );
            })}
          </>
        )}

        {/* Interview Bank section */}
        {showInterviewBank && interviewBankSims.length > 0 && (
          <section className="rounded-xl border bg-gradient-to-b from-blue-500/10 to-transparent border-blue-500/20 overflow-hidden">
            <div className="px-6 py-5 border-b border-blue-500/20">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <h2 className="text-lg font-bold text-foreground">Interview Bank</h2>
                  <p className="text-sm text-muted-foreground">
                    Practise the questions that come up most in PM interviews.
                  </p>
                </div>
                <span className="ml-auto text-sm text-muted-foreground">{interviewBankSims.length} questions</span>
              </div>
            </div>
            <div className="px-6 pb-6 pt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviewBankSims.map((sim) => {
                const typeMeta = TYPE_META[sim.type];
                const progress = sim.userProgress;
                const isCompleted = progress?.status === "completed";
                const isInProgress = progress?.status === "in_progress";
                return (
                  <Card
                    key={sim.id}
                    className={`group relative flex flex-col cursor-pointer transition-shadow hover:shadow-md ${isCompleted ? "border-emerald-500/30 bg-emerald-500/5" : ""}`}
                    onClick={() => handleOpen(sim)}
                  >
                    {isCompleted && (
                      <div className="absolute top-3 right-3 z-10">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </div>
                    )}
                    {isInProgress && !isCompleted && (
                      <div className="absolute top-3 right-3 z-10">
                        <RotateCcw className="h-4 w-4 text-amber-500" />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${typeMeta?.colour}`}>
                          {typeMeta?.icon}
                          {typeMeta?.label}
                        </span>
                      </div>
                      <CardTitle className="text-base leading-snug pr-6">{sim.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 gap-3">
                      <CardDescription className="text-sm leading-relaxed line-clamp-3">
                        {sim.description}
                      </CardDescription>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {sim.estimatedMinutes} min
                        </span>
                        {isCompleted ? (
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                            <RotateCcw className="h-3 w-3" />
                            Retry
                          </Button>
                        ) : (
                          <Button size="sm" className="h-7 text-xs gap-1">
                            <PlayCircle className="h-3 w-3" />
                            {isInProgress ? "Continue" : "Start"}
                          </Button>
                        )}
                      </div>
                      {progress?.bestScore != null && (
                        <div className="text-xs text-muted-foreground">
                          Best score: <span className="font-semibold text-foreground">{progress.bestScore}%</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {!showInterviewBank && difficulties.every((d) => tierGroups[d].length === 0) && (
          <div className="text-center py-20 text-muted-foreground">
            No simulations match your filters.
          </div>
        )}

        {/* Advanced Modules section */}
        {!showInterviewBank && (
          <section className={`rounded-xl border overflow-hidden transition-all ${
            coreComplete
              ? "border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent"
              : "border-muted bg-muted/20"
          }`}>
            <div className={`px-6 py-5 border-b ${
              coreComplete ? "border-amber-500/20" : "border-muted"
            }`}>
              <div className="flex items-center gap-3">
                <GraduationCap className={`h-5 w-5 ${coreComplete ? "text-amber-500" : "text-muted-foreground"}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">Advanced Modules</h2>
                    {!coreComplete && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border">
                        <Lock className="h-3 w-3" />
                        Locked
                      </span>
                    )}
                    {coreComplete && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        <Trophy className="h-3 w-3" />
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {coreComplete
                      ? "You've earned access to specialist methodology simulations."
                      : "Complete all Beginner, Intermediate, and Advanced core simulations to unlock."
                    }
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {Object.keys(advancedModuleGroups).length} modules
                </span>
              </div>
            </div>

            {!coreComplete ? (
              <div className="px-6 py-10 text-center">
                <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Complete all core simulations (Beginner, Intermediate, and Advanced tiers) to unlock Lean, Six Sigma, PRINCE2 Practitioner, MSP, MoP, and Change Management.
                </p>
              </div>
            ) : (
              <div className="px-6 pb-6 pt-4 space-y-8">
                {MODULE_ORDER.filter((mod) => advancedModuleGroups[mod]?.length > 0).map((moduleName) => {
                  const modSims = advancedModuleGroups[moduleName] ?? [];
                  const completedInMod = modSims.filter((s) => s.userProgress?.status === "completed").length;
                  return (
                    <div key={moduleName}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FlaskConical className="h-4 w-4 text-amber-500" />
                          <h3 className="font-semibold text-foreground">{moduleName}</h3>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {completedInMod}/{modSims.length} completed
                        </span>
                      </div>
                      <Progress value={(completedInMod / modSims.length) * 100} className="h-1.5 mb-4" />
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {modSims.map((sim) => {
                          const typeMeta = TYPE_META[sim.type];
                          const prog = sim.userProgress;
                          const isCompleted = prog?.status === "completed";
                          const isInProgress = prog?.status === "in_progress";
                          return (
                            <Card
                              key={sim.id}
                              className={`group relative flex flex-col cursor-pointer transition-shadow hover:shadow-md ${
                                isCompleted ? "border-emerald-500/30 bg-emerald-500/5" : ""
                              }`}
                              onClick={() => handleOpen(sim)}
                            >
                              {isCompleted && (
                                <div className="absolute top-3 right-3 z-10">
                                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                </div>
                              )}
                              {isInProgress && !isCompleted && (
                                <div className="absolute top-3 right-3 z-10">
                                  <RotateCcw className="h-4 w-4 text-amber-500" />
                                </div>
                              )}
                              <CardHeader className="pb-2">
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${typeMeta?.colour}`}>
                                    {typeMeta?.icon}
                                    {typeMeta?.label}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium bg-amber-500/10 text-amber-600 border-amber-500/20">
                                    <Star className="h-3 w-3" />
                                    Advanced
                                  </span>
                                </div>
                                <CardTitle className="text-base leading-snug pr-6">{sim.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="flex flex-col flex-1 gap-3">
                                <CardDescription className="text-sm leading-relaxed line-clamp-3">
                                  {sim.description}
                                </CardDescription>
                                <div className="mt-auto flex items-center justify-between">
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    {sim.estimatedMinutes} min
                                  </span>
                                  {isCompleted ? (
                                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                                      <RotateCcw className="h-3 w-3" />
                                      Retry
                                    </Button>
                                  ) : (
                                    <Button size="sm" className="h-7 text-xs gap-1">
                                      <PlayCircle className="h-3 w-3" />
                                      {isInProgress ? "Continue" : "Start"}
                                    </Button>
                                  )}
                                </div>
                                {prog?.bestScore != null && (
                                  <div className="text-xs text-muted-foreground">
                                    Best score: <span className="font-semibold text-foreground">{prog.bestScore}%</span>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

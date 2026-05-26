import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { BrandedLoader } from "@/components/BrandedLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Filter,
} from "lucide-react";

// ─── types ────────────────────────────────────────────────────────────────────

type SimType = "all" | "decision_sim" | "interview_sim" | "build_sim" | "full_project";
type Difficulty = "all" | "beginner" | "intermediate" | "advanced";
type CategoryTag = "all" | "high_impact" | "interview_favourite" | "common_scenario" | "confidence_builder" | "exam_prep";

// ─── helpers ─────────────────────────────────────────────────────────────────

const TYPE_META: Record<string, { label: string; icon: React.ReactNode; colour: string }> = {
  decision_sim: { label: "Decision Sim", icon: <Zap className="h-3.5 w-3.5" />, colour: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  interview_sim: { label: "Interview Sim", icon: <Mic className="h-3.5 w-3.5" />, colour: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  build_sim: { label: "Build Sim", icon: <FileText className="h-3.5 w-3.5" />, colour: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  full_project: { label: "Full Project", icon: <Layers className="h-3.5 w-3.5" />, colour: "bg-purple-500/15 text-purple-600 border-purple-500/30" },
};

const DIFFICULTY_COLOUR: Record<string, string> = {
  beginner: "bg-green-500/15 text-green-700 border-green-500/30",
  intermediate: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
  advanced: "bg-red-500/15 text-red-700 border-red-500/30",
};

const TAG_LABEL: Record<string, string> = {
  high_impact: "High Impact",
  interview_favourite: "Interview Favourite",
  common_scenario: "Common Scenario",
  confidence_builder: "Confidence Builder",
  exam_prep: "Exam Prep",
};

function StatusIcon({ status }: { status: string | null | undefined }) {
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === "in_progress") return <RotateCcw className="h-4 w-4 text-amber-500" />;
  return null;
}

// ─── component ───────────────────────────────────────────────────────────────

export default function SimulationHub() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [typeFilter, setTypeFilter] = useState<SimType>("all");
  const [diffFilter, setDiffFilter] = useState<Difficulty>("all");
  const [tagFilter, setTagFilter] = useState<CategoryTag>("all");
  const [showInterviewBank, setShowInterviewBank] = useState(false);

  const { data: sims, isLoading } = trpc.simulations.list.useQuery({
    type: typeFilter !== "all" ? typeFilter : undefined,
    difficulty: diffFilter !== "all" ? diffFilter : undefined,
    categoryTag: tagFilter !== "all" ? tagFilter : undefined,
    isInterviewBank: showInterviewBank ? true : undefined,
  });

  const { data: stats } = trpc.simulations.stats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Group by level (interview bank items are grouped separately)
  const grouped = useMemo(() => {
    if (!sims) return {};
    const map: Record<string, typeof sims> = {};
    for (const s of sims) {
      if (s.isInterviewBank) {
        map["Interview Bank"] = [...(map["Interview Bank"] ?? []), s];
      } else {
        const key = `Level ${s.levelId}`;
        map[key] = [...(map[key] ?? []), s];
      }
    }
    return map;
  }, [sims]);

  const totalSims = sims?.length ?? 0;
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

  return (
    <div className="min-h-screen bg-background">
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

      {/* ── Type pills ── */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex flex-wrap gap-2 mb-4">
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
        </div>

        {/* ── Filters row ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Filter className="h-4 w-4 text-muted-foreground" />

          <Select value={diffFilter} onValueChange={(v) => setDiffFilter(v as Difficulty)}>
            <SelectTrigger className="w-40 h-8 text-sm">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tagFilter} onValueChange={(v) => setTagFilter(v as CategoryTag)}>
            <SelectTrigger className="w-48 h-8 text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="high_impact">High Impact</SelectItem>
              <SelectItem value="interview_favourite">Interview Favourite</SelectItem>
              <SelectItem value="common_scenario">Common Scenario</SelectItem>
              <SelectItem value="confidence_builder">Confidence Builder</SelectItem>
              <SelectItem value="exam_prep">Exam Prep</SelectItem>
            </SelectContent>
          </Select>

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

      {/* ── Simulation groups ── */}
      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-10">
        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No simulations match your filters.
          </div>
        )}

        {Object.entries(grouped).map(([group, items]) => (
          <section key={group}>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              {group}
              <span className="text-sm font-normal text-muted-foreground">({items.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((sim) => {
                const meta = TYPE_META[sim.type];
                const progress = (sim as any).userProgress;
                const isLocked = sim.accessType === "pro" && !isAuthenticated;
                const isCompleted = progress?.status === "completed";
                const isInProgress = progress?.status === "in_progress";

                return (
                  <Card
                    key={sim.id}
                    className={`group relative flex flex-col transition-shadow hover:shadow-md ${
                      isLocked ? "opacity-70" : "cursor-pointer"
                    }`}
                    onClick={() => !isLocked && handleOpen(sim)}
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
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${meta?.colour}`}>
                          {meta?.icon}
                          {meta?.label}
                        </span>
                        <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full border font-medium ${DIFFICULTY_COLOUR[sim.difficulty]}`}>
                          {sim.difficulty.charAt(0).toUpperCase() + sim.difficulty.slice(1)}
                        </span>
                        {sim.categoryTag && (
                          <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full border bg-muted text-muted-foreground">
                            {TAG_LABEL[sim.categoryTag] ?? sim.categoryTag}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-base leading-snug">{sim.title}</CardTitle>
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

                      {/* Best score badge */}
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
        ))}
      </div>
    </div>
  );
}

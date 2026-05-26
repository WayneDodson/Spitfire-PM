import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { BrandedLoader } from "@/components/BrandedLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ShareProgress from "@/components/ShareProgress";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  Trophy,
  RotateCcw,
  Heart,
  Shield,
} from "lucide-react";
import { Streamdown } from "streamdown";

// ─── types ───────────────────────────────────────────────────────────────────

interface Option {
  id: string;
  text: string;
  consequence: string;
  score: number;
}

interface DecisionContent {
  scenario: string;
  options: Option[];
  takeaway: string;
}

interface StageDecision {
  question: string;
  options: Array<{
    text: string;
    consequence: string;
    modifier: { health: number; trust: number };
  }>;
}

interface Stage {
  id: number;
  title: string;
  description?: string;
  decisions: StageDecision[];
}

interface FullProjectContent {
  setup: string;
  stages: Stage[];
}

// ─── score helpers ────────────────────────────────────────────────────────────

function scoreColour(score: number) {
  if (score >= 4) return "text-emerald-600";
  if (score >= 3) return "text-amber-600";
  return "text-red-500";
}

function scoreIcon(score: number) {
  if (score >= 4) return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
  if (score >= 3) return <AlertTriangle className="h-5 w-5 text-amber-500" />;
  return <XCircle className="h-5 w-5 text-red-500" />;
}

// ─── Decision Sim (single scenario) ──────────────────────────────────────────

function DecisionSimView({
  sim,
  onComplete,
}: {
  sim: { id: number; title: string; content: DecisionContent };
  onComplete: (score: number) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const getFeedbackMutation = trpc.simulations.getDecisionFeedback.useMutation();

  const content = sim.content;
  const chosenOption = content.options.find((o) => o.id === selected);

  async function handleReveal() {
    if (!selected || !chosenOption) return;
    setRevealed(true);
    setLoadingFeedback(true);
    try {
      const result = await getFeedbackMutation.mutateAsync({
        simulationId: sim.id,
        chosenOptionId: selected,
        scenario: content.scenario,
        chosenText: chosenOption.text,
        chosenConsequence: chosenOption.consequence,
        chosenScore: chosenOption.score,
        takeaway: content.takeaway,
      });
      setAiFeedback(String(result.feedback));
    } catch {
      setAiFeedback(null);
    } finally {
      setLoadingFeedback(false);
    }
  }

  const finalScore = chosenOption ? Math.round((chosenOption.score / 4) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Scenario */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wide">
            Scenario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{content.scenario}</p>
        </CardContent>
      </Card>

      {/* Options */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">What do you do?</h3>
        {content.options.map((opt) => {
          const isChosen = selected === opt.id;
          const isBest = opt.score === 4;
          return (
            <button
              key={opt.id}
              disabled={revealed}
              onClick={() => setSelected(opt.id)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                revealed
                  ? isChosen
                    ? isBest
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                      : "border-red-400 bg-red-50 dark:bg-red-950/30"
                    : isBest
                    ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/10"
                    : "border-border bg-muted/30 opacity-60"
                  : isChosen
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="font-bold text-muted-foreground mt-0.5 w-5 shrink-0">{opt.id}.</span>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{opt.text}</p>
                  {revealed && (
                    <div className={`mt-2 flex items-start gap-2 text-sm ${scoreColour(opt.score)}`}>
                      {scoreIcon(opt.score)}
                      <p className="leading-relaxed">{opt.consequence}</p>
                    </div>
                  )}
                </div>
                {revealed && (
                  <span className={`text-xs font-bold shrink-0 ${scoreColour(opt.score)}`}>
                    {opt.score}/4
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Reveal / AI feedback */}
      {!revealed ? (
        <Button
          disabled={!selected}
          onClick={handleReveal}
          className="w-full"
        >
          Reveal Consequences
        </Button>
      ) : (
        <div className="space-y-4">
          {/* Takeaway */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-4 flex gap-3">
              <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-primary mb-1">Key Takeaway</p>
                <p className="text-sm text-foreground leading-relaxed">{content.takeaway}</p>
              </div>
            </CardContent>
          </Card>

          {/* AI feedback */}
          {loadingFeedback && (
            <Card>
              <CardContent className="pt-4 text-sm text-muted-foreground animate-pulse">
                AI coach is reviewing your decision...
              </CardContent>
            </Card>
          )}
          {aiFeedback && (
            <Card className="border-blue-300/50 bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  AI Coach Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Streamdown className="text-sm leading-relaxed">{aiFeedback}</Streamdown>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={() => onComplete(finalScore)}
            className="w-full"
          >
            Complete Simulation
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Full Project Sim ─────────────────────────────────────────────────────────

function FullProjectView({
  sim,
  onComplete,
}: {
  sim: { id: number; title: string; content: FullProjectContent };
  onComplete: (score: number) => void;
}) {
  const [stageIndex, setStageIndex] = useState(0);
  const [health, setHealth] = useState(100);
  const [trust, setTrust] = useState(100);
  const [choices, setChoices] = useState<number[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const content = sim.content;
  const stages = content.stages;
  const currentStage = stages[stageIndex];
  const decision = currentStage?.decisions[0];

  function handleReveal() {
    if (selectedChoice === null || !decision) return;
    const opt = decision.options[selectedChoice];
    setHealth((h) => Math.max(0, Math.min(100, h + opt.modifier.health)));
    setTrust((t) => Math.max(0, Math.min(100, t + opt.modifier.trust)));
    setChoices((c) => [...c, selectedChoice]);
    setRevealed(true);
  }

  function handleNext() {
    if (stageIndex + 1 >= stages.length) {
      setFinished(true);
    } else {
      setStageIndex((i) => i + 1);
      setSelectedChoice(null);
      setRevealed(false);
    }
  }

  const finalScore = Math.round((health + trust) / 2);

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center">
        <Trophy className="h-16 w-16 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-bold">Project Complete!</h2>
        <div className="flex justify-center gap-8">
          <div>
            <div className={`text-3xl font-bold ${health >= 70 ? "text-emerald-600" : health >= 40 ? "text-amber-600" : "text-red-500"}`}>{health}</div>
            <div className="text-sm text-muted-foreground">Project Health</div>
          </div>
          <div>
            <div className={`text-3xl font-bold ${trust >= 70 ? "text-emerald-600" : trust >= 40 ? "text-amber-600" : "text-red-500"}`}>{trust}</div>
            <div className="text-sm text-muted-foreground">Stakeholder Trust</div>
          </div>
        </div>
        <p className="text-muted-foreground">
          {finalScore >= 80
            ? "Excellent project management! You navigated every challenge with skill."
            : finalScore >= 60
            ? "Good effort — a few decisions impacted your project health or trust."
            : "This project was tough. Review the consequences and try again."}
        </p>
        <Button onClick={() => onComplete(finalScore)} className="w-full">
          Save Results
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress bar */}
      <div className="flex gap-1">
        {stages.map((s, i) => (
          <div
            key={s.id}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < stageIndex ? "bg-primary" : i === stageIndex ? "bg-primary/60" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Health / Trust meters */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Heart className="h-4 w-4 text-red-500" />
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${health}%` }} />
          </div>
          <span className="text-muted-foreground">{health}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-blue-500" />
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${trust}%` }} />
          </div>
          <span className="text-muted-foreground">{trust}</span>
        </div>
      </div>

      {/* Stage header */}
      <Card>
        <CardHeader className="pb-2">
          <Badge variant="outline" className="w-fit text-xs">{currentStage.title}</Badge>
          {currentStage.description && (
            <p className="text-sm text-muted-foreground">{currentStage.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <p className="font-medium text-foreground leading-relaxed">{decision?.question}</p>
        </CardContent>
      </Card>

      {/* Options */}
      <div className="space-y-3">
        {decision?.options.map((opt, i) => {
          const isChosen = selectedChoice === i;
          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => setSelectedChoice(i)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                revealed
                  ? isChosen
                    ? opt.modifier.health >= 0 && opt.modifier.trust >= 0
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                      : "border-red-400 bg-red-50 dark:bg-red-950/30"
                    : "border-border bg-muted/30 opacity-60"
                  : isChosen
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <p className="text-sm leading-relaxed">{opt.text}</p>
              {revealed && isChosen && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-muted-foreground italic">{opt.consequence}</p>
                  <div className="flex gap-4 text-xs">
                    <span className={opt.modifier.health >= 0 ? "text-emerald-600" : "text-red-500"}>
                      Health {opt.modifier.health >= 0 ? "+" : ""}{opt.modifier.health}
                    </span>
                    <span className={opt.modifier.trust >= 0 ? "text-emerald-600" : "text-red-500"}>
                      Trust {opt.modifier.trust >= 0 ? "+" : ""}{opt.modifier.trust}
                    </span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {!revealed ? (
        <Button disabled={selectedChoice === null} onClick={handleReveal} className="w-full">
          Confirm Decision
        </Button>
      ) : (
        <Button onClick={handleNext} className="w-full">
          {stageIndex + 1 >= stages.length ? "See Results" : "Next Stage"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      )}
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────

export default function DecisionSimPlayer() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const simId = parseInt(params.id ?? "0", 10);

  const { data: simData, isLoading } = trpc.simulations.get.useQuery(
    { id: simId },
    { enabled: !!simId }
  );

  const startMutation = trpc.simulations.start.useMutation();
  const completeMutation = trpc.simulations.complete.useMutation();

  useEffect(() => {
    if (simData && isAuthenticated) {
      startMutation.mutate({ simulationId: simId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simData?.id, isAuthenticated]);

  async function handleComplete(score: number) {
    setFinalScore(score);
    if (isAuthenticated) {
      await completeMutation.mutateAsync({ simulationId: simId, score });
    }
    setCompleted(true);
  }

  if (isLoading) return <BrandedLoader message="Loading simulation..." />;
  if (!simData) return <div className="p-8 text-center text-muted-foreground">Simulation not found.</div>;

  const content = simData.content as any;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav bar */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/simulations")} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Hub
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-sm truncate">{simData.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {completed ? (
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
            <h2 className="text-2xl font-bold">Simulation Complete</h2>
            <p className="text-4xl font-bold text-primary">{finalScore}%</p>
            <p className="text-muted-foreground">
              {finalScore >= 80
                ? "Excellent work — that's the kind of decision-making that builds PM credibility."
                : finalScore >= 60
                ? "Good effort. Review the consequences to sharpen your thinking."
                : "Challenging scenario. Review the feedback and try again."}
            </p>
            <ShareProgress
              achievement={`I just scored ${finalScore}% on "${simData.title}" on Spitfire PM!`}
            />
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setLocation("/simulations")} className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Hub
              </Button>
              <Button onClick={() => window.location.reload()} className="gap-1">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        ) : simData.type === "full_project" ? (
          <FullProjectView
            sim={{ id: simData.id, title: simData.title, content: content as FullProjectContent }}
            onComplete={handleComplete}
          />
        ) : (
          <DecisionSimView
            sim={{ id: simData.id, title: simData.title, content: content as DecisionContent }}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { BrandedLoader } from "@/components/BrandedLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import ShareProgress from "@/components/ShareProgress";
import { Streamdown } from "streamdown";
import {
  ArrowLeft,
  CheckCircle2,
  Mic,
  RotateCcw,
  Lightbulb,
  AlertCircle,
} from "lucide-react";

// ─── types ───────────────────────────────────────────────────────────────────

interface InterviewContent {
  question: string;
  context: string;
  coachingFocus: string;
  minWords: number;
  maxWords: number;
}

// ─── word count helper ────────────────────────────────────────────────────────

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ─── component ───────────────────────────────────────────────────────────────

export default function InterviewSimPlayer() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);

  const simId = parseInt(params.id ?? "0", 10);

  const { data: simData, isLoading } = trpc.simulations.get.useQuery(
    { id: simId },
    { enabled: !!simId }
  );

  const startMutation = trpc.simulations.start.useMutation();
  const completeMutation = trpc.simulations.complete.useMutation();
  const scoreMutation = trpc.simulations.scoreInterview.useMutation();

  useEffect(() => {
    if (simData && isAuthenticated) {
      startMutation.mutate({ simulationId: simId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simData?.id, isAuthenticated]);

  const content = simData?.content as InterviewContent | undefined;
  const wc = wordCount(answer);
  const minWords = content?.minWords ?? 80;
  const maxWords = content?.maxWords ?? 400;
  const tooShort = wc < minWords;
  const tooLong = wc > maxWords;
  const canSubmit = !tooShort && !tooLong && answer.trim().length > 0;

  async function handleSubmit() {
    if (!content || !canSubmit) return;
    setSubmitted(true);
    setLoadingFeedback(true);
    try {
      const result = await scoreMutation.mutateAsync({
        simulationId: simId,
        question: content.question,
        answer,
        coachingFocus: content.coachingFocus,
      });
      setFeedback(result.feedback);
      setScore(result.score);
    } catch {
      setFeedback("Unable to generate feedback at this time. Please try again.");
      setScore(50);
    } finally {
      setLoadingFeedback(false);
    }
  }

  async function handleSave() {
    if (isAuthenticated && score !== null) {
      await completeMutation.mutateAsync({
        simulationId: simId,
        score,
        feedback: feedback ?? undefined,
      });
    }
    setCompleted(true);
  }

  if (isLoading) return <BrandedLoader message="Loading interview question..." />;
  if (!simData || !content) return <div className="p-8 text-center text-muted-foreground">Simulation not found.</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/simulations")} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Hub
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-sm truncate">{simData.title}</h1>
          </div>
          <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            <Mic className="h-3 w-3" />
            Interview Sim
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {completed ? (
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
            <h2 className="text-2xl font-bold">Answer Saved</h2>
            {score !== null && (
              <p className="text-4xl font-bold text-primary">{score}%</p>
            )}
            <p className="text-muted-foreground">
              {(score ?? 0) >= 80
                ? "Strong answer — you demonstrated clear PM thinking."
                : (score ?? 0) >= 60
                ? "Good foundation. Review the feedback to sharpen your response."
                : "Keep practising — interview answers improve with repetition."}
            </p>
            <ShareProgress
              achievement={`I just practised a PM interview question on Spitfire PM — "${simData.title}"`}
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
        ) : (
          <>
            {/* Context */}
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
              <CardContent className="pt-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">Interview Context</p>
                  <p className="text-sm text-foreground">{content.context}</p>
                </div>
              </CardContent>
            </Card>

            {/* Question */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Interview Question</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed font-medium">{content.question}</p>
              </CardContent>
            </Card>

            {/* Coaching tip */}
            <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
              <CardContent className="pt-4 flex gap-3">
                <Lightbulb className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">What the coach looks for</p>
                  <p className="text-sm text-foreground">{content.coachingFocus}</p>
                </div>
              </CardContent>
            </Card>

            {/* Answer box */}
            {!submitted && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Your Answer</label>
                  <span className={`text-xs ${tooShort ? "text-muted-foreground" : tooLong ? "text-red-500" : "text-emerald-600"}`}>
                    {wc} / {minWords}–{maxWords} words
                  </span>
                </div>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={`Use the STAR method: Situation, Task, Action, Result. Aim for ${minWords}–${maxWords} words.`}
                  className="min-h-48 resize-y"
                />
                {tooShort && wc > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add {minWords - wc} more words to meet the minimum.
                  </p>
                )}
                {tooLong && (
                  <p className="text-xs text-red-500">
                    Your answer is {wc - maxWords} words over the limit. Please trim it.
                  </p>
                )}
                <Button
                  disabled={!canSubmit}
                  onClick={handleSubmit}
                  className="w-full"
                >
                  Submit for AI Scoring
                </Button>
              </div>
            )}

            {/* Feedback */}
            {submitted && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">Your Answer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{answer}</p>
                  </CardContent>
                </Card>

                {loadingFeedback ? (
                  <Card>
                    <CardContent className="pt-4 text-sm text-muted-foreground animate-pulse">
                      AI coach is scoring your answer...
                    </CardContent>
                  </Card>
                ) : feedback ? (
                  <>
                    {score !== null && (
                      <div className="text-center py-4">
                        <div className={`text-4xl font-bold ${score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-red-500"}`}>
                          {score}%
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">AI Score</div>
                      </div>
                    )}
                    <Card className="border-blue-300/50 bg-blue-50/50 dark:bg-blue-950/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                          AI Coach Feedback
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Streamdown className="text-sm leading-relaxed">{feedback}</Streamdown>
                      </CardContent>
                    </Card>
                    <Button onClick={handleSave} className="w-full">
                      Save & Continue
                    </Button>
                  </>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

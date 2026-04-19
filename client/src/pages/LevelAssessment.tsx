import { useState, useMemo } from "react";
import { useParams, useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Trophy,
  RefreshCw,
  BookOpen,
  Target,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

interface QuestionResult {
  checkId: number;
  selectedIndex: number;
  isCorrect: boolean;
  correctAnswerIndex: number;
  explanation: string;
}

type AssessmentPhase = "intro" | "quiz" | "results";

const PASS_THRESHOLD = 4; // 4 out of 5 to pass

export default function LevelAssessment() {
  const params = useParams();
  const levelId = parseInt(params.levelId || "0");
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  const [phase, setPhase] = useState<AssessmentPhase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [attemptRound, setAttemptRound] = useState(1);

  const { data: questions, isLoading } = trpc.knowledgeChecks.getAssessmentForLevel.useQuery({
    levelId,
  });

  const { data: levelData } = trpc.levels.getAll.useQuery();
  const currentLevel = levelData?.find((l: { id: number }) => l.id === levelId);

  const submitAnswer = trpc.knowledgeChecks.submitAnswer.useMutation({
    onSuccess: (data) => {
      const q = questions![currentIndex];
      const result: QuestionResult = {
        checkId: q.id,
        selectedIndex: selectedAnswer!,
        isCorrect: data.isCorrect,
        correctAnswerIndex: data.correctAnswerIndex,
        explanation: data.explanation,
      };
      setResults((prev) => [...prev, result]);
      setShowFeedback(true);
    },
  });

  const handleSubmit = () => {
    if (selectedAnswer === null || !questions) return;
    const q = questions[currentIndex];
    submitAnswer.mutate({
      checkId: q.id,
      selectedAnswerIndex: selectedAnswer,
    });
  };

  const handleNext = () => {
    if (!questions) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setPhase("results");
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setResults([]);
    setAttemptRound((r) => r + 1);
    setPhase("quiz");
  };

  const score = results.filter((r) => r.isCorrect).length;
  const passed = score >= PASS_THRESHOLD;
  const failedQuestions = results.filter((r) => !r.isCorrect);

  const progressPct = questions ? ((currentIndex + 1) / questions.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Assessment Not Found</h2>
          <p className="text-muted-foreground mb-6">
            No assessment questions are available for this level yet.
          </p>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const options = JSON.parse(currentQuestion.options) as string[];
  const currentResult = results[currentIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Level {levelId} Assessment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-3xl">
        {/* ── INTRO ──────────────────────────────────────────────────────── */}
        {phase === "intro" && (
          <div className="text-center space-y-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Level {levelId} Assessment
              </h1>
              {currentLevel && (
                <p className="text-lg text-muted-foreground">{currentLevel.title}</p>
              )}
            </div>

            <Card className="text-left p-6 space-y-4">
              <h2 className="font-bold text-lg">What to expect:</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>5 industry-standard questions covering all Level {levelId} topics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Questions are designed to reflect real PM job interview scenarios</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>You need 4 out of 5 correct to pass (80%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    If you don't pass, you'll get guidance on which lessons to review before
                    retrying
                  </span>
                </li>
              </ul>
            </Card>

            {attemptRound > 1 && (
              <p className="text-sm text-muted-foreground">
                Attempt {attemptRound} — you can retry as many times as needed.
              </p>
            )}

            <Button size="lg" className="px-10" onClick={() => setPhase("quiz")}>
              Start Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ── QUIZ ───────────────────────────────────────────────────────── */}
        {phase === "quiz" && (
          <div className="space-y-6">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-muted-foreground">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="font-medium text-primary">
                  {Math.round(progressPct)}% complete
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <Card className="p-6 md:p-8">
              <p className="text-lg md:text-xl font-semibold leading-relaxed mb-6">
                {currentQuestion.question}
              </p>

              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(v) => !showFeedback && setSelectedAnswer(parseInt(v))}
                disabled={showFeedback}
                className="space-y-3"
              >
                {options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectOption =
                    showFeedback && currentResult?.correctAnswerIndex === index;
                  const isWrongSelected =
                    showFeedback && isSelected && !currentResult?.isCorrect;

                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isCorrectOption
                          ? "border-green-500 bg-green-50 dark:bg-green-950/40"
                          : isWrongSelected
                          ? "border-red-400 bg-red-50 dark:bg-red-950/40"
                          : isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/40 hover:bg-muted/40"
                      }`}
                      onClick={() => !showFeedback && setSelectedAnswer(index)}
                    >
                      <RadioGroupItem value={index.toString()} id={`q-opt-${index}`} />
                      <Label
                        htmlFor={`q-opt-${index}`}
                        className="flex-1 cursor-pointer text-base"
                      >
                        {option}
                      </Label>
                      {isCorrectOption && (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      )}
                      {isWrongSelected && (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </RadioGroup>

              {/* Feedback */}
              {showFeedback && currentResult && (
                <div
                  className={`mt-5 p-4 rounded-xl border ${
                    currentResult.isCorrect
                      ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700"
                      : "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {currentResult.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold mb-1">
                        {currentResult.isCorrect ? "Correct!" : "Not quite right"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentResult.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                {!showFeedback ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null || submitAnswer.isPending}
                    size="lg"
                  >
                    {submitAnswer.isPending ? "Checking..." : "Submit Answer"}
                  </Button>
                ) : (
                  <Button onClick={handleNext} size="lg">
                    {currentIndex < questions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        See Results
                        <Trophy className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* ── RESULTS ────────────────────────────────────────────────────── */}
        {phase === "results" && (
          <div className="space-y-8">
            {/* Score card */}
            <Card
              className={`p-8 text-center border-2 ${
                passed
                  ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20"
                  : "border-amber-400/50 bg-amber-50/50 dark:bg-amber-950/20"
              }`}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  passed
                    ? "bg-green-100 dark:bg-green-900/40"
                    : "bg-amber-100 dark:bg-amber-900/40"
                }`}
              >
                {passed ? (
                  <Trophy className="h-10 w-10 text-green-600 dark:text-green-400" />
                ) : (
                  <RefreshCw className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                )}
              </div>

              <p className="text-5xl font-bold mb-2">
                {score}/{questions.length}
              </p>
              <p className="text-xl font-semibold mb-2">
                {passed ? "Level Assessment Passed!" : "Not Quite There Yet"}
              </p>
              <p className="text-muted-foreground">
                {passed
                  ? `Outstanding! You scored ${score} out of ${questions.length} — you're ready for the next level.`
                  : `You scored ${score} out of ${questions.length}. You need ${PASS_THRESHOLD} to pass. Review the lessons below and try again.`}
              </p>
            </Card>

            {/* Review guidance for failed questions */}
            {!passed && failedQuestions.length > 0 && (
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Review These Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  {failedQuestions.map((r, i) => {
                    const q = questions.find((q) => q.id === r.checkId);
                    if (!q) return null;
                    const opts = JSON.parse(q.options) as string[];
                    return (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-muted/50 border border-border"
                      >
                        <p className="font-medium mb-1">{q.question}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="text-red-500">Your answer: </span>
                          {opts[r.selectedIndex]}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="text-green-600">Correct answer: </span>
                          {opts[r.correctAnswerIndex]}
                        </p>
                        <p className="text-sm text-muted-foreground italic">
                          {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {passed ? (
                <>
                  <Button asChild className="flex-1" size="lg">
                    <Link href="/dashboard">
                      <Trophy className="mr-2 h-4 w-4" />
                      Continue to Next Level
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    asChild
                    className="flex-1"
                    size="lg"
                  >
                    <Link href="/dashboard">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Review Lessons
                    </Link>
                  </Button>
                  <Button onClick={handleRetry} className="flex-1" size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Assessment
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

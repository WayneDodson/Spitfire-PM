import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Lock,
  Sparkles,
  Brain,
  Trophy,
  Crown,
} from "lucide-react";
import { Streamdown } from "streamdown";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { ConfidenceCheck } from "@/components/ConfidenceCheck";
import ShareProgress from "@/components/ShareProgress";
import { BrandedLoader } from "@/components/BrandedLoader";
import { BrainSnapModal } from "@/components/BrainSnapModal";

type LessonPhase = "reading" | "confidence_check" | "reflection" | "complete" | "level_complete";

const REFLECTION_OPTIONS = [
  {
    value: "yes" as const,
    label: "Yes, I could explain this",
    emoji: "💪",
    description: "I understand it well enough to explain it in an interview",
  },
  {
    value: "almost" as const,
    label: "Almost — I need a bit more practice",
    emoji: "🔄",
    description: "I get the main idea but want to revisit this",
  },
  {
    value: "need_more_practice" as const,
    label: "Not yet — I'll review this again",
    emoji: "📚",
    description: "I want to re-read this before moving on",
  },
];

export default function Lesson() {
  const params = useParams();
  const lessonId = parseInt(params.id || "0");
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  const [phase, setPhase] = useState<LessonPhase>("reading");
  const [selectedReflection, setSelectedReflection] = useState<
    "yes" | "almost" | "need_more_practice" | null
  >(null);
  const [reinforcementMessage, setReinforcementMessage] = useState<string | null>(null);

  const { data: lesson, isLoading } = trpc.lessons.getLesson.useQuery({ lessonId });
  const { data: allLessons } = trpc.lessons.getLessonsByLevel.useQuery(
    { levelId: lesson?.levelId || 1 },
    { enabled: !!lesson }
  );
  const { data: allLevels } = trpc.levels.getAll.useQuery();
  const { data: progress, refetch: refetchProgress } = trpc.lessons.getMyLessonProgress.useQuery(
    { levelId: lesson?.levelId || 1 },
    { enabled: !!lesson && isAuthenticated }
  );
  const { data: accessCheck } = trpc.lessons.canAccess.useQuery(
    { lessonId },
    { enabled: isAuthenticated && !!lesson }
  );

  const markComplete = trpc.lessons.markLessonComplete.useMutation();
  const saveReflection = trpc.lessons.saveReflection.useMutation();
  const utils = trpc.useUtils();

  // Brain Snap — fire after 20 minutes of active reading
  const [brainSnapActive, setBrainSnapActive] = useState(false);
  const [brainSnapFiredThisLesson, setBrainSnapFiredThisLesson] = useState(false);
  const { data: brainSnapQuestion, refetch: refetchBrainSnap } = trpc.brainSnap.getRandom.useQuery(
    undefined,
    { enabled: false } // only fetch on demand
  );

  useEffect(() => {
    if (!isAuthenticated || phase !== "reading" || brainSnapFiredThisLesson) return;
    const TWENTY_MINUTES = 20 * 60 * 1000;
    const timer = setTimeout(async () => {
      const result = await refetchBrainSnap();
      if (result.data) {
        setBrainSnapActive(true);
        setBrainSnapFiredThisLesson(true);
      }
    }, TWENTY_MINUTES);
    return () => clearTimeout(timer);
  }, [isAuthenticated, phase, brainSnapFiredThisLesson, lessonId]);

  // Reset phase when lesson changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setPhase("reading");
    setSelectedReflection(null);
    setReinforcementMessage(null);
    setBrainSnapFiredThisLesson(false);
    setBrainSnapActive(false);
  }, [lessonId]);

  // Check if already completed
  const isCompleted = progress?.some((p) => p.lessonId === lessonId && p.completed);
  const hasPassedConfidenceCheck = progress?.some(
    (p) => p.lessonId === lessonId && (p as any).confidenceCheckPassed
  );

  // If already completed, skip straight to complete phase
  useEffect(() => {
    if (isCompleted && phase === "reading") {
      setPhase("complete");
    }
  }, [isCompleted]);

  // Find previous and next lessons
  const currentIndex = allLessons?.findIndex((l) => l.id === lessonId) ?? -1;
  const previousLesson = currentIndex > 0 ? allLessons?.[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < (allLessons?.length || 0) - 1
      ? allLessons?.[currentIndex + 1]
      : null;

  // Check if next lesson is locked — enabled as soon as we know the next lesson
  const { data: nextLessonAccess } = trpc.lessons.canAccess.useQuery(
    { lessonId: nextLesson?.id || 0 },
    { enabled: isAuthenticated && !!nextLesson }
  );

  const handleFinishReading = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to track your progress.");
      return;
    }
    // Mark lesson as viewed/complete
    await markComplete.mutateAsync({ lessonId });
    await refetchProgress();
    setPhase("confidence_check");
  };

  const handleConfidenceCheckPassed = (message: string) => {
    setReinforcementMessage(message);
    utils.lessons.getMyLessonProgress.invalidate();
    setPhase("reflection");
  };

  const handleReflectionSubmit = async () => {
    if (!selectedReflection) return;
    await saveReflection.mutateAsync({ lessonId, response: selectedReflection });
    // Invalidate progress so the next lesson's access check reflects the newly passed check
    await utils.lessons.getMyLessonProgress.invalidate();
    // Navigate forward immediately — don't stop at the "complete" phase
    if (nextLesson) {
      setLocation(`/lesson/${nextLesson.id}`);
    } else {
      // Last lesson in the level — show level complete celebration
      setPhase("level_complete");
      window.scrollTo(0, 0);
    }
  };

  const handleNextLesson = () => {
    if (!nextLesson) {
      setLocation("/dashboard");
      return;
    }
    if (nextLessonAccess && !nextLessonAccess.canAccess) {
      if (nextLessonAccess.reason === "trial_limit") {
        setLocation("/subscription");
      } else if (nextLessonAccess.reason === "subscription_required") {
        setLocation("/subscription");
      } else if (nextLessonAccess.reason === "mastery_lock") {
        toast.error("Complete the confidence check first to unlock the next lesson.");
      }
      return;
    }
    setLocation(`/lesson/${nextLesson.id}`);
  };

  if (isLoading) {
    return <BrandedLoader message="Loading lesson..." />;
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The lesson you're looking for doesn't exist.
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

  // Access denied states
  if (isAuthenticated && accessCheck && !accessCheck.canAccess) {
    const reason = accessCheck.reason;
    const isTrialBlock = reason === "trial_limit" || reason === "trial_expired";
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 max-w-md w-full text-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
            isTrialBlock ? "bg-amber-100 dark:bg-amber-900/30" : "bg-muted"
          }`}>
            {isTrialBlock ? (
              <Crown className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            ) : (
              <Lock className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          {reason === "mastery_lock" ? (
            <>
              <h2 className="text-2xl font-bold">Complete the Previous Lesson First</h2>
              <p className="text-muted-foreground">
                Pass the confidence check on the previous lesson to unlock this one. Mastery-based
                progression means each lesson builds on the last.
              </p>
              {previousLesson && (
                <Button asChild>
                  <Link href={`/lesson/${previousLesson.id}`}>Go to Previous Lesson</Link>
                </Button>
              )}
            </>
          ) : reason === "trial_limit" ? (
            <>
              <h2 className="text-2xl font-bold">You've Reached Your Trial Limit</h2>
              <p className="text-muted-foreground">
                Your free trial includes the first 6 lessons of Level 1. Subscribe to unlock all
                168 lessons across 7 levels and complete your PM journey.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 text-left text-sm space-y-1.5">
                <p className="font-medium">What you unlock with a subscription:</p>
                <p className="text-muted-foreground flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" /> All 7 levels — 168 lessons</p>
                <p className="text-muted-foreground flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" /> 168 Confidence Checks + 35 assessments</p>
                <p className="text-muted-foreground flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" /> PM Readiness Certificate</p>
              </div>
              <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold" onClick={() => setLocation("/subscribe")}>
                <Crown className="mr-2 h-4 w-4" />
                Subscribe to Continue
              </Button>
            </>
          ) : reason === "trial_expired" ? (
            <>
              <h2 className="text-2xl font-bold">Your Free Trial Has Ended</h2>
              <p className="text-muted-foreground">
                Your 7-day free trial is over. Subscribe to continue your PM journey and unlock all
                7 levels.
              </p>
              <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold" onClick={() => setLocation("/subscribe")}>
                <Crown className="mr-2 h-4 w-4" />
                Subscribe to Continue
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Subscription Required</h2>
              <p className="text-muted-foreground">
                This lesson is part of a paid level. Subscribe to unlock full access across all 7
                levels.
              </p>
              <Button className="w-full" onClick={() => setLocation("/subscribe")}>
                See Subscription Plans
              </Button>
            </>
          )}
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  // ── Progress bar dots ──────────────────────────────────────────────────────
  const progressDots = allLessons?.map((l) => {
    const isCurrentLesson = l.id === lessonId;
    const isLessonCompleted = progress?.some((p) => p.lessonId === l.id && p.completed);
    const hasCheck = progress?.some((p) => p.lessonId === l.id && (p as any).confidenceCheckPassed);
    return { id: l.id, isCurrentLesson, isLessonCompleted, hasCheck };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Brain Snap interstitial — fires after 20 minutes of active reading */}
      {brainSnapActive && brainSnapQuestion && (
        <BrainSnapModal
          question={brainSnapQuestion}
          onDismiss={() => setBrainSnapActive(false)}
        />
      )}
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{lesson.estimatedMinutes} min</span>
              </div>

              {phase === "complete" || isCompleted ? (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Completed</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>Lesson {lesson.lessonNumber} of {allLessons?.length || 24}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8 max-w-4xl">
        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <BookOpen className="h-4 w-4" />
            <span>Lesson {lesson.lessonNumber}</span>
            {lesson.partNumber && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                Part {lesson.partNumber === 1 ? "A" : "B"}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{lesson.title}</h1>
          <div className="h-1 w-20 bg-primary rounded-full"></div>
        </div>

        {/* ── PHASE: READING ─────────────────────────────────────────────── */}
        {(phase === "reading" || phase === "complete") && (
          <>
            <Card className="p-8 mb-8">
              <div className="prose prose-slate dark:prose-invert max-w-none lesson-prose prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed prose-li:text-foreground/90 prose-strong:text-foreground">
                <Streamdown>{lesson.content}</Streamdown>
              </div>
            </Card>

            {phase === "reading" && (
              <div className="flex justify-center mb-8">
                <Button
                  size="lg"
                  className="px-10 py-6 text-lg"
                  onClick={handleFinishReading}
                  disabled={markComplete.isPending}
                >
                  {markComplete.isPending ? (
                    "Saving..."
                  ) : (
                    <>
                      <Brain className="mr-2 h-5 w-5" />
                      I've read this — test my understanding
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        {/* ── PHASE: CONFIDENCE CHECK ────────────────────────────────────── */}
        {phase === "confidence_check" && (
          <ConfidenceCheck
            lessonId={lessonId}
            onPassed={handleConfidenceCheckPassed}
          />
        )}

        {/* ── PHASE: REFLECTION ─────────────────────────────────────────── */}
        {phase === "reflection" && (
          <div className="space-y-6">
            {/* Reinforcement message */}
            {reinforcementMessage && (
              <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/30 p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-300 text-lg">
                      {reinforcementMessage}
                    </p>
                    <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                      You've passed the confidence check and unlocked the next lesson.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Reflection prompt */}
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Quick Reflection</h2>
                <p className="text-muted-foreground">
                  If a hiring manager asked you about this topic tomorrow, how confident would you feel?
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {REFLECTION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedReflection(opt.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedReflection === opt.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{opt.emoji}</span>
                      <div>
                        <p className="font-semibold">{opt.label}</p>
                        <p className="text-sm text-muted-foreground">{opt.description}</p>
                      </div>
                      {selectedReflection === opt.value && (
                        <CheckCircle2 className="h-5 w-5 text-primary ml-auto flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={!selectedReflection || saveReflection.isPending}
                onClick={handleReflectionSubmit}
              >
                {saveReflection.isPending ? "Saving..." : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </div>
        )}

        {/* ── PHASE: COMPLETE ────────────────────────────────────────────── */}
        {phase === "complete" && (
          <>
            {/* Completion banner */}
            <Card className="border-primary/30 bg-primary/5 p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg">Lesson Complete</p>
                  <p className="text-muted-foreground text-sm">
                    You've mastered this lesson and unlocked the next one.
                  </p>
                </div>
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 mb-8">
              {previousLesson ? (
                <Button variant="outline" asChild className="flex-1">
                  <Link href={`/lesson/${previousLesson.id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="text-xs text-muted-foreground">Previous</div>
                      <div className="font-medium truncate max-w-[200px]">{previousLesson.title}</div>
                    </div>
                  </Link>
                </Button>
              ) : (
                <div className="flex-1" />
              )}

              {nextLesson ? (
                <Button
                  className="flex-1"
                  onClick={handleNextLesson}
                  disabled={nextLessonAccess?.canAccess === false && nextLessonAccess?.reason === "mastery_lock"}
                >
                  <div className="text-right">
                    <div className="text-xs opacity-90">Next</div>
                    <div className="font-medium truncate max-w-[200px]">{nextLesson.title}</div>
                  </div>
                  {nextLessonAccess?.canAccess === false ? (
                    <Lock className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  )}
                </Button>
              ) : (
                <Button asChild className="flex-1">
                  <Link href="/dashboard">
                    <div className="text-right">
                      <div className="text-xs opacity-90">Level Complete</div>
                      <div className="font-medium">Back to Dashboard</div>
                    </div>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </>
        )}

        {/* ── PHASE: LEVEL COMPLETE ─────────────────────────────────────── */}
        {phase === "level_complete" && (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-8">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
              <Trophy className="h-12 w-12 text-green-400" />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-green-400">Level Complete!</h2>
              <p className="text-xl text-muted-foreground max-w-md">
                You've completed all lessons in{" "}
                <span className="font-bold text-foreground">
                  {allLevels?.find((l) => l.id === lesson?.levelId)?.title || "this level"}
                </span>
                .
              </p>
              <p className="text-muted-foreground text-sm">
                Your progress has been saved. Ready to take on the next challenge?
              </p>
            </div>
            {/* Share progress */}
            <div className="w-full max-w-md">
              <ShareProgress
                context="level-complete"
                achievement={`Just completed ${allLevels?.find((l) => l.id === lesson?.levelId)?.title || "a level"} on Spitfire PM — one step closer to my first PM role!`}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              {(() => {
                const currentLevel = allLevels?.find((l) => l.id === lesson?.levelId);
                const nextLevel = allLevels?.find((l) => l.orderIndex === (currentLevel?.orderIndex || 0) + 1);
                if (nextLevel) {
                  return (
                    <Button
                      size="lg"
                      className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold"
                      onClick={() => setLocation(`/level/${nextLevel.id}`)}
                    >
                      <ArrowRight className="mr-2 h-5 w-5" />
                      Start Level {nextLevel.orderIndex}
                    </Button>
                  );
                }
                return null;
              })()}
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() => setLocation("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
        {/* Progress bar */}
        {progressDots && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Level Progress</span>
              <span className="text-sm text-muted-foreground">
                {progress?.filter((p) => p.completed).length || 0} / {allLessons?.length || 24}{" "}
                lessons
              </span>
            </div>
            <div className="flex gap-0.5">
              {progressDots.map((dot) => (
                <div
                  key={dot.id}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    dot.isCurrentLesson
                      ? "bg-primary"
                      : dot.hasCheck
                      ? "bg-green-500"
                      : dot.isLessonCompleted
                      ? "bg-primary/40"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-1.5 bg-green-500 rounded-full" />
                Mastered
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-1.5 bg-primary/40 rounded-full" />
                Read
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-1.5 bg-primary rounded-full" />
                Current
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

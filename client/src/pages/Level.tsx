import { useParams, useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, PlayCircle, Lock, Trophy, Brain } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Level() {
  const params = useParams();
  const levelId = parseInt(params.id || "1");
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  const { data: levels } = trpc.levels.getAll.useQuery();
  const { data: lessons, isLoading } = trpc.lessons.getLessonsByLevel.useQuery({ levelId });
  const { data: progress } = trpc.lessons.getMyLessonProgress.useQuery(
    { levelId },
    { enabled: isAuthenticated }
  );

  const level = levels?.find((l) => l.id === levelId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (!level || !lessons) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Level Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The level you're looking for doesn't exist.
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

  const completedLessons = progress?.filter((p) => p.completed).length || 0;
  const totalLessons = lessons.length;
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-50">
        <div className="container py-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Level Header */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <BookOpen className="h-4 w-4" />
              <span>Level {level.orderIndex}</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{level.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{level.description}</p>

            {/* Progress Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>
                  {completedLessons} of {totalLessons} lessons completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lessons List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Lessons</h2>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-green-500" /> Mastered</span>
                <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-primary/40" /> Read</span>
                <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Locked</span>
              </div>
            </div>
            {lessons.map((lesson, idx) => {
              const isCompleted = progress?.some((p) => p.lessonId === lesson.id && p.completed);
              const hasMastery = progress?.some((p) => p.lessonId === lesson.id && (p as any).confidenceCheckPassed);
              // First lesson always unlocked; others require previous mastery
              const prevLesson = idx > 0 ? lessons[idx - 1] : null;
              const prevMastered = !prevLesson || progress?.some((p) => p.lessonId === prevLesson.id && (p as any).confidenceCheckPassed);
              const isLocked = !isCompleted && !prevMastered;

              return (
                <Card
                  key={lesson.id}
                  className={`transition-shadow ${
                    isLocked
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:shadow-md cursor-pointer"
                  }`}
                  onClick={() => !isLocked && setLocation(`/lesson/${lesson.id}`)}
                >
                  <CardHeader className="py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold flex-shrink-0 ${
                          hasMastery
                            ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                            : isCompleted
                            ? "bg-primary/20 text-primary"
                            : isLocked
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary"
                        }`}>
                          {hasMastery ? <CheckCircle2 className="h-4 w-4" /> : isLocked ? <Lock className="h-4 w-4" /> : lesson.lessonNumber}
                        </div>
                        <div>
                          <p className="font-semibold text-base leading-tight">{lesson.title}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {lesson.estimatedMinutes} min
                            </span>
                            {lesson.partNumber && (
                              <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">Part {lesson.partNumber === 1 ? 'A' : 'B'}</span>
                            )}
                            {hasMastery && (
                              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <Brain className="h-3 w-3" /> Mastered
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {!isLocked && (
                        <Button size="sm" variant={hasMastery ? "outline" : "default"} className="flex-shrink-0">
                          {hasMastery ? (
                            <><BookOpen className="mr-1.5 h-3.5 w-3.5" />Review</>
                          ) : isCompleted ? (
                            <><Brain className="mr-1.5 h-3.5 w-3.5" />Check</>  
                          ) : (
                            <><PlayCircle className="mr-1.5 h-3.5 w-3.5" />Start</>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Confidence Check notice */}
          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Mastery-Based Progression
              </CardTitle>
              <CardDescription>
                Each lesson has a Confidence Check. You must pass it to unlock the next lesson.
                This ensures you genuinely understand each concept before building on it.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Level Assessment CTA — shows when all lessons are mastered */}
          {(() => {
            const masteredCount = progress?.filter((p) => (p as any).confidenceCheckPassed).length || 0;
            const allMastered = masteredCount >= totalLessons && totalLessons > 0;
            return allMastered ? (
              <Card className="mt-8 border-primary/50 bg-gradient-to-br from-primary/10 to-accent/10">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-primary" />
                    All Lessons Mastered!
                  </CardTitle>
                  <CardDescription className="text-base">
                    You've passed every confidence check in Level {levelId}. Take the 5-question
                    Level Assessment to prove your knowledge and unlock the next level.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href={`/level/${levelId}/assessment`}>
                      <Trophy className="mr-2 h-4 w-4" />
                      Take Level {levelId} Assessment
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : null;
          })()}

          {/* Practice Scenarios - Shows after completing all lessons */}
          {levelId === 1 && progressPercent === 100 && (
            <Card className="mt-8 border-green-500/50 bg-green-50 dark:bg-green-950">
              <CardHeader>
                <CardTitle className="text-lg">🎯 Practice Scenarios</CardTitle>
                <CardDescription>
                  Congratulations on completing all 12 lessons! Now apply what you've learned through realistic project scenarios:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start h-auto py-4">
                  <Link href="/scenarios">
                    <div className="text-left">
                      <div className="font-semibold">Healthcare: Hospital Ward Commissioning</div>
                      <div className="text-sm text-muted-foreground">Manage a complex healthcare infrastructure project</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start h-auto py-4">
                  <Link href="/scenarios">
                    <div className="text-left">
                      <div className="font-semibold">Construction: House Renovation</div>
                      <div className="text-sm text-muted-foreground">Navigate stakeholder conflicts and budget constraints</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start h-auto py-4">
                  <Link href="/scenarios">
                    <div className="text-left">
                      <div className="font-semibold">Tech: Website Refresh Project</div>
                      <div className="text-sm text-muted-foreground">Lead an agile software development project</div>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

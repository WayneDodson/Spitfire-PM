import { useParams, useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, PlayCircle } from "lucide-react";
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
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Lessons</h2>
            {lessons.map((lesson) => {
              const isCompleted = progress?.some((p) => p.lessonId === lesson.id && p.completed);

              return (
                <Card
                  key={lesson.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setLocation(`/lesson/${lesson.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                            {lesson.lessonNumber}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{lesson.title}</CardTitle>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{lesson.estimatedMinutes} min</span>
                              </div>
                              {isCompleted && (
                                <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span>Completed</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        {isCompleted ? (
                          <>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Review
                          </>
                        ) : (
                          <>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Knowledge Checks Notice */}
          {levelId === 1 && (
            <Card className="mt-8 border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">📝 Knowledge Checks</CardTitle>
                <CardDescription>
                  This level includes 2 knowledge checks to test your understanding:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Knowledge Check 1: After Lesson 6</li>
                    <li>Knowledge Check 2: After Lesson 12</li>
                  </ul>
                </CardDescription>
              </CardHeader>
            </Card>
          )}

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

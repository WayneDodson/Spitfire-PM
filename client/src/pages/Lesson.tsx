import { useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, BookOpen } from "lucide-react";
import { Streamdown } from "streamdown";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { KnowledgeCheck } from "@/components/KnowledgeCheck";
import { useState } from "react";

export default function Lesson() {
  const params = useParams();
  const lessonId = parseInt(params.id || "0");
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [showKnowledgeCheck, setShowKnowledgeCheck] = useState(false);


  const { data: lesson, isLoading } = trpc.lessons.getLesson.useQuery({ lessonId });
  const { data: allLessons } = trpc.lessons.getLessonsByLevel.useQuery(
    { levelId: lesson?.levelId || 1 },
    { enabled: !!lesson }
  );
  const { data: progress } = trpc.lessons.getMyLessonProgress.useQuery(
    { levelId: lesson?.levelId || 1 },
    { enabled: !!lesson && isAuthenticated }
  );

  const markComplete = trpc.lessons.markLessonComplete.useMutation({
    onSuccess: () => {
      toast.success("Lesson completed!", {
        description: "Great job! Keep up the momentum.",
      });
    },
  });

  const utils = trpc.useUtils();

  const handleMarkComplete = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in", {
        description: "You need to be logged in to track your progress.",
      });
      return;
    }

    await markComplete.mutateAsync({ lessonId });
    utils.lessons.getMyLessonProgress.invalidate();
  };

  const isCompleted = progress?.some((p) => p.lessonId === lessonId && p.completed);

  // Find previous and next lessons
  const currentIndex = allLessons?.findIndex((l) => l.id === lessonId) ?? -1;
  const previousLesson = currentIndex > 0 ? allLessons?.[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < (allLessons?.length || 0) - 1 
    ? allLessons?.[currentIndex + 1] 
    : null;

  // Scroll to top when lesson changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setShowKnowledgeCheck(false);
  }, [lessonId]);

  // Check if this lesson should show a knowledge check
  const shouldShowKnowledgeCheck = lesson?.lessonNumber === 6 || lesson?.lessonNumber === 12;
  const hasKnowledgeCheck = shouldShowKnowledgeCheck && isCompleted;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{lesson.estimatedMinutes} min</span>
              </div>
              
              {isCompleted ? (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Completed</span>
                </div>
              ) : (
                <Button
                  onClick={handleMarkComplete}
                  disabled={markComplete.isPending}
                  size="sm"
                >
                  {markComplete.isPending ? "Marking..." : "Mark Complete"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="container py-8 max-w-4xl">
        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <BookOpen className="h-4 w-4" />
            <span>Lesson {lesson.lessonNumber}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{lesson.title}</h1>
          <div className="h-1 w-20 bg-primary rounded-full"></div>
        </div>

        {/* Lesson Content - Markdown Rendered */}
        <Card className="p-8 mb-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <Streamdown>{lesson.content}</Streamdown>
          </div>
        </Card>

        {/* Knowledge Check - Shows after completing lessons 6 or 12 */}
        {hasKnowledgeCheck && !showKnowledgeCheck && (
          <Card className="mb-8 border-primary/50 bg-primary/5">
            <CardContent className="py-6 text-center">
              <h3 className="text-lg font-bold mb-2">📝 Time for a Knowledge Check!</h3>
              <p className="text-muted-foreground mb-4">
                Test your understanding before moving to the next lesson.
              </p>
              <Button onClick={() => setShowKnowledgeCheck(true)}>Start Knowledge Check</Button>
            </CardContent>
          </Card>
        )}

        {showKnowledgeCheck && shouldShowKnowledgeCheck && lesson && (
          <KnowledgeCheck
            levelId={lesson.levelId}
            afterLessonNumber={lesson.lessonNumber}
            onComplete={() => {
              setShowKnowledgeCheck(false);
              toast.success("Knowledge check completed! You can now continue.");
            }}
          />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          {previousLesson ? (
            <Button variant="outline" asChild className="flex-1">
              <Link href={`/lesson/${previousLesson.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">Previous</div>
                  <div className="font-medium">{previousLesson.title}</div>
                </div>
              </Link>
            </Button>
          ) : (
            <div className="flex-1"></div>
          )}

          {nextLesson ? (
            <Button asChild className="flex-1">
              <Link href={`/lesson/${nextLesson.id}`}>
                <div className="text-right">
                  <div className="text-xs opacity-90">Next</div>
                  <div className="font-medium">{nextLesson.title}</div>
                </div>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                <div className="text-right">
                  <div className="text-xs opacity-90">Finish</div>
                  <div className="font-medium">Back to Dashboard</div>
                </div>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Lesson Progress Indicator */}
        {allLessons && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Level Progress</span>
              <span className="text-sm text-muted-foreground">
                {progress?.filter((p) => p.completed).length || 0} / {allLessons.length} lessons
              </span>
            </div>
            <div className="flex gap-1">
              {allLessons.map((l) => {
                const isCurrentLesson = l.id === lessonId;
                const isLessonCompleted = progress?.some((p) => p.lessonId === l.id && p.completed);
                
                return (
                  <div
                    key={l.id}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      isCurrentLesson
                        ? "bg-primary"
                        : isLessonCompleted
                        ? "bg-green-500"
                        : "bg-muted"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

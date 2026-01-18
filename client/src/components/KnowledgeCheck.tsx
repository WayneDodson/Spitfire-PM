import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface KnowledgeCheckProps {
  levelId: number;
  afterLessonNumber: number;
  onComplete: () => void;
}

export function KnowledgeCheck({ levelId, afterLessonNumber, onComplete }: KnowledgeCheckProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctAnswerIndex: number;
    explanation: string;
  } | null>(null);

  const { data: questions, isLoading } = trpc.knowledgeChecks.getByLesson.useQuery({
    levelId,
    afterLessonNumber,
  });

  const submitAnswer = trpc.knowledgeChecks.submitAnswer.useMutation({
    onSuccess: (data) => {
      setFeedback(data);
      setShowFeedback(true);
      if (data.isCorrect) {
        toast.success("Correct!");
      } else {
        toast.error("Incorrect");
      }
    },
  });

  if (isLoading) {
    return (
      <Card className="my-8">
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading knowledge check...</p>
        </CardContent>
      </Card>
    );
  }

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const options = JSON.parse(currentQuestion.options) as string[];

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer");
      return;
    }

    submitAnswer.mutate({
      checkId: currentQuestion.id,
      selectedAnswerIndex: selectedAnswer,
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setFeedback(null);
    }
  };

  return (
    <Card className="my-8 border-primary/50 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          <CardTitle>Knowledge Check {afterLessonNumber === 6 ? "1" : "2"}</CardTitle>
        </div>
        <CardDescription>
          Question {currentQuestionIndex + 1} of {questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>

          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            disabled={showFeedback}
          >
            {options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = feedback?.correctAnswerIndex === index;
              const showCorrect = showFeedback && isCorrectAnswer;
              const showIncorrect = showFeedback && isSelected && !feedback?.isCorrect;

              return (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-colors ${
                    showCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : showIncorrect
                      ? "border-red-500 bg-red-50 dark:bg-red-950"
                      : isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                  {showCorrect && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                  {showIncorrect && <XCircle className="h-5 w-5 text-red-600" />}
                </div>
              );
            })}
          </RadioGroup>
        </div>

        {showFeedback && feedback && (
          <div
            className={`p-4 rounded-lg ${
              feedback.isCorrect
                ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-start gap-2">
              {feedback.isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium mb-1">
                  {feedback.isCorrect ? "Correct!" : "Not quite right"}
                </p>
                <p className="text-sm text-muted-foreground">{feedback.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          {!showFeedback ? (
            <Button onClick={handleSubmit} disabled={selectedAnswer === null || submitAnswer.isPending}>
              {submitAnswer.isPending ? "Submitting..." : "Submit Answer"}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {isLastQuestion ? "Continue to Next Lesson" : "Next Question"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

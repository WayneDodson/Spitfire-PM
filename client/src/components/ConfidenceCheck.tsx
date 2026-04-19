import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Brain, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ConfidenceCheckProps {
  lessonId: number;
  /** Called when the user answers correctly — receives the reinforcement message */
  onPassed: (reinforcementMessage: string) => void;
}

const DEFAULT_REINFORCEMENT = "Excellent work! You've demonstrated real understanding.";

const RETRY_MESSAGES = [
  "That's not quite right — but every attempt builds your knowledge. Give it another go!",
  "Not there yet, but you're thinking like a PM. Review the explanation and try again.",
  "Close! Read the explanation carefully — the answer is in there. You've got this.",
];

export function ConfidenceCheck({ lessonId, onPassed }: ConfidenceCheckProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>("");
  const [reinforcementMessage, setReinforcementMessage] = useState<string>("");
  const [attemptCount, setAttemptCount] = useState(0);

  const { data: check, isLoading } = trpc.knowledgeChecks.getByLessonId.useQuery({ lessonId });

  const submitAnswer = trpc.knowledgeChecks.submitAnswer.useMutation({
    onSuccess: (data) => {
      setIsCorrect(data.isCorrect);
      setCorrectAnswerIndex(data.correctAnswerIndex);
      setExplanation(data.explanation);
      setReinforcementMessage(
        (data as any).reinforcementMessage || DEFAULT_REINFORCEMENT
      );
      setShowFeedback(true);
      setAttemptCount((c) => c + 1);
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer first.");
      return;
    }
    if (!check) return;

    submitAnswer.mutate({
      checkId: check.id,
      selectedAnswerIndex: selectedAnswer,
      lessonId,
    });
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setCorrectAnswerIndex(null);
    setExplanation("");
  };

  const handleContinue = () => {
    onPassed(reinforcementMessage || DEFAULT_REINFORCEMENT);
  };

  if (isLoading) {
    return (
      <Card className="my-8">
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground mt-4">Loading confidence check...</p>
        </CardContent>
      </Card>
    );
  }

  // No confidence check for this lesson — skip straight to passed
  if (!check) {
    onPassed(DEFAULT_REINFORCEMENT);
    return null;
  }

  const options = JSON.parse(check.options) as string[];
  const retryMessage = RETRY_MESSAGES[Math.min(attemptCount, RETRY_MESSAGES.length - 1)];

  return (
    <Card className="my-8 border-primary/40 bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Confidence Check</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Answer correctly to unlock the next lesson
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Question */}
        <div>
          <p className="text-lg font-medium leading-relaxed mb-5">{check.question}</p>

          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(v) => !showFeedback && setSelectedAnswer(parseInt(v))}
            disabled={showFeedback}
          >
            {options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = showFeedback && correctAnswerIndex === index;
              const isWrongSelected = showFeedback && isSelected && !isCorrect;

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
                  <RadioGroupItem value={index.toString()} id={`opt-${index}`} />
                  <Label
                    htmlFor={`opt-${index}`}
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
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`p-5 rounded-xl border ${
              isCorrect
                ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700"
                : "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700"
            }`}
          >
            {isCorrect ? (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-300">
                    {reinforcementMessage || DEFAULT_REINFORCEMENT}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    {explanation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-300">
                    {retryMessage}
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    {explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {!showFeedback ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null || submitAnswer.isPending}
              size="lg"
            >
              {submitAnswer.isPending ? "Checking..." : "Submit Answer"}
            </Button>
          ) : isCorrect ? (
            <Button onClick={handleContinue} size="lg">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Continue
            </Button>
          ) : (
            <Button onClick={handleRetry} variant="outline" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

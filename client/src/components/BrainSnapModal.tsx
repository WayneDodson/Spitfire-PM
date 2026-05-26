import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle2, XCircle, ArrowRight, Lightbulb } from "lucide-react";

interface BrainSnapQuestion {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  topicTag?: string | null;
}

interface BrainSnapModalProps {
  question: BrainSnapQuestion;
  onDismiss: () => void;
}

/**
 * BrainSnapModal — a two-phase interstitial:
 * Phase 1: Show the question and multiple-choice options.
 * Phase 2: Reveal the correct answer with an explanation, then let the user continue.
 */
export function BrainSnapModal({ question, onDismiss }: BrainSnapModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const logSeen = trpc.brainSnap.logSeen.useMutation();

  const handleSelect = (optionId: string) => {
    if (revealed) return;
    setSelected(optionId);
  };

  const handleReveal = () => {
    if (!selected) return;
    const correct = selected === question.correctOptionId;
    logSeen.mutate({ questionId: question.id, answeredCorrectly: correct });
    setRevealed(true);
  };

  const isCorrect = selected === question.correctOptionId;

  return (
    /* Full-screen overlay */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 border-b border-border px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Brain Snap</p>
            <p className="text-sm text-muted-foreground">Quick thinking challenge — then back to your lesson</p>
          </div>
          {question.topicTag && (
            <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
              {question.topicTag.replace(/_/g, " ")}
            </span>
          )}
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Question */}
          <p className="text-base font-semibold text-foreground leading-relaxed">
            {question.question}
          </p>

          {/* Options */}
          <div className="space-y-2">
            {question.options.map((opt) => {
              const isSelected = selected === opt.id;
              const isCorrectOpt = opt.id === question.correctOptionId;

              let optionClass =
                "w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-200 ";

              if (!revealed) {
                optionClass += isSelected
                  ? "border-primary bg-primary/10 text-foreground font-medium"
                  : "border-border bg-background hover:border-primary/50 hover:bg-primary/5 text-foreground cursor-pointer";
              } else {
                if (isCorrectOpt) {
                  optionClass += "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-medium";
                } else if (isSelected && !isCorrectOpt) {
                  optionClass += "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
                } else {
                  optionClass += "border-border bg-background text-muted-foreground opacity-60";
                }
              }

              return (
                <button
                  key={opt.id}
                  className={optionClass}
                  onClick={() => handleSelect(opt.id)}
                  disabled={revealed}
                >
                  <span className="flex items-center gap-3">
                    <span className="font-bold text-primary/70 w-4 flex-shrink-0">{opt.id}.</span>
                    <span>{opt.text}</span>
                    {revealed && isCorrectOpt && (
                      <CheckCircle2 className="ml-auto h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                    {revealed && isSelected && !isCorrectOpt && (
                      <XCircle className="ml-auto h-4 w-4 text-red-500 flex-shrink-0" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Result + Explanation (shown after reveal) */}
          {revealed && (
            <div
              className={`rounded-xl border p-4 space-y-2 ${
                isCorrect
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-amber-500/30 bg-amber-500/5"
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0" />
                )}
                <p className={`font-semibold text-sm ${isCorrect ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                  {isCorrect ? "Correct — great thinking!" : "Not quite — here's why:"}
                </p>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            {!revealed ? (
              <Button
                className="flex-1"
                onClick={handleReveal}
                disabled={!selected}
              >
                Reveal Answer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button className="flex-1" onClick={onDismiss}>
                Continue Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

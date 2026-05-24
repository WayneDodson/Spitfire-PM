import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  BookOpen,
  HelpCircle,
  Loader2,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Tab = "study" | "terms" | "quiz";

export default function ApmModule() {
  const { qualId, moduleId } = useParams<{ qualId: string; moduleId: string }>();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const [activeTab, setActiveTab] = useState<Tab>("study");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const utils = trpc.useUtils();

  const { data: module, isLoading } = trpc.apm.getModule.useQuery(
    { moduleId },
    { enabled: isAuthenticated && !!moduleId }
  );

  const saveProgress = trpc.apm.saveProgress.useMutation({
    onSuccess: () => {
      utils.apm.getModule.invalidate({ moduleId });
      utils.apm.getModulesByQualification.invalidate({ qualificationId: qualId });
      utils.apm.getQualifications.invalidate();
    },
  });

  const handleSubmitQuiz = () => {
    if (!module) return;
    const quiz = module.quiz;
    const allAnswered = quiz.every((_, i) => selectedAnswers[i] !== undefined);
    if (!allAnswered) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    const correct = quiz.filter((q, i) => selectedAnswers[i] === q.ans).length;
    setScore(correct);
    setSubmitted(true);

    saveProgress.mutate({
      moduleId,
      qualificationId: qualId,
      score: correct,
      totalQuestions: quiz.length,
    });
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#080e1a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-[#080e1a] flex items-center justify-center text-white/50">
        Module not found.
      </div>
    );
  }

  const passed = score !== null ? score / module.quiz.length >= 0.55 : false;
  const pct = score !== null ? Math.round((score / module.quiz.length) * 100) : null;
  const alreadyPassed = module.progress?.passed ?? false;

  return (
    <div className="min-h-screen bg-[#080e1a] text-white">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div>
          <button
            onClick={() => setLocation(`/qualification-prep/${qualId}`)}
            className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to modules
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                Module {module.moduleNumber} · {module.duration}
              </p>
              <h1 className="text-3xl font-black">{module.title}</h1>
            </div>
            {alreadyPassed && (
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-1.5 flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-semibold">Passed</span>
              </div>
            )}
          </div>

          {module.intro && (
            <p className="text-white/60 mt-3 leading-relaxed">{module.intro}</p>
          )}
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-white/10">
          {(["study", "terms", "quiz"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              {tab === "study" && <BookOpen className="h-4 w-4 inline mr-1.5 -mt-0.5" />}
              {tab === "terms" && <BookOpen className="h-4 w-4 inline mr-1.5 -mt-0.5" />}
              {tab === "quiz" && <HelpCircle className="h-4 w-4 inline mr-1.5 -mt-0.5" />}
              {tab === "study" ? "Study Content" : tab === "terms" ? `Key Terms (${module.terms.length})` : `Practice Quiz (${module.quiz.length} Qs)`}
            </button>
          ))}
        </div>

        {/* Study tab */}
        {activeTab === "study" && (
          <div className="space-y-8">
            {module.sections.map((section, i) => (
              <div key={i} className="space-y-3">
                <h2 className="text-xl font-bold text-white">{section.heading}</h2>
                <div className="text-white/70 leading-relaxed whitespace-pre-line text-[0.95rem]">
                  {section.body}
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <p className="text-white/40 text-sm">
                Ready to test your knowledge?
              </p>
              <Button
                onClick={() => setActiveTab("quiz")}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              >
                Take the Quiz
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Terms tab */}
        {activeTab === "terms" && (
          <div className="space-y-3">
            {module.terms.length === 0 && (
              <p className="text-white/40 text-sm">No key terms for this module.</p>
            )}
            {module.terms.map((term, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-4"
              >
                <p className="font-semibold text-cyan-300 mb-1">{term.t}</p>
                <p className="text-white/60 text-sm leading-relaxed">{term.d}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quiz tab */}
        {activeTab === "quiz" && (
          <div className="space-y-6">
            {/* Result banner */}
            {submitted && score !== null && (
              <div
                className={`rounded-xl p-5 border ${
                  passed
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {passed ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-400" />
                  )}
                  <div>
                    <p className={`font-bold text-lg ${passed ? "text-emerald-300" : "text-red-300"}`}>
                      {passed ? "Passed!" : "Not yet — keep going"}
                    </p>
                    <p className="text-white/50 text-sm">
                      {score} / {module.quiz.length} correct ({pct}%)
                      {!passed && " — 55% required to pass"}
                    </p>
                  </div>
                </div>
                <Progress
                  value={pct ?? 0}
                  className={`h-2 bg-white/10 ${passed ? "[&>div]:bg-emerald-400" : "[&>div]:bg-red-400"}`}
                />
                {!passed && (
                  <p className="text-white/50 text-sm mt-3">
                    Review the study content and key terms, then try again.
                  </p>
                )}
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={handleRetry}
                    className="border-white/20 text-white/60 hover:text-white bg-transparent"
                  >
                    <RotateCcw className="h-4 w-4 mr-1.5" />
                    Retry Quiz
                  </Button>
                  {passed && (
                    <Button
                      onClick={() => setLocation(`/qualification-prep/${qualId}`)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      Back to Modules
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Questions */}
            {module.quiz.map((q, qi) => {
              const selected = selectedAnswers[qi];
              const isCorrect = submitted ? selected === q.ans : null;

              return (
                <div
                  key={qi}
                  className={`bg-white/[0.03] border rounded-xl p-5 space-y-4 ${
                    submitted
                      ? isCorrect
                        ? "border-emerald-500/30"
                        : "border-red-500/30"
                      : "border-white/10"
                  }`}
                >
                  <p className="font-semibold text-white leading-snug">
                    <span className="text-white/40 mr-2">{qi + 1}.</span>
                    {q.q}
                  </p>
                  <div className="space-y-2">
                    {q.opts.map((opt, oi) => {
                      const isSelected = selected === oi;
                      const isAnswer = q.ans === oi;

                      let optClass =
                        "w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ";

                      if (!submitted) {
                        optClass += isSelected
                          ? "border-cyan-400/60 bg-cyan-400/10 text-white"
                          : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:text-white";
                      } else {
                        if (isAnswer) {
                          optClass += "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
                        } else if (isSelected && !isAnswer) {
                          optClass += "border-red-500/50 bg-red-500/10 text-red-300";
                        } else {
                          optClass += "border-white/10 bg-white/[0.02] text-white/40";
                        }
                      }

                      return (
                        <button
                          key={oi}
                          disabled={submitted}
                          onClick={() =>
                            !submitted &&
                            setSelectedAnswers((prev) => ({ ...prev, [qi]: oi }))
                          }
                          className={optClass}
                        >
                          <span className="font-mono text-white/40 mr-2">
                            {String.fromCharCode(65 + oi)}.
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <p className="text-xs text-white/40">
                      {isCorrect ? (
                        <span className="text-emerald-400">✓ Correct</span>
                      ) : (
                        <span className="text-red-400">
                          ✗ Incorrect — correct answer:{" "}
                          <span className="text-white/60">
                            {String.fromCharCode(65 + q.ans)}. {q.opts[q.ans]}
                          </span>
                        </span>
                      )}
                    </p>
                  )}
                </div>
              );
            })}

            {!submitted && (
              <Button
                onClick={handleSubmitQuiz}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3"
                disabled={Object.keys(selectedAnswers).length < module.quiz.length}
              >
                Submit Answers
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

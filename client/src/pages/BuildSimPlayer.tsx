import { useState, useEffect } from "react";
import { useVoiceTranscription, VoiceState } from "@/hooks/useVoiceTranscription";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { BrandedLoader } from "@/components/BrandedLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ShareProgress from "@/components/ShareProgress";
import { Streamdown } from "streamdown";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  RotateCcw,
  BookOpen,
  Mic,
  MicOff,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ─── mic button ──────────────────────────────────────────────────────────────

function MicButton({ state, onClick }: { state: VoiceState; onClick: () => void }) {
  const isRecording = state === "recording";
  const isTranscribing = state === "transcribing";
  const isDone = state === "done";
  const isError = state === "error";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isTranscribing}
      title={
        isRecording
          ? "Stop recording"
          : isTranscribing
          ? "Transcribing…"
          : isDone
          ? "Transcribed — click to record again"
          : isError
          ? "Error — click to retry"
          : "Click to speak your answer"
      }
      className={[
        "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border transition-all duration-200",
        isRecording
          ? "bg-red-500 border-red-500 text-white animate-pulse shadow-md shadow-red-500/30"
          : isTranscribing
          ? "bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-950/30 dark:border-amber-700 dark:text-amber-400 cursor-not-allowed"
          : isDone
          ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-700 dark:text-emerald-400"
          : isError
          ? "bg-red-100 border-red-300 text-red-700 dark:bg-red-950/30 dark:border-red-700 dark:text-red-400"
          : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-accent hover:border-primary/50",
      ].join(" ")}
    >
      {isTranscribing ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : isRecording ? (
        <MicOff className="h-3 w-3" />
      ) : (
        <Mic className="h-3 w-3" />
      )}
      {isRecording
        ? "Stop"
        : isTranscribing
        ? "Transcribing…"
        : isDone
        ? "Done"
        : isError
        ? "Retry"
        : "Speak"}
    </button>
  );
}

// ─── types ───────────────────────────────────────────────────────────────────

interface BuildField {
  id: string;
  label: string;
  type: "text" | "textarea";
  placeholder?: string;
}

interface BuildContent {
  projectBrief: string;
  documentType: string;
  fields: BuildField[];
  rubricFields: string;
}

// ─── component ───────────────────────────────────────────────────────────────

export default function BuildSimPlayer() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const { state: micState, toggleRecording } = useVoiceTranscription({
    onTranscript: (text) =>
      setFieldValues((prev) => ({
        ...prev,
        [activeFieldId ?? ""]: prev[activeFieldId ?? ""] ? `${prev[activeFieldId ?? ""]} ${text}` : text,
      })),
    onError: (msg) => setMicError(msg),
  });

  function handleMicClick(fieldId: string) {
    setActiveFieldId(fieldId);
    setMicError(null);
    toggleRecording();
  }

  const simId = parseInt(params.id ?? "0", 10);

  const { data: simData, isLoading } = trpc.simulations.get.useQuery(
    { id: simId },
    { enabled: !!simId }
  );

  const startMutation = trpc.simulations.start.useMutation();
  const completeMutation = trpc.simulations.complete.useMutation();
  const reviewMutation = trpc.simulations.reviewBuildDoc.useMutation();

  useEffect(() => {
    if (simData && isAuthenticated) {
      startMutation.mutate({ simulationId: simId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simData?.id, isAuthenticated]);

  // content is stored as a JSON string in the DB — parse it before use
  const content: BuildContent | undefined = (() => {
    if (!simData?.content) return undefined;
    try {
      return typeof simData.content === "string"
        ? (JSON.parse(simData.content) as BuildContent)
        : (simData.content as unknown as BuildContent);
    } catch {
      return undefined;
    }
  })();

  function setField(id: string, value: string) {
    setFieldValues((prev) => ({ ...prev, [id]: value }));
  }

  const allFilled = content?.fields.every((f) => (fieldValues[f.id] ?? "").trim().length > 0) ?? false;

  async function handleSubmit() {
    if (!content || !allFilled) return;
    setSubmitted(true);
    setLoadingFeedback(true);
    try {
      const documentText = content.fields
        .map((f) => `${f.label}:\n${fieldValues[f.id] ?? ""}`)
        .join("\n\n");
      const result = await reviewMutation.mutateAsync({
        simulationId: simId,
        documentType: content.documentType,
        projectBrief: content.projectBrief,
        documentText,
        rubricFields: content.rubricFields,
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

  if (isLoading) return <BrandedLoader message="Loading build simulation..." />;
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
          <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <FileText className="h-3 w-3" />
            Build Sim
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {completed ? (
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
            <h2 className="text-2xl font-bold">Document Submitted</h2>
            {score !== null && (
              <p className="text-4xl font-bold text-primary">{score}%</p>
            )}
            <p className="text-muted-foreground">
              {(score ?? 0) >= 80
                ? "Excellent document — professional quality and complete."
                : (score ?? 0) >= 60
                ? "Good effort. Review the feedback to improve your document."
                : "Keep practising — document skills improve with repetition."}
            </p>
            <ShareProgress
              achievement={`I just built a ${content.documentType} in Spitfire PM — "${simData.title}"`}
            />
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setLocation(`/simulations?completed=${simId}`)} className="gap-1">
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
            {/* Project brief */}
            <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardContent className="pt-4 flex gap-3">
                <BookOpen className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Project Brief</p>
                  <p className="text-sm text-foreground leading-relaxed">{content.projectBrief}</p>
                </div>
              </CardContent>
            </Card>

            {/* Document type header */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Complete: {content.documentType}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fill in all sections below. The AI coach will review your document against professional PM standards.
              </p>
            </div>

            {/* Fields */}
            {!submitted && (
              <div className="space-y-5">
                {content.fields.map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor={field.id} className="text-sm font-medium">
                        {field.label}
                      </Label>
                      {field.type === "textarea" && (
                        <MicButton
                          state={activeFieldId === field.id ? micState : "idle"}
                          onClick={() => handleMicClick(field.id)}
                        />
                      )}
                    </div>
                    {micError && activeFieldId === field.id && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {micError}
                      </p>
                    )}
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.id}
                        value={fieldValues[field.id] ?? ""}
                        onChange={(e) => setField(field.id, e.target.value)}
                        placeholder={field.placeholder ?? "Type your answer, or click \"Speak\" to record."}
                        className="min-h-24 resize-y"
                      />
                    ) : (
                      <Input
                        id={field.id}
                        value={fieldValues[field.id] ?? ""}
                        onChange={(e) => setField(field.id, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}

                {!allFilled && (
                  <p className="text-xs text-muted-foreground">
                    Complete all sections to submit for AI review.
                  </p>
                )}

                <Button
                  disabled={!allFilled}
                  onClick={handleSubmit}
                  className="w-full"
                >
                  Submit for AI Review
                </Button>
              </div>
            )}

            {/* Review */}
            {submitted && (
              <div className="space-y-4">
                {/* Submitted document */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">
                      Your {content.documentType}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {content.fields.map((field) => (
                      <div key={field.id}>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                          {field.label}
                        </p>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {fieldValues[field.id] || "—"}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {loadingFeedback ? (
                  <Card>
                    <CardContent className="pt-4 text-sm text-muted-foreground animate-pulse">
                      AI coach is reviewing your document...
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
                    <Card className="border-emerald-300/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                          AI Coach Review
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

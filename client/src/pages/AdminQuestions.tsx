/**
 * /admin/questions — Admin Question Editor
 *
 * Allows admins to browse and edit:
 *   • Per-lesson confidence check questions (knowledgeChecks, isLevelAssessment=false)
 *   • End-of-level assessment questions (knowledgeChecks, isLevelAssessment=true)
 *   • APM module quiz questions (apmModules.quiz JSON)
 *
 * Access is gated server-side by adminProcedure (role=admin required).
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Pencil,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type KnowledgeCheckQuestion = {
  id: number;
  levelId: number;
  afterLessonNumber: number;
  lessonId: number | null;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  reinforcementMessage?: string | null;
  isLevelAssessment: boolean;
  lessonTitle: string | null;
};

type ApmQuestion = { q: string; opts: string[]; ans: number };

// ─── Inline Question Editor ───────────────────────────────────────────────────

function KcQuestionEditor({
  question,
  onSaved,
  onCancel,
}: {
  question: KnowledgeCheckQuestion;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState(question.question);
  const [opts, setOpts] = useState<string[]>([...question.options]);
  const [correctIdx, setCorrectIdx] = useState(String(question.correctAnswerIndex));
  const [explanation, setExplanation] = useState(question.explanation);
  const [reinforcement, setReinforcement] = useState(question.reinforcementMessage ?? "");

  const updateMutation = trpc.adminQuestions.updateQuestion.useMutation({
    onSuccess: () => {
      toast.success("Question saved");
      onSaved();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSave = () => {
    if (!q.trim() || opts.some((o) => !o.trim())) {
      toast.error("Question and all options are required");
      return;
    }
    updateMutation.mutate({
      id: question.id,
      question: q.trim(),
      options: opts.map((o) => o.trim()),
      correctAnswerIndex: Number(correctIdx),
      explanation: explanation.trim(),
      reinforcementMessage: reinforcement.trim() || undefined,
    });
  };

  return (
    <div className="space-y-4 p-4 bg-accent/30 rounded-lg border border-border">
      <div className="space-y-2">
        <Label>Question</Label>
        <Textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Answer Options</Label>
        {opts.map((opt, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                Number(correctIdx) === i
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <Input
              value={opt}
              onChange={(e) => {
                const next = [...opts];
                next[i] = e.target.value;
                setOpts(next);
              }}
              className="flex-1"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Correct Answer</Label>
        <Select value={correctIdx} onValueChange={setCorrectIdx}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {opts.map((opt, i) => (
              <SelectItem key={i} value={String(i)}>
                {String.fromCharCode(65 + i)}: {opt.slice(0, 40)}{opt.length > 40 ? "…" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Explanation (shown after answering)</Label>
        <Textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Reinforcement Message <span className="text-muted-foreground text-xs">(optional — shown on correct)</span></Label>
        <Input
          value={reinforcement}
          onChange={(e) => setReinforcement(e.target.value)}
          placeholder="e.g. Great work! You've mastered this concept."
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving…" : "Save Question"}
        </Button>
      </div>
    </div>
  );
}

// ─── APM Question Editor ──────────────────────────────────────────────────────

function ApmQuestionEditor({
  moduleId,
  questionIndex,
  question,
  onSaved,
  onCancel,
}: {
  moduleId: string;
  questionIndex: number;
  question: ApmQuestion;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState(question.q);
  const [opts, setOpts] = useState<string[]>([...question.opts]);
  const [ans, setAns] = useState(String(question.ans));

  const updateMutation = trpc.adminQuestions.updateApmQuestion.useMutation({
    onSuccess: () => {
      toast.success("Question saved");
      onSaved();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSave = () => {
    if (!q.trim() || opts.some((o) => !o.trim())) {
      toast.error("Question and all options are required");
      return;
    }
    updateMutation.mutate({
      moduleId,
      questionIndex,
      q: q.trim(),
      opts: opts.map((o) => o.trim()),
      ans: Number(ans),
    });
  };

  return (
    <div className="space-y-4 p-4 bg-accent/30 rounded-lg border border-border">
      <div className="space-y-2">
        <Label>Question</Label>
        <Textarea value={q} onChange={(e) => setQ(e.target.value)} rows={3} className="resize-none" />
      </div>

      <div className="space-y-2">
        <Label>Answer Options</Label>
        {opts.map((opt, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                Number(ans) === i ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <Input
              value={opt}
              onChange={(e) => {
                const next = [...opts];
                next[i] = e.target.value;
                setOpts(next);
              }}
              className="flex-1"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Correct Answer</Label>
        <Select value={ans} onValueChange={setAns}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {opts.map((opt: string, i: number) => (
              <SelectItem key={i} value={String(i)}>
                {String.fromCharCode(65 + i)}: {opt.slice(0, 40)}{opt.length > 40 ? "…" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving…" : "Save Question"}
        </Button>
      </div>
    </div>
  );
}

// ─── Level Questions Panel ────────────────────────────────────────────────────

function LevelQuestionsPanel({ levelId, levelTitle }: { levelId: number; levelTitle: string }) {
  const [filter, setFilter] = useState<"all" | "lesson" | "assessment">("all");
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: questions, refetch, isLoading } = trpc.adminQuestions.getQuestionsForLevel.useQuery(
    { levelId, type: filter },
    { enabled: !!levelId }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        Loading questions…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{levelTitle}</h2>
          <p className="text-sm text-muted-foreground">{questions?.length ?? 0} questions</p>
        </div>
        <div className="flex gap-2">
          {(["all", "lesson", "assessment"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f === "all" ? "All" : f === "lesson" ? "Confidence Checks" : "Assessments"}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {questions?.map((q) => (
          <Card key={q.id} className="border-border">
            <CardContent className="p-4 space-y-3">
              {editingId === q.id ? (
                <KcQuestionEditor
                  question={q}
                  onSaved={() => { setEditingId(null); refetch(); }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant={q.isLevelAssessment ? "default" : "secondary"} className="text-xs">
                          {q.isLevelAssessment ? "Assessment" : `Lesson ${q.afterLessonNumber}`}
                        </Badge>
                        {q.lessonTitle && (
                          <span className="text-xs text-muted-foreground truncate max-w-xs">
                            {q.lessonTitle}
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-sm leading-snug">{q.question}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(q.id)}
                      className="flex-shrink-0"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {q.options.map((opt: string, i: number) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                          i === q.correctAnswerIndex
                            ? "bg-green-500/10 border border-green-500/30 text-green-400"
                            : "bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <span className="font-bold text-xs w-4 flex-shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {i === q.correctAnswerIndex && (
                          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-500" />
                        )}
                        <span className="truncate">{opt}</span>
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <p className="text-xs text-muted-foreground italic border-l-2 border-border pl-3">
                      {q.explanation}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── APM Module Questions Panel ───────────────────────────────────────────────

function ApmModulePanel({ moduleId, moduleTitle }: { moduleId: string; moduleTitle: string }) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const { data, refetch, isLoading } = trpc.adminQuestions.getApmModuleQuestions.useQuery(
    { moduleId },
    { enabled: !!moduleId }
  );

  if (isLoading) {
    return <div className="flex items-center justify-center h-40 text-muted-foreground">Loading…</div>;
  }
  if (!data) {
    return <div className="text-muted-foreground p-4">Module not found.</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">{moduleTitle}</h2>
        <p className="text-sm text-muted-foreground">{data.questions.length} quiz questions</p>
      </div>

      <div className="space-y-3">
        {data.questions.map((q, idx) => (
          <Card key={idx} className="border-border">
            <CardContent className="p-4 space-y-3">
              {editingIdx === idx ? (
                <ApmQuestionEditor
                  moduleId={moduleId}
                  questionIndex={idx}
                  question={q}
                  onSaved={() => { setEditingIdx(null); refetch(); }}
                  onCancel={() => setEditingIdx(null)}
                />
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <Badge variant="outline" className="text-xs mb-1">Q{idx + 1}</Badge>
                      <p className="font-medium text-sm leading-snug">{q.q}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingIdx(idx)}
                      className="flex-shrink-0"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {q.opts.map((opt, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                          i === q.ans
                            ? "bg-green-500/10 border border-green-500/30 text-green-400"
                            : "bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <span className="font-bold text-xs w-4 flex-shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {i === q.ans && <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-500" />}
                        <span className="truncate">{opt}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminQuestions() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedQualId, setSelectedQualId] = useState<string | null>(null);

  const { data: levelSummary } = trpc.adminQuestions.getLevelSummary.useQuery();
  const { data: apmSummary } = trpc.adminQuestions.getApmSummary.useQuery();
  const { data: apmModules } = trpc.adminQuestions.getApmModules.useQuery(
    { qualificationId: selectedQualId! },
    { enabled: !!selectedQualId }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!user || (user as any).role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <p className="text-lg font-semibold">Admin access required</p>
          <Button onClick={() => setLocation("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const selectedLevel = levelSummary?.find((l) => l.id === selectedLevelId);
  const selectedModule = apmModules?.find((m) => m.id === selectedModuleId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/admin")}
            className="text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Admin
          </Button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">Question Editor</span>
          <Badge variant="outline" className="ml-auto text-xs">
            {(levelSummary?.reduce((a, l) => a + l.perLessonCount + l.assessmentCount, 0) ?? 0) +
              (apmSummary?.reduce((a, q) => a + q.moduleCount, 0) ?? 0)} total questions
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="levels">
          <TabsList className="mb-6">
            <TabsTrigger value="levels" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Learning Levels
            </TabsTrigger>
            <TabsTrigger value="apm" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              APM Qualification Prep
            </TabsTrigger>
          </TabsList>

          {/* ── Levels Tab ── */}
          <TabsContent value="levels">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
              {/* Sidebar */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">
                  Select Level
                </p>
                {levelSummary?.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevelId(level.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedLevelId === level.id
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-card border-border hover:bg-accent/50 text-foreground"
                    }`}
                  >
                    <div className="font-medium text-sm">{level.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex gap-3">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {level.perLessonCount} checks
                      </span>
                      <span className="flex items-center gap-1">
                        <ClipboardList className="h-3 w-3" />
                        {level.assessmentCount} assessment
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Main content */}
              <div>
                {selectedLevelId && selectedLevel ? (
                  <LevelQuestionsPanel
                    levelId={selectedLevelId}
                    levelTitle={selectedLevel.title}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground space-y-3">
                    <BookOpen className="h-12 w-12 opacity-30" />
                    <p>Select a level from the sidebar to view and edit its questions</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ── APM Tab ── */}
          <TabsContent value="apm">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
              {/* Sidebar */}
              <div className="space-y-4">
                {apmSummary?.map((qual) => (
                  <div key={qual.id}>
                    <button
                      onClick={() => {
                        setSelectedQualId(qual.id);
                        setSelectedModuleId(null);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors mb-2 ${
                        selectedQualId === qual.id
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-card border-border hover:bg-accent/50 text-foreground"
                      }`}
                    >
                      <div className="font-semibold text-sm">{qual.title}</div>
                      <div className="text-xs text-muted-foreground">{qual.moduleCount} modules</div>
                    </button>

                    {selectedQualId === qual.id && apmModules && (
                      <div className="ml-3 space-y-1">
                        {apmModules.map((mod) => (
                          <button
                            key={mod.id}
                            onClick={() => setSelectedModuleId(mod.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedModuleId === mod.id
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            }`}
                          >
                            <span className="font-medium">Module {mod.moduleNumber}</span>
                            <span className="ml-2 text-xs truncate">{mod.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div>
                {selectedModuleId && selectedModule ? (
                  <ApmModulePanel moduleId={selectedModuleId} moduleTitle={selectedModule.title} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground space-y-3">
                    <GraduationCap className="h-12 w-12 opacity-30" />
                    <p>Select a qualification and module from the sidebar</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

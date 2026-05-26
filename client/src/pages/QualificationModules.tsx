import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Shield,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  BookOpen,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { BrandedLoader } from "@/components/BrandedLoader";

const QUAL_META: Record<
  string,
  {
    label: string;
    level: string;
    color: string;
    borderColor: string;
    bgColor: string;
    icon: React.ReactNode;
  }
> = {
  pfq: {
    label: "PFQ — Project Fundamentals Qualification",
    level: "Foundation",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/[0.04]",
    icon: <Award className="h-6 w-6 text-emerald-400" />,
  },
  pmq: {
    label: "PMQ — Project Management Qualification",
    level: "Practitioner",
    color: "text-blue-400",
    borderColor: "border-blue-500/20",
    bgColor: "bg-blue-500/[0.04]",
    icon: <Shield className="h-6 w-6 text-blue-400" />,
  },
};

export default function QualificationModules() {
  const { qualId } = useParams<{ qualId: string }>();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: modules, isLoading } = trpc.apm.getModulesByQualification.useQuery(
    { qualificationId: qualId },
    { enabled: isAuthenticated && !!qualId }
  );

  const meta = QUAL_META[qualId] ?? QUAL_META.pfq;

  if (authLoading || isLoading) {
    return <BrandedLoader />;
  }

  const passedCount = modules?.filter((m) => m.progress?.passed).length ?? 0;
  const totalCount = modules?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#080e1a] text-white">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div>
          <button
            onClick={() => setLocation("/qualification-prep")}
            className="flex items-center gap-1.5 text-foreground/40 hover:text-white text-sm mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Qualification Prep
          </button>

          <div className={`${meta.bgColor} border ${meta.borderColor} rounded-2xl p-6 flex items-start gap-4`}>
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
              {meta.icon}
            </div>
            <div className="flex-1">
              <div className={`text-xs ${meta.color} uppercase tracking-widest mb-1`}>
                {meta.level}
              </div>
              <h1 className="text-2xl font-black">{meta.label}</h1>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-foreground/40 mb-1.5">
                  <span>Overall Progress</span>
                  <span>{passedCount} / {totalCount} modules passed</span>
                </div>
                <Progress
                  value={totalCount > 0 ? (passedCount / totalCount) * 100 : 0}
                  className={`h-1.5 bg-white/10 ${qualId === "pfq" ? "[&>div]:bg-emerald-400" : "[&>div]:bg-blue-400"}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Module list */}
        <div className="space-y-3">
          {modules?.map((module) => {
            const passed = module.progress?.passed ?? false;
            const attempted = (module.progress?.attempts ?? 0) > 0;
            const bestScore = module.progress?.bestScore ?? 0;
            const pct = attempted ? Math.round((bestScore / module.quizCount) * 100) : null;

            return (
              <div
                key={module.id}
                className={`bg-muted/60 border rounded-xl p-5 flex items-center gap-4 cursor-pointer transition-all hover:border-border/70 ${
                  passed ? "border-emerald-500/30" : "border-border"
                }`}
                onClick={() => setLocation(`/qualification-prep/${qualId}/${module.id}`)}
              >
                {/* Module number */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-lg ${
                    passed
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-white/5 text-foreground/40"
                  }`}
                >
                  {passed ? <CheckCircle2 className="h-5 w-5" /> : module.moduleNumber}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{module.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {module.duration && (
                      <span className="flex items-center gap-1 text-xs text-foreground/40">
                        <Clock className="h-3 w-3" />
                        {module.duration}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-foreground/40">
                      <HelpCircle className="h-3 w-3" />
                      {module.quizCount} quiz questions
                    </span>
                    {module.termCount > 0 && (
                      <span className="flex items-center gap-1 text-xs text-foreground/40">
                        <BookOpen className="h-3 w-3" />
                        {module.termCount} key terms
                      </span>
                    )}
                  </div>
                  {attempted && pct !== null && (
                    <p className="text-xs mt-1.5 text-foreground/30">
                      Best score: {pct}%{" "}
                      {passed ? (
                        <span className="text-emerald-400">— Passed</span>
                      ) : (
                        <span className="text-amber-400">— Not yet passed (55% required)</span>
                      )}
                    </p>
                  )}
                </div>

                <ChevronRight className="h-4 w-4 text-foreground/20 flex-shrink-0" />
              </div>
            );
          })}
        </div>

        {passedCount === totalCount && totalCount > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <p className="font-bold text-emerald-300">All modules passed!</p>
            <p className="text-foreground/50 text-sm mt-1">
              You've completed all {totalCount} modules for this qualification. You're ready to
              book your exam.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

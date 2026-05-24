import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
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
} from "lucide-react";

export default function QualificationPrep() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: qualifications, isLoading } = trpc.apm.getQualifications.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#080e1a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  const pfq = qualifications?.find((q) => q.id === "pfq");
  const pmq = qualifications?.find((q) => q.id === "pmq");

  return (
    <div className="min-h-screen bg-[#080e1a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Header */}
        <div>
          <button
            onClick={() => setLocation("/dashboard")}
            className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-black mb-2">Qualification Prep</h1>
          <p className="text-white/50 text-lg">
            Study for APM professional qualifications with full module content, key terms, and
            practice quizzes. These qualifications are internationally recognised and complement
            your practical PM skills.
          </p>
        </div>

        {/* What are APM qualifications */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-3">About APM Qualifications</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            The Association for Project Management (APM) is the UK's chartered body for the project
            management profession. The PFQ (Project Fundamentals Qualification) is the entry-level
            certification, while the PMQ (Project Management Qualification) demonstrates
            practitioner-level competence. Both are widely recognised by UK employers and complement
            the practical skills you're building through the Spitfire PM simulation path.
          </p>
        </div>

        {/* Qualification cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* PFQ */}
          <div className="bg-emerald-500/[0.04] border border-emerald-500/20 rounded-2xl p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs text-emerald-400/70 uppercase tracking-widest mb-1">
                  Foundation Level
                </div>
                <h2 className="text-xl font-black text-emerald-100">PFQ</h2>
                <p className="text-white/50 text-sm">Project Fundamentals Qualification</p>
              </div>
            </div>

            <p className="text-white/60 text-sm leading-relaxed">
              {pfq?.description ??
                "The entry-level APM qualification covering project management principles, terminology, and core techniques."}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.03] rounded-lg p-3 text-center">
                <div className="text-xl font-black text-emerald-300">{pfq?.moduleCount ?? 4}</div>
                <div className="text-xs text-white/40 mt-0.5">Modules</div>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-3 text-center">
                <div className="text-xl font-black text-emerald-300">~{pfq?.estimatedHours ?? 12}h</div>
                <div className="text-xs text-white/40 mt-0.5">Study Time</div>
              </div>
            </div>

            {pfq && pfq.moduleCount > 0 && (
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-1.5">
                  <span>Progress</span>
                  <span>{pfq.passedModules} / {pfq.moduleCount} modules passed</span>
                </div>
                <Progress
                  value={(pfq.passedModules / pfq.moduleCount) * 100}
                  className="h-1.5 bg-white/10 [&>div]:bg-emerald-400"
                />
              </div>
            )}

            <Button
              onClick={() => setLocation("/qualification-prep/pfq")}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              {pfq && pfq.passedModules > 0 ? "Continue Studying" : "Start PFQ"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* PMQ */}
          <div className="bg-blue-500/[0.04] border border-blue-500/20 rounded-2xl p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-blue-400/70 uppercase tracking-widest mb-1">
                  Practitioner Level
                </div>
                <h2 className="text-xl font-black text-blue-100">PMQ</h2>
                <p className="text-white/50 text-sm">Project Management Qualification</p>
              </div>
            </div>

            <p className="text-white/60 text-sm leading-relaxed">
              {pmq?.description ??
                "The practitioner-level APM qualification requiring deeper understanding and application of project management concepts."}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.03] rounded-lg p-3 text-center">
                <div className="text-xl font-black text-blue-300">{pmq?.moduleCount ?? 4}</div>
                <div className="text-xs text-white/40 mt-0.5">Modules</div>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-3 text-center">
                <div className="text-xl font-black text-blue-300">~{pmq?.estimatedHours ?? 20}h</div>
                <div className="text-xs text-white/40 mt-0.5">Study Time</div>
              </div>
            </div>

            {pmq && pmq.moduleCount > 0 && (
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-1.5">
                  <span>Progress</span>
                  <span>{pmq.passedModules} / {pmq.moduleCount} modules passed</span>
                </div>
                <Progress
                  value={(pmq.passedModules / pmq.moduleCount) * 100}
                  className="h-1.5 bg-white/10 [&>div]:bg-blue-400"
                />
              </div>
            )}

            <Button
              onClick={() => setLocation("/qualification-prep/pmq")}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold"
            >
              {pmq && pmq.passedModules > 0 ? "Continue Studying" : "Start PMQ"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* How it works */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold">How Qualification Prep Works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: <BookOpen className="h-5 w-5 text-cyan-400" />,
                title: "Study the Module",
                desc: "Read through structured content covering all examinable topics with clear explanations.",
              },
              {
                icon: <CheckCircle2 className="h-5 w-5 text-cyan-400" />,
                title: "Review Key Terms",
                desc: "Each module includes a glossary of essential terms you need to know for the exam.",
              },
              {
                icon: <Clock className="h-5 w-5 text-cyan-400" />,
                title: "Take the Practice Quiz",
                desc: "Test your knowledge with exam-style questions. Pass at 55% to mark the module complete.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-2"
              >
                <div className="w-8 h-8 bg-cyan-400/10 rounded-lg flex items-center justify-center">
                  {step.icon}
                </div>
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="text-white/50 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

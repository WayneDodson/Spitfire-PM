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
  Route,
  ClipboardCheck,
  X,
  Download,
} from "lucide-react";
import { useState } from "react";
import { generateFullQuestionBankPDF } from "@/lib/generateFullQuestionBankPDF";

// ─────────────────────────────────────────────
// Register Interest Modal (pure UI, no backend)
// ─────────────────────────────────────────────
function RegisterInterestModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    qualification: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.qualification) return;
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md bg-[#0d1626] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black text-white">You're on the list.</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              We'll be in touch with early access details. In the meantime, sign in if you already
              have an account.
            </p>
            <Button
              onClick={onClose}
              className="mt-2 bg-white/10 hover:bg-white/20 text-white border-0"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-black text-white mb-1">Register your interest</h2>
            <p className="text-white/40 text-sm mb-6">
              We'll let you know when enrolment opens.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="Your first name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-400/50 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-400/50 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1.5">
                  Which qualification are you working towards?
                </label>
                <select
                  required
                  value={form.qualification}
                  onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors text-sm appearance-none"
                >
                  <option value="" disabled className="bg-[#0d1626]">
                    Select an option
                  </option>
                  <option value="pfq" className="bg-[#0d1626]">
                    PFQ — Project Fundamentals Qualification
                  </option>
                  <option value="pmq" className="bg-[#0d1626]">
                    PMQ — Project Management Qualification
                  </option>
                  <option value="unsure" className="bg-[#0d1626]">
                    Not sure yet
                  </option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-3 mt-2"
              >
                Register Interest
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Pre-login landing page
// ─────────────────────────────────────────────
function ApmLanding() {
  const [, setLocation] = useLocation();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {modalOpen && <RegisterInterestModal onClose={() => setModalOpen(false)} />}

      <div
        className="h-screen w-full flex flex-col overflow-hidden"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(6,182,212,0.12) 0%, transparent 70%), #080e1a",
        }}
      >
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 md:px-12 pt-7 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/manus-storage/spitfire-pm-logo_8b0682d2.png"
              alt="Spitfire PM"
              className="h-10 w-auto object-contain"
            />
            <span className="text-white/50 text-sm font-medium">APM Academy</span>
          </div>
          <Button
            onClick={() => setLocation("/login")}
            variant="outline"
            className="border-white/20 text-white/70 hover:text-white hover:border-white/40 bg-transparent text-sm px-5"
          >
            Sign In
          </Button>
        </header>

        {/* Hero — centred, takes remaining space */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-300 text-xs font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            APM Accredited Study Platform
          </div>

          {/* Headline */}
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] tracking-tight">
              Advance your career.
              <br />
              <span className="text-cyan-400">Earn your APM qualification.</span>
            </h1>
            <p className="text-white/50 text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed">
              The structured path from ambition to a recognised project management credential.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              onClick={() => setLocation("/login")}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-8 py-3 text-base h-auto"
            >
              Sign In
            </Button>
            <Button
              onClick={() => setModalOpen(true)}
              variant="outline"
              className="border-white/20 text-white/70 hover:text-white hover:border-white/40 bg-transparent px-8 py-3 text-base h-auto"
            >
              Register Interest
            </Button>
          </div>

          {/* 3-icon value row */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 mt-2">
            {[
              {
                icon: <Route className="h-5 w-5 text-cyan-400" />,
                label: "PFQ → PMQ pathway",
              },
              {
                icon: <Clock className="h-5 w-5 text-cyan-400" />,
                label: "Study at your pace",
              },
              {
                icon: <ClipboardCheck className="h-5 w-5 text-cyan-400" />,
                label: "Exam-ready assessments",
              },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                  {icon}
                </div>
                <span className="text-white/50 text-xs font-medium tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 pb-6 text-center">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} Spitfire PM · APM Qualification Prep
          </p>
        </footer>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Post-login content (unchanged)
// ─────────────────────────────────────────────
function AuthenticatedQualificationPrep() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const [pdfLoading, setPdfLoading] = useState(false);
  const utils = trpc.useUtils();

  const { data: qualifications, isLoading } = trpc.apm.getQualifications.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  async function handleDownloadFullPDF() {
    setPdfLoading(true);
    try {
      const data = await utils.adminQuestions.getAllQuestionsForPDF.fetch();
      generateFullQuestionBankPDF({
        userName: user?.displayName ?? undefined,
        levelSections: data.levelSections,
        qualSections: data.qualSections,
      });
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setPdfLoading(false);
    }
  }

  if (isLoading) {
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
            practice quizzes.
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

        {/* Full Question Bank Download */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-cyan-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Download className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Full Question Bank PDF</h3>
              <p className="text-white/50 text-sm mt-0.5">
                Download every question &amp; answer from all levels, PFQ and PMQ modules in one printable PDF.
              </p>
            </div>
          </div>
          <Button
            onClick={handleDownloadFullPDF}
            disabled={pdfLoading}
            className="flex-shrink-0 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6"
          >
            {pdfLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" />Generating…</>
            ) : (
              <><Download className="h-4 w-4 mr-2" />Download PDF</>
            )}
          </Button>
        </div>
        {/* How it works */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold">How Qualification Prep Works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: <BookOpen className="h-5 w-5 text-cyan-400" />,
                title: "Study the Module",
                desc: "Read through structured content covering all examinable topics.",
              },
              {
                icon: <CheckCircle2 className="h-5 w-5 text-cyan-400" />,
                title: "Review Key Terms",
                desc: "Each module includes a glossary of essential terms for the exam.",
              },
              {
                icon: <Clock className="h-5 w-5 text-cyan-400" />,
                title: "Take the Practice Quiz",
                desc: "Exam-style questions. Pass at 55% to mark the module complete.",
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

// ─────────────────────────────────────────────
// Root export — gate on auth
// ─────────────────────────────────────────────
export default function QualificationPrep() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen bg-[#080e1a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <ApmLanding />;
  }

  return <AuthenticatedQualificationPrep />;
}

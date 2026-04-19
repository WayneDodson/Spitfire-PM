import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Shield,
  Star,
  ChevronRight,
  Briefcase,
  Target,
  Award,
  Clock,
  Building2,
  UserCheck,
  BarChart3,
  Zap,
} from "lucide-react";

const OUTCOMES = [
  { icon: Briefcase, label: "Job offer secured" },
  { icon: TrendingUp, label: "Salary increase" },
  { icon: Award, label: "Internal promotion" },
  { icon: UserCheck, label: "Interview confidence" },
  { icon: Target, label: "Career transition" },
  { icon: BarChart3, label: "PM readiness proven" },
];

const TRUST_SIGNALS = [
  "Built for UK career changers",
  "Aligned to PRINCE2, Agile & APM standards",
  "Used by NHS, care sector & corporate teams",
  "B2B workforce development ready",
];

const SIMULATION_TYPES = [
  {
    title: "Stakeholder Conflict",
    description:
      "Navigate competing priorities between sponsors, teams and clients. Learn to manage up, down and sideways.",
    tag: "High Impact",
    tagColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  },
  {
    title: "Risk & Crisis Management",
    description:
      "A key supplier drops out two weeks before go-live. What do you do? Real decisions, real consequences.",
    tag: "Interview Favourite",
    tagColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
  {
    title: "Scope Creep & Change Control",
    description:
      "The client keeps adding requirements. Budget is fixed. Practice the conversations that protect your project.",
    tag: "Common Scenario",
    tagColor: "text-green-400 bg-green-400/10 border-green-400/20",
  },
  {
    title: "Prioritisation Under Pressure",
    description:
      "Three critical tasks, one afternoon, two team members off sick. Triage, decide, and justify your choices.",
    tag: "Confidence Builder",
    tagColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  },
];

const PSYCHOLOGY_MOMENTS = [
  "You can do this.",
  "See? You just passed that challenge.",
  "30% of people fail this section — keep going.",
  "You're closer than you think.",
  "Confidence comes from repetition.",
  "You're building proof, not just knowledge.",
  "Future employers want this thinking.",
];

const WHO_ITS_FOR = [
  { role: "NHS & Healthcare Staff", detail: "Coordinators, band 5–7 moving into project roles" },
  { role: "Care Sector Professionals", detail: "Team leaders and managers seeking PM credentials" },
  { role: "Administrators & Coordinators", detail: "Already doing PM work — now prove it formally" },
  { role: "Internal Promotions", detail: "Staff being considered for PM progression" },
  { role: "Career Changers", detail: "Any professional making the transition into PM" },
  { role: "Certification Holders", detail: "Google PM, PRINCE2, Agile, APM — ready to perform" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#080c14] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080c14]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">PM Simulate</span>
            <span className="hidden sm:inline text-xs text-cyan-400 border border-cyan-400/30 rounded-full px-2 py-0.5 font-medium">
              UK Career Transition
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button
                size="sm"
                onClick={() => setLocation("/dashboard")}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
              >
                Dashboard <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setLocation("/login")}
                  className="text-white/70 hover:text-white"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => setLocation("/login")}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-400 text-sm font-medium mb-8">
            <Zap className="h-3.5 w-3.5" />
            The final step between learning and getting hired
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Completed the courses?
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Now prove you&apos;re ready.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-4 leading-relaxed">
            Training teaches theory. Simulation proves readiness.
          </p>
          <p className="text-lg text-white/40 max-w-2xl mx-auto mb-10">
            The UK&apos;s leading platform for career changers, NHS professionals, and internal candidates
            preparing for their first PM role — or their next one.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={() => setLocation("/login")}
              className="text-lg px-8 py-6 bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/20"
            >
              Start Proving Readiness — Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/login")}
              className="text-lg px-8 py-6 border-white/20 text-white hover:bg-white/5"
            >
              See How It Works
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {OUTCOMES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60"
              >
                <Icon className="h-3.5 w-3.5 text-cyan-400" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-white/5 bg-white/[0.02] py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {TRUST_SIGNALS.map((signal) => (
            <div key={signal} className="flex items-center gap-2 text-sm text-white/50">
              <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0" />
              {signal}
            </div>
          ))}
        </div>
      </section>

      {/* The problem */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-4">
                The real problem
              </p>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                &ldquo;I&apos;ve studied the theory.
                <br />
                <span className="text-white/40">But how do I prove</span>
                <br />
                I&apos;m ready for the role?&rdquo;
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                You&apos;ve done the Google PM course. Maybe PRINCE2. Perhaps a Level 4 or 5 qualification.
                You understand the frameworks. But when the interview panel asks{" "}
                <em>&ldquo;Tell me about a time you managed a difficult stakeholder&hellip;&rdquo;</em> — you freeze.
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                PM Simulate bridges that gap. Real scenarios. Real decisions. Real confidence built
                through repetition — not revision.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { before: "I hope I’m ready", after: "I know I can do this" },
                { before: "I’ve studied the theory", after: "I’ve performed under pressure" },
                { before: "I’m not sure I can answer that", after: "I’ve answered it 20 times" },
              ].map(({ before, after }) => (
                <div key={before} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-full px-2 py-0.5">
                      Before
                    </span>
                    <span className="text-white/40 text-sm">{before}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-2 py-0.5">
                      After
                    </span>
                    <span className="text-white font-medium text-sm">{after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Simulations */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">
              What you&apos;ll practise
            </p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Stop studying. Start performing.
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Every simulation mirrors a real situation you&apos;ll face in the role — and in the interview.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SIMULATION_TYPES.map((sim) => (
              <div
                key={sim.title}
                className="bg-[#0d1420] border border-white/10 rounded-2xl p-6 hover:border-cyan-400/30 transition-colors group"
              >
                <div className={`text-xs font-medium border rounded-full px-2.5 py-1 inline-block mb-4 ${sim.tagColor}`}>
                  {sim.tag}
                </div>
                <h3 className="font-bold text-lg mb-3 group-hover:text-cyan-400 transition-colors">
                  {sim.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{sim.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Psychology */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Built for confidence
            </p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              A mentor, not just a test engine.
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Positive reinforcement, momentum tracking, and emotional support baked into every step.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {PSYCHOLOGY_MOMENTS.map((msg) => (
              <div
                key={msg}
                className="bg-gradient-to-br from-cyan-500/5 to-blue-600/5 border border-cyan-400/15 rounded-xl px-5 py-4 text-white/70 text-sm italic"
              >
                &ldquo;{msg}&rdquo;
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: BarChart3,
                title: "Confidence Score",
                desc: "Tracks your psychological readiness as you progress through simulations.",
              },
              {
                icon: Target,
                title: "Interview Readiness Tracker",
                desc: "Know exactly how prepared you are before you walk into the room.",
              },
              {
                icon: Zap,
                title: "Streak & Momentum",
                desc: "Daily practice builds habits. Habits build confidence. Confidence gets jobs.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-cyan-400/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Who it&apos;s for
            </p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Built for real career changers.
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Not students. Not graduates. Professionals who&apos;ve already done the hard work and need to
              prove it.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHO_ITS_FOR.map(({ role, detail }) => (
              <div
                key={role}
                className="bg-[#0d1420] border border-white/10 rounded-xl p-5 flex gap-4 items-start"
              >
                <div className="w-8 h-8 bg-cyan-400/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">{role}</p>
                  <p className="text-white/50 text-sm">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-cyan-400" />
                <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">
                  For organisations
                </p>
              </div>
              <h2 className="text-4xl font-black leading-tight mb-6">
                Prepare your workforce
                <br />
                for PM progression.
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                Identify which staff are genuinely ready for project management responsibilities.
                Reduce costly mis-hires. Build internal PM capability with measurable readiness scores.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Objective readiness assessment for internal candidates",
                  "Structured progression pathway aligned to your PM framework",
                  "Confidence and competency reporting for line managers",
                  "Suitable for NHS, local government, housing, and corporate teams",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/60 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:support@spitfireitsolutions.com?subject=B2B%20Enquiry%20%E2%80%94%20Spitfire%20PM"
                className="inline-flex items-center gap-2 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/5 transition-colors rounded-md px-4 py-2 text-sm font-medium"
              >
                Enquire about B2B access
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-400/20 rounded-2xl p-8 space-y-5">
              {[
                { icon: Users, label: "Team readiness dashboard" },
                { icon: BarChart3, label: "Individual competency reports" },
                { icon: Shield, label: "Secure, GDPR-compliant data handling" },
                { icon: Star, label: "Aligned to APM, PRINCE2 & Agile" },
                { icon: Clock, label: "Self-paced — fits around shift patterns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-cyan-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <span className="text-white/70 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-cyan-950/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Before your first PM interview&hellip;
            <br />
            <span className="text-cyan-400">prove it.</span>
          </h2>
          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            Level 1 is completely free. No credit card. No commitment. Just real simulations that
            build the confidence you need to get hired.
          </p>
          <Button
            size="lg"
            onClick={() => setLocation("/login")}
            className="text-xl px-10 py-7 bg-cyan-500 hover:bg-cyan-400 text-black font-black shadow-2xl shadow-cyan-500/30"
          >
            Start Proving Readiness — Free
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          <p className="text-white/30 text-sm mt-5">
            No credit card required · Level 1 always free · Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Target className="h-3 w-3 text-white" />
            </div>
            Spitfire PM &middot; UK Career Transition Platform
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-white/30 text-sm">
            <a
              href="mailto:support@spitfireitsolutions.com"
              className="hover:text-cyan-400 transition-colors"
            >
              support@spitfireitsolutions.com
            </a>
            <button onClick={() => setLocation("/login")} className="hover:text-white/60 transition-colors">
              Sign In
            </button>
            <button onClick={() => setLocation("/login")} className="hover:text-white/60 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

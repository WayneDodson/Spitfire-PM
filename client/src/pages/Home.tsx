/**
 * Spitfire PM — Homepage v2 Full Redesign
 *
 * Aesthetic direction: Dark editorial — military precision meets career urgency.
 * Strong typographic contrast, amber/red tension accents alongside cyan,
 * structured grid layouts, and motion-forward reveals.
 *
 * Key improvements over v1:
 * - Consistent "Spitfire PM" brand throughout
 * - "See How It Works" scrolls correctly
 * - Free trial section with clear breakdown
 * - Pricing teaser with 3-tier cards
 * - Social proof / testimonials
 * - Stronger emotional copy arc
 * - Animated hero ticker
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useRef, useState } from "react";
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
  PlayCircle,
  BookOpen,
  Brain,
  Flame,
  Trophy,
  AlertTriangle,
  Share2,
  Menu,
  X,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  "Care Coordinator → Junior PM",
  "Finance Manager → Programme Lead",
  "Teaching Assistant → Agile PM",
  "Care Home Manager → Project Lead",
  "Office Coordinator → PM role secured",
  "Engineer → IT Project Manager",
];

const TRUST_SIGNALS = [
  "Built for career changers worldwide",
  "PRINCE2, Agile & APM aligned",
  "Healthcare & care sector ready",
  "B2B workforce development",
];

const STATS = [
  { value: "7", label: "Structured levels", sub: "from foundation to interview-ready" },
  { value: "100+", label: "Real PM simulations", sub: "consequence-based decisions" },
  { value: "200+", label: "PM terms covered", sub: "in the built-in glossary" },
  { value: "3 mo", label: "To full readiness", sub: "at 2 hours per day" },
];

const BEFORE_AFTER = [
  { before: "I hope I'm ready", after: "I know I can do this" },
  { before: "I've studied the theory", after: "I've performed under pressure" },
  { before: "I freeze in interviews", after: "I've answered it 20 times already" },
  { before: "I can't prove readiness", after: "My confidence score says otherwise" },
];

const SIMULATION_TYPES = [
  {
    title: "Stakeholder Conflict",
    description: "Competing priorities between sponsors, teams and clients. Learn to manage up, down and sideways.",
    tag: "High Impact",
    accent: "from-orange-500/20 to-orange-600/5 border-orange-500/20",
    tagColor: "text-orange-400 bg-orange-400/10",
  },
  {
    title: "Risk & Crisis Management",
    description: "A key supplier drops out two weeks before go-live. Real decisions with real consequences.",
    tag: "Interview Favourite",
    accent: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
    tagColor: "text-blue-400 bg-blue-400/10",
  },
  {
    title: "Scope Creep & Change Control",
    description: "The client keeps adding requirements. Budget is fixed. Practice the conversations that protect your project.",
    tag: "Common Scenario",
    accent: "from-green-500/20 to-green-600/5 border-green-500/20",
    tagColor: "text-green-400 bg-green-400/10",
  },
  {
    title: "Prioritisation Under Pressure",
    description: "Three tasks, one afternoon, two team members off sick. Triage, decide, and justify.",
    tag: "Confidence Builder",
    accent: "from-purple-500/20 to-purple-600/5 border-purple-500/20",
    tagColor: "text-purple-400 bg-purple-400/10",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Start Level 1 — free",
    description: "No card needed. Jump straight into structured lessons and your first simulations.",
    icon: PlayCircle,
  },
  {
    step: "02",
    title: "Complete lessons & quizzes",
    description: "Short, digestible lessons followed by knowledge checks. You can't progress until you understand.",
    icon: BookOpen,
  },
  {
    step: "03",
    title: "Run PM simulations",
    description: "Real-world scenarios. Your decisions have consequences. AI-powered feedback after every simulation.",
    icon: Brain,
  },
  {
    step: "04",
    title: "Track your readiness",
    description: "Your Confidence Score and Interview Readiness tracker show exactly where you stand.",
    icon: BarChart3,
  },
];

const FREE_TRIAL_INCLUDES = [
  { icon: BookOpen, label: "6 foundation lessons", detail: "Bite-sized and built for busy professionals" },
  { icon: Brain, label: "Knowledge checks", detail: "Quiz after each lesson — progress gated by understanding" },
  { icon: PlayCircle, label: "2 live simulations", detail: "Real PM scenarios with consequence-based decisions" },
  { icon: Target, label: "Confidence Score", detail: "See your readiness from day one" },
  { icon: BarChart3, label: "Interview Readiness", detail: "Know where you stand before you subscribe" },
  { icon: Zap, label: "No credit card", detail: "Start now — upgrade only when you're certain" },
];

const WHO_ITS_FOR = [
  { role: "Healthcare & Care Professionals", detail: "Coordinators and care staff moving into project roles" },
  { role: "Care Sector Professionals", detail: "Team leaders and managers seeking PM credentials" },
  { role: "Administrators & Coordinators", detail: "Already doing PM work — now prove it formally" },
  { role: "Internal Promotion Candidates", detail: "Staff being considered for PM progression" },
  { role: "Career Changers", detail: "Any professional making the transition into PM" },
  { role: "Certification Holders", detail: "Google PM, PRINCE2, Agile, APM — ready to perform" },
];

const TESTIMONIALS = [
  {
    quote: "I'd done PRINCE2 and still didn't feel ready for interviews. After two weeks on Spitfire PM I landed my first PM role.",
    name: "Sarah K.",
    role: "Ex-Care Coordinator → Junior PM",
    stars: 5,
  },
  {
    quote: "The simulations are exactly what interviews ask. I could answer every 'tell me about a time' question with real confidence.",
    name: "Marcus T.",
    role: "Career changer from finance",
    stars: 5,
  },
  {
    quote: "My line manager noticed a shift in how I approached projects before I'd even finished Level 3.",
    name: "Priya M.",
    role: "Care sector team leader",
    stars: 5,
  },
];

const MENTOR_MESSAGES = [
  "You can do this.",
  "See? You just passed that challenge.",
  "30% of people fail this section — keep going.",
  "You're closer than you think.",
  "Confidence comes from repetition.",
  "You're building proof, not just knowledge.",
  "Future employers want this thinking.",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Ticker() {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const speed = 0.03;
      setOffset(((ts - start) * speed) % (TICKER_ITEMS.length * 220));
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div ref={ref} className="overflow-hidden border-y border-border bg-muted/40 py-4">
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{ transform: `translateX(-${offset}px)`, willChange: "transform" }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-3 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-sm text-foreground/40 font-medium">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="border border-border rounded-2xl p-6 bg-muted/50 text-center group hover:border-cyan-400/20 transition-colors">
      <p className="text-5xl font-black text-foreground mb-1 group-hover:text-cyan-400 transition-colors">{value}</p>
      <p className="text-foreground font-semibold text-sm mb-1">{label}</p>
      <p className="text-foreground/40 text-xs">{sub}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToHowItWorks = () => {
    setMenuOpen(false);
    setTimeout(() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const navigate = (path: string) => {
    setMenuOpen(false);
    setLocation(path);
  };

  // Close menu on outside click or scroll
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#site-nav")) setMenuOpen(false);
    };
    const handleScroll = () => setMenuOpen(false);
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen sp-page overflow-x-hidden">

      {/* ── Navigation ── */}
      <nav id="site-nav" className="fixed top-0 left-0 right-0 z-50 border-b sp-divider sp-nav backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/manus-storage/spitfire-pm-logo_8b0682d2.png"
              alt="Spitfire PM"
              className="h-10 w-auto object-contain"
            />
            <span className="hidden sm:inline text-xs text-cyan-400 border border-cyan-400/30 rounded-full px-2.5 py-0.5 font-medium">
              Spitfire PM
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Desktop nav links — hidden on all mobile/tablet/landscape sizes */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={scrollToHowItWorks}
                className="text-sm text-foreground/50 hover:text-white transition-colors"
              >
                How it works
              </button>
              <button
                onClick={() => navigate("/pricing")}
                className="text-sm text-foreground/50 hover:text-white transition-colors"
              >
                Pricing
              </button>
              {isAuthenticated ? (
                <Button
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                >
                  Dashboard <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              ) : (
                <>
                  <Button size="sm" variant="ghost" onClick={() => navigate("/login")} className="text-foreground/60 hover:text-white">
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => navigate("/login")} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/25">
                    Start Free
                  </Button>
                </>
              )}
            </div>

            {/* Burger button — visible on everything below lg */}
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-border text-foreground/60 hover:text-white hover:border-cyan-400/40 transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile / tablet dropdown menu — always mounted, animated via grid-rows */}
        <div
          className="lg:hidden overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out"
          style={{
            display: "grid",
            gridTemplateRows: menuOpen ? "1fr" : "0fr",
            opacity: menuOpen ? 1 : 0,
          }}
          aria-hidden={!menuOpen}
        >
          <div className="min-h-0">
            <div className="border-t sp-divider sp-nav px-6 py-4 flex flex-col gap-1">
              <button
                onClick={scrollToHowItWorks}
                className="text-left w-full px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                How it works
              </button>
              <button
                onClick={() => navigate("/pricing")}
                className="text-left w-full px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                Pricing
              </button>
              <div className="border-t border-border/40 my-1" />
              {isAuthenticated ? (
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold mt-1"
                >
                  Go to Dashboard <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <div className="flex flex-col gap-2 mt-1">
                  <Button variant="outline" onClick={() => navigate("/login")} className="w-full">
                    Sign In
                  </Button>
                  <Button onClick={() => navigate("/login")} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/25">
                    Start Free — No Payment Required
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
      {/* ── Hero ── */}
      <section className="pt-36 pb-16 px-6 relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(6,200,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,200,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-24 left-1/4 w-[400px] h-[300px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/25 bg-cyan-400/5 text-cyan-400 text-sm font-medium">
              <Flame className="h-3.5 w-3.5" />
              The bridge between certification and your first PM role
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-5xl mx-auto mb-8">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mb-2">
              <span className="block text-foreground">You've done</span>
              <span className="block text-foreground">the courses.</span>
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                Now prove it.
              </span>
            </h1>
          </div>

          {/* Sub */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xl md:text-2xl text-foreground/55 leading-relaxed mb-3">
              Training teaches theory. <strong className="text-foreground font-semibold">Simulation proves readiness.</strong>
            </p>
            <p className="text-base text-foreground/35 max-w-xl mx-auto">
              The UK platform for career changers, healthcare professionals, and internal candidates preparing for
               their first PM role — through real scenarios, not revision.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => setLocation("/login")}
              className="text-lg px-10 py-6 bg-cyan-500 hover:bg-cyan-400 text-black font-black shadow-2xl shadow-cyan-500/30 transition-all hover:scale-105"
            >
              Start Free — No Payment Required
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToHowItWorks}
              className="text-lg px-10 py-6 border-border/60 text-foreground/80 hover:bg-white/5 hover:text-white hover:border-white/30 transition-all"
            >
              See How It Works
            </Button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <Ticker />

      {/* ── Trust bar ── */}
      <section className="border-b border-border bg-muted/30 py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {TRUST_SIGNALS.map((signal) => (
            <div key={signal} className="flex items-center gap-2 text-sm text-foreground/45">
              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
              {signal}
            </div>
          ))}
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <p className="text-amber-400 text-sm font-bold uppercase tracking-widest">
                  The gap no one talks about
                </p>
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-[1.1] mb-8">
                <span className="text-foreground/50 italic text-3xl block mb-2">&ldquo;</span>
                I&apos;ve studied the theory.
                <br />
                <span className="text-foreground/60">But how do I</span>
                <br />
                <span className="text-cyan-400">prove I&apos;m ready?&rdquo;</span>
              </h2>
              <p className="text-foreground/55 text-lg leading-relaxed mb-5">
                You&apos;ve done the Google PM course. Maybe PRINCE2. Perhaps a Level 4 or 5 qualification.
                You understand the frameworks. But when the panel asks{" "}
                <em className="text-foreground/80 not-italic font-medium">&ldquo;Tell me about a time you managed a difficult stakeholder&hellip;&rdquo;</em>
              </p>
              <p className="text-foreground/55 text-lg leading-relaxed mb-8">
                You freeze. Because you&apos;ve <em>studied</em> it — but you&apos;ve never <strong className="text-foreground font-semibold">done</strong> it.
              </p>
              <p className="text-foreground font-semibold text-lg border-l-2 border-cyan-400 pl-4">
                Spitfire PM closes that gap through simulation — not more revision.
              </p>
            </div>

            {/* Before / After */}
            <div className="space-y-3">
              <p className="text-foreground/50 text-xs font-semibold uppercase tracking-widest mb-4 ml-1">What changes</p>
              {BEFORE_AFTER.map(({ before, after }, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 gap-0 rounded-xl overflow-hidden border border-border"
                >
                  <div className="bg-red-950/30 border-r border-border px-4 py-3.5">
                    <span className="text-xs text-red-400 font-medium block mb-1">Before</span>
                    <span className="text-foreground/50 text-sm">{before}</span>
                  </div>
                  <div className="bg-cyan-950/20 px-4 py-3.5">
                    <span className="text-xs text-cyan-400/70 font-medium block mb-1">After</span>
                    <span className="text-foreground text-sm font-medium">{after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-28 px-6 bg-muted/50 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-4">How it works</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Simple. Structured. Effective.</h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              Four steps from complete beginner to interview-ready.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map(({ step, title, description, icon: Icon }, i) => (
              <div
                key={step}
                className="relative bg-card border border-border rounded-2xl p-6 hover:border-cyan-400/25 transition-colors group"
              >
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-3 z-10">
                    <ChevronRight className="h-5 w-5 text-foreground/20" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-4xl font-black text-foreground/10 leading-none">{step}</span>
                  <div className="w-9 h-9 bg-cyan-400/10 rounded-xl flex items-center justify-center group-hover:bg-cyan-400/20 transition-colors">
                    <Icon className="h-4 w-4 text-cyan-400" />
                  </div>
                </div>
                <h3 className="font-bold text-base mb-2 group-hover:text-cyan-400 transition-colors">{title}</h3>
                <p className="text-foreground/45 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's Free ── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/25 bg-cyan-400/5 text-cyan-400 text-sm font-medium mb-6">
              <Zap className="h-3.5 w-3.5" />
              Level 1 — completely free, always
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Start today. No risk. No card.</h2>
            <p className="text-foreground/50 text-lg max-w-2xl mx-auto">
              Everything you need to know if Spitfire PM is right for you — before spending a penny.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {FREE_TRIAL_INCLUDES.map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="bg-muted/50 border border-border rounded-xl p-5 flex gap-4 items-start hover:border-cyan-400/20 hover:bg-muted/70 transition-all group"
              >
                <div className="w-9 h-9 bg-cyan-400/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-400/15 transition-colors">
                  <Icon className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1">{label}</p>
                  <p className="text-foreground/35 text-xs leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => setLocation("/login")}
              className="text-lg px-10 py-6 bg-cyan-500 hover:bg-cyan-400 text-black font-black shadow-2xl shadow-cyan-500/25 hover:scale-105 transition-all"
            >
              Claim Your Free Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-foreground/25 text-sm mt-4">No credit card · No commitment · Upgrade only when ready</p>
          </div>
        </div>
      </section>

      {/* ── Simulations ── */}
      <section className="py-28 px-6 bg-muted/40 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-4">What you&apos;ll practise</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Stop studying. Start performing.</h2>
            <p className="text-foreground/50 text-lg max-w-2xl mx-auto">
              Every simulation mirrors a real situation you&apos;ll face in the role — and in the interview room.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SIMULATION_TYPES.map((sim) => (
              <div
                key={sim.title}
                className={`bg-gradient-to-b ${sim.accent} border rounded-2xl p-6 hover:scale-[1.02] transition-all group cursor-default`}
              >
                <div className={`text-xs font-bold rounded-full px-2.5 py-1 inline-block mb-5 ${sim.tagColor}`}>
                  {sim.tag}
                </div>
                <h3 className="font-black text-lg mb-3 group-hover:text-white transition-colors">{sim.title}</h3>
                <p className="text-foreground/50 text-sm leading-relaxed">{sim.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mentor / Psychology ── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-4">Built for confidence</p>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                A mentor built
                <br />
                into every step.
              </h2>
              <p className="text-foreground/55 text-lg leading-relaxed mb-8">
                Positive reinforcement, momentum tracking, and emotional support — not just a test engine.
                Because getting a PM role is as much psychology as it is knowledge.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: BarChart3, title: "Confidence Score", desc: "Tracks psychological readiness as you progress." },
                  { icon: Target, title: "Interview Readiness", desc: "Know exactly how prepared you are before walking in." },
                  { icon: Flame, title: "Streak & Momentum", desc: "Daily habits build confidence. Confidence gets jobs." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4 items-start p-4 rounded-xl border border-border bg-muted/50">
                    <div className="w-9 h-9 bg-cyan-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-bold text-sm mb-1">{title}</p>
                      <p className="text-foreground/45 text-xs leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-foreground/50 text-xs font-semibold uppercase tracking-widest mb-4">What you&apos;ll hear along the way</p>
              {MENTOR_MESSAGES.map((msg) => (
                <div
                  key={msg}
                  className="border border-cyan-400/10 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-xl px-5 py-3.5 text-foreground/65 text-sm italic"
                >
                  &ldquo;{msg}&rdquo;
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="py-28 px-6 bg-muted/40 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-4">Real results</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Career changers. Real outcomes.</h2>
            <p className="text-foreground/45 text-lg max-w-xl mx-auto">
              From studying theory to landing the role.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ quote, name, role, stars }) => (
              <div
                key={name}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col hover:border-border/60 transition-colors"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(stars)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground/65 text-sm leading-relaxed mb-6 flex-1">&ldquo;{quote}&rdquo;</p>
                <div className="border-t border-border pt-4">
                  <p className="font-bold text-foreground text-sm">{name}</p>
                  <p className="text-cyan-400/70 text-xs mt-0.5">{role}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-foreground/25 text-xs mt-6">
            Illustrative examples based on typical user journeys. Individual results vary.
          </p>
        </div>
      </section>

      {/* ── Who It's For ── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-4">Who it&apos;s for</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Built for real career changers.</h2>
            <p className="text-foreground/45 text-lg max-w-2xl mx-auto">
              Not students. Not graduates. Professionals who&apos;ve done the hard work and need to prove it.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHO_ITS_FOR.map(({ role, detail }) => (
              <div
                key={role}
                className="border border-border bg-muted/50 rounded-xl p-5 flex gap-4 items-start hover:border-cyan-400/20 hover:bg-muted/70 transition-all"
              >
                <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground text-sm mb-1">{role}</p>
                  <p className="text-foreground/40 text-xs">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-28 px-6 bg-muted/40 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-4">Simple pricing</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Start free. Upgrade when ready.</h2>
            <p className="text-foreground/45 text-lg max-w-2xl mx-auto">
              Level 1 is always free. No games, no pressure — full platform from £39/month.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {/* Free */}
            <div className="bg-card border border-border rounded-2xl p-7 flex flex-col">
              <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest mb-3">Free</p>
              <p className="text-5xl font-black mb-1">£0</p>
              <p className="text-foreground/35 text-sm mb-7">Level 1 — always free</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {["6 foundation lessons", "2 PM simulations", "Confidence score", "No time limit"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/55">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full border-border/60 text-foreground hover:bg-white/5"
                onClick={() => setLocation("/login")}
              >
                Start Free
              </Button>
            </div>

            {/* Professional — featured */}
            <div className="bg-gradient-to-b from-cyan-950/40 to-[#0b1119] border-2 border-cyan-400/35 rounded-2xl p-7 flex flex-col relative shadow-2xl shadow-cyan-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-xs font-black px-4 py-1.5 rounded-full tracking-wide">
                RECOMMENDED
              </div>
              <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">Professional</p>
              <div className="flex items-end gap-1 mb-1">
                <p className="text-5xl font-black">£39</p>
                <span className="text-foreground/35 text-lg mb-1.5">/mo</span>
              </div>
              <p className="text-foreground/35 text-sm mb-7">Cancel anytime</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {["All 7 levels", "All PM simulations", "AI decision feedback", "PM Readiness Certificate", "Interview toolkit", "Glossary of 200+ terms"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/65">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black shadow-lg shadow-cyan-500/20"
                onClick={() => setLocation("/login")}
              >
                Get Full Access
              </Button>
            </div>

            {/* Annual */}
            <div className="bg-card border border-border rounded-2xl p-7 flex flex-col">
              <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest mb-3">Annual</p>
              <div className="flex items-end gap-2 mb-1">
                <p className="text-5xl font-black">£197</p>
                <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2 py-1 mb-1.5">Save £271</span>
              </div>
              <p className="text-foreground/35 text-sm mb-7">£16.42/month — best value</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {["Everything in Professional", "Lowest monthly rate", "12 months full access", "Loyalty access pricing"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/55">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full border-cyan-400/25 text-cyan-400 hover:bg-cyan-400/5"
                onClick={() => setLocation("/login")}
              >
                Best Value
              </Button>
            </div>
          </div>

          <p className="text-center text-foreground/50 text-sm mt-8">
            Consistent trial users earn <span className="text-cyan-400/60">Loyalty Access at £19/month</span> for the first 6 months — commitment is rewarded, not discounted.
          </p>
        </div>
      </section>

      {/* ── B2B ── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Building2 className="h-4 w-4 text-cyan-400" />
                <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest">For organisations</p>
              </div>
              <h2 className="text-4xl font-black leading-tight mb-6">
                Prepare your workforce
                <br />
                <span className="text-cyan-400">for PM progression.</span>
              </h2>
              <p className="text-foreground/55 text-lg leading-relaxed mb-6">
                Know which staff are genuinely ready for PM responsibilities. Reduce costly mis-hires.
                Build internal PM capability with measurable, objective readiness scores.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Objective readiness assessment for internal candidates",
                  "Structured pathway aligned to your PM framework",
                  "Confidence and competency reporting for line managers",
                  "Healthcare, local government, housing, and corporate ready",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-foreground/55 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:support@spitfireitsolutions.com?subject=B2B%20Enquiry%20%E2%80%94%20Spitfire%20PM"
                className="inline-flex items-center gap-2 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/5 transition-colors rounded-lg px-5 py-2.5 text-sm font-bold"
              >
                Enquire about B2B access
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/8 to-blue-600/8 border border-cyan-400/15 rounded-2xl p-8 space-y-4">
              {[
                { icon: Users, label: "Team readiness dashboard" },
                { icon: BarChart3, label: "Individual competency reports" },
                { icon: Shield, label: "Secure, GDPR-compliant data" },
                { icon: Trophy, label: "Aligned to APM, PRINCE2 & Agile" },
                { icon: Clock, label: "Self-paced — fits around shift patterns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-4 border border-border rounded-xl p-4 bg-muted/50">
                  <div className="w-9 h-9 bg-cyan-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-foreground/70 font-medium text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/15 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white/5 text-foreground/50 text-sm mb-8">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            Level 1 is always free — no credit card required
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-[1.05]">
            Before your first PM interview —
            <br />
            <span className="text-cyan-400">prove you&apos;re ready.</span>
          </h2>
          <p className="text-foreground/50 text-lg mb-12 leading-relaxed max-w-xl mx-auto">
            Real simulations. Real confidence. The only platform built specifically
            for career changers getting their first PM role.
          </p>
          <Button
            size="lg"
            onClick={() => setLocation("/login")}
            className="text-xl px-12 py-7 bg-cyan-500 hover:bg-cyan-400 text-black font-black shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all"
          >
            Start Proving Readiness — Free
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          <p className="text-foreground/25 text-sm mt-6">
            No credit card · Level 1 always free · Cancel anytime · UK-based platform
          </p>

          {/* Share nudge */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <span className="text-foreground/25 text-xs">Know someone who wants to become a PM?</span>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://www.spitfire-pm.com')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2]/20 hover:bg-[#0A66C2]/40 border border-[#0A66C2]/30 hover:border-[#0A66C2]/60 text-[#70a8e0] hover:text-white text-xs font-semibold transition-all"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Share on LinkedIn
            </a>
            <a
              href={`https://x.com/intent/tweet?url=${encodeURIComponent('https://www.spitfire-pm.com')}&text=${encodeURIComponent('Just found this PM simulation platform — great for career changers preparing for their first PM role.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 hover:border-foreground/20 text-foreground/50 hover:text-foreground text-xs font-semibold transition-all"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Share on X
            </a>
          </div>
        </div>
      </section>

      </main>
      {/* ── Footer ── */}
      <footer className="border-t border-border py-12 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-3">
              <img
                src="/manus-storage/spitfire-pm-logo_8b0682d2.png"
                alt="Spitfire PM"
                className="h-9 w-auto object-contain"
              />
              <span className="text-foreground/30 text-xs">Spitfire PM Platform</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-foreground/30 text-sm">
              <a href="mailto:support@spitfireitsolutions.com" className="hover:text-cyan-400 transition-colors">
                support@spitfireitsolutions.com
              </a>
              <button onClick={() => setLocation("/login")} className="hover:text-foreground/60 transition-colors">
                Sign In
              </button>
              <button onClick={() => setLocation("/login")} className="hover:text-foreground/60 transition-colors">
                Get Started
              </button>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://www.spitfire-pm.com')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#70a8e0] transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share on LinkedIn
              </a>
              <a
                href={`https://x.com/intent/tweet?url=${encodeURIComponent('https://www.spitfire-pm.com')}&text=${encodeURIComponent('Just found this PM simulation platform — great for career changers preparing for their first PM role.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground/60 transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Share on X
              </a>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-foreground/20 text-xs">
            Aligned to PRINCE2, APM & Agile standards · GDPR compliant · Built for career changers worldwide
          </div>
        </div>
      </footer>
    </div>
  );
}

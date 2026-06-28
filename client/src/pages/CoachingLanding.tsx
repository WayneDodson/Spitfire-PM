import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/AppHeader";
import {
  Users, Star, Clock, CheckCircle2, ArrowRight, ChevronDown, ChevronUp,
  Target, Briefcase, GraduationCap, Stethoscope, TrendingUp, MessageSquare,
  Shield, Calendar, Video, Mail,
} from "lucide-react";

// ── SEO meta ─────────────────────────────────────────────────────────────────
const PAGE_TITLE = "1-to-1 Project Management Coaching | Spitfire PM";
const PAGE_DESC =
  "Personal 1-to-1 project management coaching for career changers, aspiring PMs and candidates preparing for project management interviews. Start with a free 20-minute assessment.";

// ── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Is the first call free?",
    a: "Yes. The first 20-minute PM Career Assessment is free. It is used to understand your goals and identify whether our paid coaching would be suitable for you.",
  },
  {
    q: "Is the free call a coaching session?",
    a: "No. The free call is an introductory assessment. Detailed interview coaching, CV work, mock interviews and scenario training take place during paid sessions.",
  },
  {
    q: "Do I need a project management qualification?",
    a: "No. We support people at different stages, including complete career changers, learners and people who already hold qualifications such as PRINCE2 or APM.",
  },
  {
    q: "Can you guarantee that I will get a job?",
    a: "No. We cannot guarantee employment. We provide practical coaching, preparation and structured support to help you present yourself more effectively.",
  },
  {
    q: "Are sessions online?",
    a: "Yes. Sessions are delivered online using Google Meet or Microsoft Teams unless another arrangement is agreed.",
  },
  {
    q: "Can I reschedule?",
    a: "Yes, provided at least 24 hours' notice is given. Cancellations with less than 24 hours' notice may not be refunded. Missed appointments are non-refundable.",
  },
  {
    q: "Can I book more sessions later?",
    a: "Yes. Additional sessions can be booked individually or as part of a coaching package.",
  },
];

// ── Who it is for ─────────────────────────────────────────────────────────────
const WHO_FOR = [
  { icon: TrendingUp, label: "Career changers moving into project management" },
  { icon: GraduationCap, label: "Google Project Management Certificate learners" },
  { icon: Shield, label: "PRINCE2 or APM-qualified candidates without direct PM experience" },
  { icon: Briefcase, label: "Project coordinators seeking promotion" },
  { icon: Stethoscope, label: "Healthcare and NHS professionals moving into project roles" },
  { icon: MessageSquare, label: "Candidates preparing for project management interviews" },
];

// Pricing CTA labels per slug
const PLAN_CTA: Record<string, string> = {
  focused_session: "Book a Focused Session",
  career_accelerator: "Choose Career Accelerator",
  transition_programme: "Apply for the Programme",
};
const PLAN_POPULAR: Record<string, boolean> = {
  career_accelerator: true,
};

// ── FAQ accordion item ────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-accent/30 transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-semibold text-foreground">{q}</span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CoachingLanding() {
  const [, setLocation] = useLocation();
  const pricingRef = useRef<HTMLDivElement>(null);

  const { data: testimonials = [] } = trpc.coaching.getTestimonials.useQuery();
  const { data: dbServices = [] } = trpc.coaching.getServices.useQuery();
  // Exclude the free assessment from the paid pricing grid
  const paidServices = dbServices.filter((s: any) => s.slug !== "free_assessment");

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* SEO */}
      <title>{PAGE_TITLE}</title>
      <meta name="description" content={PAGE_DESC} />

      <div className="min-h-screen bg-background">
        <AppHeader activePath="/one-to-one-coaching" />

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-cyan-950/20 pt-20 pb-24">
          {/* decorative grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.04)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 bg-cyan-500/10 px-4 py-1.5 text-sm">
                1-to-1 Project Management Coaching
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
                Get Personal 1-to-1 Project Management Support
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Build your confidence, strengthen your interview examples and prepare for your first or next project management role with personalised support from an experienced project professional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button
                  size="lg"
                  className="text-base px-8 bg-cyan-500 hover:bg-cyan-600 text-white"
                  onClick={() => setLocation("/one-to-one-coaching/assessment")}
                >
                  Request Your Free Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8" onClick={scrollToPricing}>
                  View Coaching Options
                </Button>
              </div>

              {/* trust indicators */}
              <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-cyan-500" /> Free 20-min assessment</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-cyan-500" /> No sales pressure</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-cyan-500" /> Sessions via Google Meet or Teams</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Intro ────────────────────────────────────────────────────────── */}
        <section className="py-20 bg-card/30">
          <div className="container max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Sometimes Online Learning Is Not Enough</h2>
            </div>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed text-center max-w-3xl mx-auto">
              <p>
                Spitfire PM gives you realistic project management scenarios and practical decision-making experience. However, some people benefit from additional personal support.
              </p>
              <p>
                Our 1-to-1 sessions are designed for aspiring project managers, career changers, project coordinators and professionals preparing for interviews or promotion.
              </p>
              <p>
                We can help you identify your strengths, close important skills gaps and explain your experience with greater confidence.
              </p>
            </div>
          </div>
        </section>

        {/* ── Who it is for ─────────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="container max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Who This Is For</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {WHO_FOR.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-start gap-4 bg-card border border-border rounded-xl p-5">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-cyan-500" />
                  </div>
                  <p className="text-sm text-card-foreground leading-relaxed">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Free assessment ───────────────────────────────────────────────── */}
        <section className="py-20 bg-gradient-to-br from-cyan-950/30 to-background">
          <div className="container max-w-3xl">
            <div className="bg-card border border-cyan-500/20 rounded-2xl p-8 md:p-12 text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto">
                <Calendar className="h-7 w-7 text-cyan-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Start With a Free 20-Minute PM Career Assessment</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                The first step is a short, no-obligation conversation about your current experience, career goals and the support you may need.
              </p>
              <div className="text-left space-y-2 max-w-md mx-auto">
                {[
                  "Discuss your current role and experience",
                  "Understand the project management roles you are targeting",
                  "Identify your main skills, confidence or interview gaps",
                  "Explain which coaching option may suit you",
                  "Answer questions about the Spitfire PM training approach",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-sm text-amber-300 text-left">
                <strong>Please note:</strong> The free assessment is an introductory suitability call. It does not include a full coaching session, CV rewrite or mock interview. Submitting this form does not guarantee acceptance — we review each request to ensure the session is suitable and useful.
              </div>
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-10"
                onClick={() => setLocation("/one-to-one-coaching/assessment")}
              >
                Request My Free Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* ── Pricing ───────────────────────────────────────────────────────── */}
        <section ref={pricingRef} className="py-20" id="coaching-options">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Coaching Options</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Choose the level of support that fits your goals and timeline. All sessions are delivered online via Google Meet or Microsoft Teams.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {paidServices.map((svc: any) => {
                const popular = PLAN_POPULAR[svc.slug] ?? false;
                const cta = PLAN_CTA[svc.slug] ?? "Book Now";
                const isApplication = svc.type === "application";
                const features: string[] = (() => {
                  try { return JSON.parse(svc.features); } catch { return []; }
                })();
                const pricePounds = (svc.pricePence / 100).toFixed(0);
                const normalPounds = svc.normalPricePence ? (svc.normalPricePence / 100).toFixed(0) : null;
                return (
                  <div
                    key={svc.slug}
                    className={`relative flex flex-col bg-card border rounded-2xl p-7 ${
                      popular ? "border-cyan-500 shadow-[0_0_30px_rgba(14,165,233,0.15)]" : "border-border"
                    }`}
                  >
                    {popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-cyan-500 text-white border-0 px-4 py-1 text-xs font-semibold">Most Popular</Badge>
                      </div>
                    )}

                    {/* Founding label */}
                    {svc.isFoundingPriceActive && svc.foundingLabel && (
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-full px-3 py-1">
                          ★ {svc.foundingLabel}
                        </span>
                      </div>
                    )}

                    <div className="space-y-1 mb-2">
                      <h3 className="text-lg font-bold text-card-foreground">{svc.name}</h3>

                      {/* Price row */}
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-3xl font-extrabold text-foreground">£{pricePounds}</span>
                        {normalPounds && svc.isFoundingPriceActive && (
                          <span className="text-base text-muted-foreground line-through">£{normalPounds}</span>
                        )}
                      </div>

                      {/* Best-for label */}
                      {svc.bestFor && (
                        <p className="text-xs font-medium text-cyan-400">{svc.bestFor}</p>
                      )}

                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {svc.durationMinutes} minutes
                      </div>
                    </div>

                    {/* Savings text */}
                    {svc.isFoundingPriceActive && svc.savingsText && (
                      <p className="text-xs text-emerald-400 font-medium mb-3">{svc.savingsText}</p>
                    )}

                    {/* Founding places remaining */}
                    {svc.isFoundingPriceActive && svc.foundingPlacesTotal && (
                      <div className="mb-3 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2 text-xs text-amber-300">
                        {svc.foundingPlacesRemaining != null
                          ? `${svc.foundingPlacesRemaining} of ${svc.foundingPlacesTotal} founding places remaining`
                          : `Limited to ${svc.foundingPlacesTotal} founding clients`}
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{svc.shortDescription}</p>

                    <ul className="space-y-2 mb-4 flex-1">
                      {features.map((f: string) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* Feature note */}
                    {svc.featureNote && (
                      <p className="text-xs text-muted-foreground italic mb-4 border-t border-border pt-3">{svc.featureNote}</p>
                    )}

                    <Button
                      className={`w-full ${popular ? "bg-cyan-500 hover:bg-cyan-600 text-white" : ""}`}
                      variant={popular ? "default" : "outline"}
                      onClick={() =>
                        setLocation(
                          isApplication
                            ? `/one-to-one-coaching/assessment?service=${svc.slug}`
                            : `/one-to-one-coaching/assessment?service=${svc.slug}`
                        )
                      }
                    >
                      {cta}
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Cancellation policy */}
            <div className="mt-10 bg-card border border-border rounded-xl p-6 max-w-3xl mx-auto text-sm text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-cyan-500" /> Cancellation &amp; Refund Policy</p>
              <p>Paid sessions must be paid for in advance.</p>
              <p>Sessions may be rescheduled with at least 24 hours' notice.</p>
              <p>Cancellations made with less than 24 hours' notice may not be refunded.</p>
              <p>Missed appointments are non-refundable.</p>
              <p>The free assessment is limited to one session per person.</p>
            </div>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-card/30">
          <div className="container max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Helping Aspiring Project Managers Move Forward
            </h2>
            {testimonials.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 border border-dashed border-border rounded-xl">
                <Star className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Testimonials will appear here once added by the admin.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-card border border-border rounded-xl p-6 space-y-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.content}"</p>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.authorName}</p>
                      {t.authorTitle && <p className="text-xs text-muted-foreground">{t.authorTitle}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="container max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="py-20 bg-gradient-to-br from-cyan-950/30 to-background">
          <div className="container max-w-3xl text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Take the Next Step?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Start with a free 20-minute assessment and find out what support could help you move closer to your project management goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-10"
                onClick={() => setLocation("/one-to-one-coaching/assessment")}
              >
                Request Your Free Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToPricing}>
                View Paid Coaching Options
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              By proceeding you agree to our{" "}
              <a href="/privacy" className="text-cyan-500 hover:underline">Privacy Policy</a>
              {" "}and{" "}
              <a href="/terms" className="text-cyan-500 hover:underline">Terms &amp; Conditions</a>.
            </p>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="border-t border-border py-8">
          <div className="container text-center text-xs text-muted-foreground space-y-1">
            <p>© {new Date().getFullYear()} Spitfire PM · <a href="mailto:support@spitfireitsolutions.com" className="text-cyan-500 hover:underline">support@spitfireitsolutions.com</a></p>
            <p>
              <a href="/privacy" className="hover:underline">Privacy Policy</a>
              {" · "}
              <a href="/terms" className="hover:underline">Terms &amp; Conditions</a>
              {" · "}
              <a href="/coaching-disclaimer" className="hover:underline">Coaching Disclaimer</a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

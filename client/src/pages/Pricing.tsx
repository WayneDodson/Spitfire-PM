import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Star,
  Award,
  TrendingUp,
  ArrowRight,
  Zap,
  Lock,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

const FEATURES_ALL = [
  "Full access to all 7 structured levels",
  "All PM simulations and real-world scenarios",
  "AI-powered feedback on every decision",
  "APM PFQ & PMQ qualification prep (24 modules)",
  "PM Readiness Certificate on completion",
  "Interview preparation toolkit",
  "Stakeholder management simulations",
  "Risk and budget scenario training",
  "Agile, Scrum, and Waterfall frameworks",
  "PM Glossary of 62 essential terms",
  "Progress tracking and confidence scoring",
  "Mindset conditioning and focus tools",
];

const FAQS = [
  {
    q: "Is there a free trial?",
    a: "Yes — every new account gets a full 7-day free trial with access to the first 6 lessons of Level 1 and all simulations. No payment required to start.",
  },
  {
    q: "What is Loyalty Access?",
    a: "Loyalty Access is earned, not discounted. Users who demonstrate consistent engagement during the 7-day free trial (logging in most days, completing lessons, running simulations) unlock PM Readiness Member Pricing at £19/month for the first 6 months. It reflects your commitment.",
  },
  {
    q: "What happens after the 6-month Loyalty period?",
    a: "After 6 months, Loyalty Access transitions to the Standard rate of £39/month. You will be notified in advance and can cancel at any time.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. All plans are cancel-anytime with no lock-in. You retain access until the end of your billing period.",
  },
  {
    q: "Is this relevant for NHS staff?",
    a: "Absolutely. Many of our learners are NHS staff moving into project or programme management roles. The content is aligned to APM standards used widely across the public sector.",
  },
  {
    q: "What qualifications does this help with?",
    a: "The platform includes dedicated preparation modules for the APM Project Fundamentals Qualification (PFQ) and the APM Project Management Qualification (PMQ).",
  },
];

/** Inject Schema.org JSON-LD for search engine rich results */
function PricingSchema() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Spitfire PM — Project Management Training Platform",
      description:
        "The UK platform for career changers and NHS staff who want to become project managers. Learn through real simulations, APM qualification prep, and structured 7-level curriculum.",
      url: "https://www.spitfire-pm.com/pricing",
      brand: {
        "@type": "Brand",
        name: "Spitfire PM",
      },
      offers: [
        {
          "@type": "Offer",
          name: "Free Trial",
          price: "0",
          priceCurrency: "GBP",
          description:
            "7-day free trial — first 6 lessons of Level 1 and all simulations. No payment required.",
          availability: "https://schema.org/InStock",
          url: "https://www.spitfire-pm.com/pricing",
        },
        {
          "@type": "Offer",
          name: "Loyalty Access",
          price: "19",
          priceCurrency: "GBP",
          description:
            "Earned by consistent engagement during the 7-day trial. £19/month for the first 6 months, then £39/month. Full platform access.",
          availability: "https://schema.org/InStock",
          url: "https://www.spitfire-pm.com/pricing",
        },
        {
          "@type": "Offer",
          name: "Annual Professional",
          price: "197",
          priceCurrency: "GBP",
          description:
            "£197/year (£16.42/month). Full platform access for 12 months. Best value — save £271 vs monthly billing.",
          availability: "https://schema.org/InStock",
          url: "https://www.spitfire-pm.com/pricing",
        },
        {
          "@type": "Offer",
          name: "Standard Professional",
          price: "39",
          priceCurrency: "GBP",
          description:
            "£39/month. Full platform access. Cancel anytime.",
          availability: "https://schema.org/InStock",
          url: "https://www.spitfire-pm.com/pricing",
        },
      ],
    });
    script.id = "pricing-schema";
    document.getElementById("pricing-schema")?.remove();
    document.head.appendChild(script);
    return () => {
      document.getElementById("pricing-schema")?.remove();
    };
  }, []);
  return null;
}

export default function Pricing() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  function handleStart() {
    if (isAuthenticated) {
      navigate("/subscribe");
    } else {
      navigate("/onboarding");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PricingSchema />

      {/* Nav */}
      <div className="border-b border-border px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <button className="text-foreground/60 hover:text-foreground/80 text-sm transition-colors">
              ← Back to home
            </button>
          </Link>
          <span className="text-foreground/30 text-xs hidden sm:block">
            Secure checkout powered by Stripe
          </span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-16 space-y-20">

        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 text-sm text-cyan-400 font-semibold">
            <Zap className="h-4 w-4" />
            Start free — no payment required
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            Simple,<br />
            <span className="text-cyan-400">honest pricing</span>
          </h1>
          <p className="text-foreground/60 text-lg max-w-xl mx-auto">
            One platform. Everything you need to go from beginner to job-ready PM. Your commitment during the free trial determines your rate.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Loyalty Access */}
          <div className="relative rounded-2xl border border-border bg-muted/50 p-6 space-y-5 opacity-80">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-white/10 text-foreground/60 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                <Lock className="h-3 w-3" /> Earned by Consistency
              </span>
            </div>
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4 text-cyan-400" />
                <span className="text-xs uppercase tracking-widest text-cyan-400/80 font-semibold">
                  Loyalty Access
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-foreground">£19</span>
                <span className="text-foreground/50 mb-1">/month</span>
              </div>
              <p className="text-xs text-foreground/40 mt-1">First 6 months · then £39/month</p>
            </div>
            <p className="text-sm text-foreground/60">
              Earned by users who demonstrate consistent engagement during the 7-day free trial. Log in daily, complete lessons, run simulations.
            </p>
            <Button
              onClick={handleStart}
              className="w-full bg-white/10 hover:bg-white/15 text-foreground/80 font-bold"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Annual — best value anchor */}
          <div className="relative rounded-2xl border border-amber-500/60 bg-amber-950/20 ring-1 ring-amber-500/30 p-6 space-y-5">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-amber-500 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Best Value
              </span>
            </div>
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-amber-400" />
                <span className="text-xs uppercase tracking-widest text-amber-400/80 font-semibold">
                  Annual Professional
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-foreground">£197</span>
                <span className="text-foreground/50 mb-1">/year</span>
              </div>
              <p className="text-xs text-foreground/40 mt-1">£16.42/month · save £271 vs monthly</p>
            </div>
            <p className="text-sm text-foreground/60">
              For professionals committed to completing their full career transition. The most serious choice.
            </p>
            <Button
              onClick={handleStart}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black"
            >
              Start Annual Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Standard */}
          <div className="relative rounded-2xl border border-border bg-muted/50 p-6 space-y-5">
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-foreground/60" />
                <span className="text-xs uppercase tracking-widest text-foreground/50 font-semibold">
                  Standard Professional
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-foreground">£39</span>
                <span className="text-foreground/50 mb-1">/month</span>
              </div>
              <p className="text-xs text-foreground/40 mt-1">Full access · cancel anytime</p>
            </div>
            <p className="text-sm text-foreground/60">
              Full platform access. The standard rate for professionals ready to invest in their career transition.
            </p>
            <Button
              onClick={handleStart}
              variant="outline"
              className="w-full font-bold bg-transparent border-border/70 text-foreground/60 hover:border-white/30 hover:text-foreground/80"
            >
              Start Standard Access
            </Button>
          </div>
        </div>

        {/* Free trial callout */}
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-8 text-center space-y-4">
          <h2 className="text-2xl font-black text-foreground">Start with a free 7-day trial</h2>
          <p className="text-foreground/60 max-w-lg mx-auto">
            Every new account gets full access to the first 6 lessons of Level 1 and all PM simulations — completely free. No payment required. Your engagement during the trial determines whether you earn Loyalty pricing.
          </p>
          <Button
            onClick={handleStart}
            size="lg"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg px-8"
          >
            Start Free — No Payment Required
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* What's included */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-black text-foreground">Everything included in every plan</h2>
            <p className="text-foreground/50 mt-2">No tiers within tiers. Full access, always.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {FEATURES_ALL.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/70">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-foreground text-center">Common questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border border-border rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-foreground">{faq.q}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-4 pb-8">
          <p className="text-foreground/50 text-sm">
            Questions? Email us at{" "}
            <a
              href="mailto:support@spitfireitsolutions.com"
              className="text-cyan-400 hover:underline"
            >
              support@spitfireitsolutions.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

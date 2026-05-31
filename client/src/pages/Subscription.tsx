/**
 * Subscription / Membership page
 *
 * Single plan: £19.99/month — cancel anytime, no refunds.
 * Free trial: 7 days, Levels 1–2 accessible. Levels 3–7 require subscription.
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { CancellationFlowModal } from "@/components/CancellationFlowModal";
import {
  CheckCircle2,
  Zap,
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronUp,
  Loader2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { BrandedLoader } from "@/components/BrandedLoader";

// The single Pro plan price ID — £19.99/month
const PRO_PRICE_ID = "price_1Td7i6AlIkFVb04sc2uvWlVl";

const FEATURES = [
  "Full access to all 7 levels",
  "100+ PM simulations and real-world scenarios",
  "AI-powered feedback on every decision",
  "PM Readiness Certificate on completion",
  "Interview preparation toolkit",
  "Stakeholder management simulations",
  "Risk and budget scenario training",
  "Agile, Scrum, and Waterfall frameworks",
  "Glossary of 200+ PM terms",
  "Progress tracking and confidence scoring",
  "Voice transcription for spoken answers",
  "Lifetime access to your completed work",
];

const FAQS = [
  {
    q: "What do I get with the subscription?",
    a: "Full access to all 7 levels, 100+ simulations, AI-powered feedback, interview prep, and everything on the platform. Levels 1 and 2 are free — subscription unlocks Levels 3 through 7.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime from your account settings. You keep access until the end of your current billing period. No refunds are issued for partial months.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — all new accounts get 7 days of free access to Levels 1 and 2. No payment required to start. Subscribe when you're ready to unlock the full platform.",
  },
  {
    q: "Are there refunds?",
    a: "We do not offer refunds. You can cancel at any time to stop future charges, and you will retain access until the end of the billing period you have paid for.",
  },
  {
    q: "Is this right for someone with no PM experience?",
    a: "Yes. The platform is built specifically for career changers — people transitioning from teaching, healthcare, finance, engineering, and other industries. You start from the foundations and build to interview readiness.",
  },
  {
    q: "How does billing work?",
    a: "You are billed £19.99 per month. Your subscription renews automatically each month until you cancel. Payments are processed securely by Stripe.",
  },
];

export default function Subscription() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showCancellationFlow, setShowCancellationFlow] = useState(false);

  const utils = trpc.useUtils();

  const { data: subscription } = trpc.stripe.getSubscriptionStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const checkoutMutation = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast("Redirecting to secure checkout...", { duration: 2000 });
        window.open(data.url, "_blank");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to start checkout. Please try again.");
    },
  });

  const portalMutation = trpc.stripe.createPortalSession.useMutation({
    onSuccess: (data) => {
      if (data.url) window.open(data.url, "_blank");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to open billing portal.");
    },
  });

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/subscribe");
      return;
    }
    const origin = window.location.origin;
    checkoutMutation.mutate({
      priceId: PRO_PRICE_ID,
      successUrl: `${origin}/dashboard?subscribed=true`,
      cancelUrl: `${origin}/subscribe`,
    });
  };

  if (authLoading) {
    return <BrandedLoader />;
  }

  // Already subscribed
  if (subscription?.hasSubscription && subscription?.subscription?.status === "active") {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-black text-foreground">You are a Member</h1>
            <p className="text-foreground/50">
              Full access is active. Continue your PM career transition journey.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  portalMutation.mutate({
                    returnUrl: window.location.origin + "/dashboard",
                  })
                }
                disabled={portalMutation.isPending}
                className="border-border/70 text-foreground/60 hover:text-white bg-transparent"
              >
                Manage Billing
              </Button>
            </div>
            <button
              onClick={() => setShowCancellationFlow(true)}
              className="text-xs text-foreground/20 hover:text-foreground/40 transition-colors mt-2"
            >
              Cancel membership
            </button>
          </div>
        </div>

        <CancellationFlowModal
          open={showCancellationFlow}
          onClose={() => setShowCancellationFlow(false)}
          onCancelled={() => {
            setShowCancellationFlow(false);
            utils.stripe.getSubscriptionStatus.invalidate();
            navigate("/dashboard");
          }}
          readinessScore={0}
          levelsCompleted={0}
          overallProgress={0}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
            className="text-foreground/60 hover:text-foreground/80 text-sm transition-colors"
          >
            ← Back
          </button>
          <span className="text-foreground/30 text-xs">Secure checkout powered by Stripe</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-16">

        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            Unlock the full<br />
            <span className="text-cyan-400">PM platform</span>
          </h1>
          <p className="text-foreground/40 text-lg max-w-xl mx-auto">
            Levels 1 and 2 are free. Subscribe to unlock all 7 levels, 100+ simulations, and your PM career transition toolkit.
          </p>
        </div>

        {/* Single pricing card */}
        <div className="max-w-sm mx-auto">
          <div className="relative rounded-2xl border border-cyan-500/60 bg-cyan-950/20 ring-1 ring-cyan-500/30 p-8 space-y-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-cyan-500 text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                Full Access
              </span>
            </div>

            <div className="pt-2 text-center">
              <div className="flex items-end justify-center gap-1 mb-1">
                <span className="text-5xl font-black text-foreground">£19.99</span>
                <span className="text-foreground/40 mb-2">/month</span>
              </div>
              <p className="text-xs text-foreground/30">Cancel anytime · No refunds</p>
            </div>

            <ul className="space-y-3">
              {FEATURES.slice(0, 6).map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/60">{f}</span>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <Zap className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/60">+ {FEATURES.length - 6} more features</span>
              </li>
            </ul>

            <Button
              onClick={handleCheckout}
              disabled={checkoutMutation.isPending}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-base py-6"
            >
              {checkoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {isAuthenticated ? "Subscribe Now" : "Start Free Trial"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {!isAuthenticated && (
              <p className="text-xs text-foreground/30 text-center">
                No credit card required to start your 7-day free trial
              </p>
            )}
          </div>
        </div>

        {/* All features */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-foreground text-center">Everything included</h2>
          <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {FEATURES.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/60">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <div className="grid sm:grid-cols-3 gap-6 border-y border-border py-10">
          {[
            {
              icon: <Shield className="h-5 w-5 text-cyan-400" />,
              title: "Secure checkout",
              desc: "Payments handled by Stripe. We never store card details.",
            },
            {
              icon: <Users className="h-5 w-5 text-cyan-400" />,
              title: "Built for career changers",
              desc: "Designed for healthcare professionals, teachers, engineers, and others moving into PM roles.",
            },
            {
              icon: <TrendingUp className="h-5 w-5 text-cyan-400" />,
              title: "Cancel anytime",
              desc: "No lock-in. Cancel from your account settings at any time. Access continues to end of billing period.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
              <div>
                <p className="text-sm font-semibold text-foreground/70">{item.title}</p>
                <p className="text-xs text-foreground/30 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Free vs Pro comparison */}
        <div className="space-y-4 max-w-lg mx-auto">
          <h2 className="text-2xl font-black text-foreground text-center">Free vs Pro</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-3 bg-muted/50 px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider">
              <span>Feature</span>
              <span className="text-center">Free (7 days)</span>
              <span className="text-center text-cyan-400">Pro</span>
            </div>
            {[
              ["Level 1 — PM Foundations", true, true],
              ["Level 2 — Waterfall", true, true],
              ["Levels 3–7", false, true],
              ["All 100+ simulations", false, true],
              ["AI feedback", false, true],
              ["Interview prep toolkit", false, true],
              ["PM Readiness Certificate", false, true],
            ].map(([label, free, pro]) => (
              <div key={String(label)} className="grid grid-cols-3 px-4 py-3 border-t border-border text-sm">
                <span className="text-foreground/60">{label}</span>
                <span className="text-center">
                  {free ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400 mx-auto" />
                  ) : (
                    <Lock className="h-4 w-4 text-foreground/20 mx-auto" />
                  )}
                </span>
                <span className="text-center">
                  {pro ? (
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 mx-auto" />
                  ) : (
                    <Lock className="h-4 w-4 text-foreground/20 mx-auto" />
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-foreground text-center">Common questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-semibold text-foreground/70">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 text-foreground/30 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-foreground/30 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-foreground/40 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div className="text-center space-y-2 pb-8">
          <p className="text-foreground/20 text-sm">
            Test payments: use card{" "}
            <span className="font-mono text-foreground/30">4242 4242 4242 4242</span>
          </p>
          <p className="text-foreground/15 text-xs">
            Spitfire PM · Global project management platform · Powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}

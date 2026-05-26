/**
 * Subscription / Membership page
 *
 * Commitment-based pricing model:
 * - Loyalty Access (£19/month) — earned by consistent trial users
 * - Standard Professional Access (£39/month) — for all other users
 * - Annual Professional Access (£197/year) — best value anchor
 *
 * Language: earned access, not discounts. Premium, not cheap.
 */

import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { CancellationFlowModal } from "@/components/CancellationFlowModal";
import {
  CheckCircle2,
  Star,
  Zap,
  ArrowRight,
  Lock,
  Shield,
  TrendingUp,
  Award,
  Users,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FEATURES_ALL = [
  "Full access to all 7 levels",
  "All PM simulations and real-world scenarios",
  "AI-powered feedback on every decision",
  "PM Readiness Certificate on completion",
  "Interview preparation toolkit",
  "Stakeholder management simulations",
  "Risk and budget scenario training",
  "Agile, Scrum, and Waterfall frameworks",
  "Glossary of 200+ PM terms",
  "Progress tracking and confidence scoring",
  "Lifetime access to your completed work",
];

const FAQS = [
  {
    q: "What is Loyalty Access?",
    a: "Loyalty Access is earned — not discounted. Users who demonstrate consistent engagement during the 7-day free trial (logging in most days, completing lessons, running simulations) unlock PM Readiness Member Pricing at £19/month for the first 6 months. It reflects your commitment, not a sale.",
  },
  {
    q: "What happens after the 6-month Loyalty period?",
    a: "After 6 months, your subscription moves to the standard rate of £39/month. You can cancel anytime before then — no lock-in, no penalties.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime from your account settings. You keep access until the end of your current billing period.",
  },
  {
    q: "Is the Annual plan better value?",
    a: "The Annual plan at £197/year works out at £16.42/month — the best value option. It is designed for professionals who are serious about completing their transition and want to invest in the full journey.",
  },
  {
    q: "What if I did not earn Loyalty Access?",
    a: "Standard Professional Access at £39/month gives you exactly the same platform. The pricing difference reflects the commitment demonstrated during the trial — consistent users earn better pricing.",
  },
  {
    q: "Is this right for someone with no PM experience?",
    a: "Yes. The platform is built specifically for career changers — people transitioning from teaching, healthcare, finance, engineering, and other industries. You start from the foundations and build to interview readiness.",
  },
];

const PRICE_IDS = {
  founder: "price_1TNrMnAlIkFVb04s0DqEUelE",
  standard: "price_1TNrMnAlIkFVb04scUtJB4Hr",
  annual: "price_1TNrMoAlIkFVb04s7L47K0qg",
};

export default function Subscription() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const preferredTier = params.get("tier") as "founder" | "standard" | "annual" | null;

  const { isAuthenticated, loading: authLoading } = useAuth();
  const [selectedTier, setSelectedTier] = useState<"founder" | "standard" | "annual">(
    preferredTier ?? "annual"
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showCancellationFlow, setShowCancellationFlow] = useState(false);

  const utils = trpc.useUtils();

  const { data: trial } = trpc.trial.getStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });

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

  const founderEarned = trial?.founderAccessEarned ?? false;

  useEffect(() => {
    if (preferredTier) {
      setSelectedTier(preferredTier);
    } else if (founderEarned) {
      setSelectedTier("founder");
    }
  }, [founderEarned, preferredTier]);

  const handleCheckout = (tier: "founder" | "standard" | "annual") => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/subscribe");
      return;
    }
    const origin = window.location.origin;
    checkoutMutation.mutate({
      priceId: PRICE_IDS[tier],
      successUrl: `${origin}/dashboard?subscribed=true`,
      cancelUrl: `${origin}/subscribe`,
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#060d1a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  // Already subscribed
  if (subscription?.hasSubscription && subscription?.subscription?.status === 'active') {
    return (
      <>
        <div className="min-h-screen bg-[#060d1a] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-black text-white">You are a Member</h1>
            <p className="text-white/50">
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
                onClick={() => portalMutation.mutate({ returnUrl: window.location.origin + "/dashboard" })}
                disabled={portalMutation.isPending}
                className="border-white/20 text-white/60 hover:text-white bg-transparent"
              >
                Manage Billing
              </Button>
            </div>
            <button
              onClick={() => setShowCancellationFlow(true)}
              className="text-xs text-white/20 hover:text-white/40 transition-colors mt-2"
            >
              Cancel membership
            </button>
          </div>
        </div>

        {/* Cancellation Flow Modal */}
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
    <div className="min-h-screen bg-[#060d1a] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
              className="text-white/60 hover:text-white/80 text-sm transition-colors"
          >
            ← Back
          </button>
          <span className="text-white/30 text-xs">Secure checkout powered by Stripe</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">

        {/* Hero */}
        <div className="text-center space-y-4">
          {founderEarned && (
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 text-sm text-cyan-400 font-semibold mb-4">
              <Star className="h-4 w-4" />
              Commitment Reward Activated — Loyalty Access Earned
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            {founderEarned ? (
              <>
                You earned<br />
                <span className="text-cyan-400">Loyalty Access</span>
              </>
            ) : (
              <>
                Continue your<br />
                <span className="text-cyan-400">career transition</span>
              </>
            )}
          </h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            {founderEarned
              ? "Your consistency during the free trial unlocked PM Readiness Member Pricing. This is what commitment looks like."
              : "People do not buy courses. They buy confidence, career progression, and proof of readiness."}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Loyalty Access */}
          <div
            className={cn(
              "relative rounded-2xl border p-6 transition-all duration-200 space-y-5",
              founderEarned ? "cursor-pointer" : "cursor-default",
              selectedTier === "founder" && founderEarned
                ? "border-cyan-500/60 bg-cyan-950/20 ring-1 ring-cyan-500/30"
                : "border-white/10 bg-white/[0.02]",
              founderEarned && selectedTier !== "founder" && "hover:border-white/20",
              !founderEarned && "opacity-55"
            )}
            onClick={() => founderEarned && setSelectedTier("founder")}
          >
            {founderEarned ? (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-cyan-500 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                  Your Earned Rate
                </span>
              </div>
            ) : (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-white/10 text-white/40 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                  <Lock className="h-3 w-3" /> Earned by Consistency
                </span>
              </div>
            )}

            <div className="pt-2">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4 text-cyan-400" />
                <span className="text-xs uppercase tracking-widest text-cyan-400/70 font-semibold">
                  Loyalty Access
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-white">£19</span>
                <span className="text-white/40 mb-1">/month</span>
              </div>
              <p className="text-xs text-white/30 mt-1">First 6 months · then £39/month</p>
            </div>

            <p className="text-sm text-white/50">
              {founderEarned
                ? "You proved your commitment. This is your reward."
                : "Earned by users who demonstrate consistent engagement during the 7-day free trial."}
            </p>

            {founderEarned ? (
              <Button
                onClick={() => handleCheckout("founder")}
                disabled={checkoutMutation.isPending}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black"
              >
                {checkoutMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Claim Loyalty Access
              </Button>
            ) : (
              <div className="text-xs text-white/25 text-center py-2">
                Complete the 7-day trial consistently to unlock
              </div>
            )}
          </div>

          {/* Annual — best value anchor */}
          <div
            className={cn(
              "relative rounded-2xl border p-6 cursor-pointer transition-all duration-200 space-y-5",
              selectedTier === "annual"
                ? "border-amber-500/60 bg-amber-950/20 ring-1 ring-amber-500/30"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
            )}
            onClick={() => setSelectedTier("annual")}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-amber-500 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Best Value
              </span>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-amber-400" />
                <span className="text-xs uppercase tracking-widest text-amber-400/70 font-semibold">
                  Annual Professional
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-white">£197</span>
                <span className="text-white/40 mb-1">/year</span>
              </div>
              <p className="text-xs text-white/30 mt-1">£16.42/month · save £271 vs monthly</p>
            </div>

            <p className="text-sm text-white/50">
              For professionals committed to completing their full career transition. The most serious choice.
            </p>

            <Button
              onClick={() => handleCheckout("annual")}
              disabled={checkoutMutation.isPending}
              className={cn(
                "w-full font-black",
                selectedTier === "annual"
                  ? "bg-amber-500 hover:bg-amber-400 text-black"
                  : "bg-white/10 hover:bg-white/15 text-white"
              )}
            >
              {checkoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Start Annual Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Standard */}
          <div
            className={cn(
              "relative rounded-2xl border p-6 cursor-pointer transition-all duration-200 space-y-5",
              selectedTier === "standard"
                ? "border-white/30 bg-white/[0.04] ring-1 ring-white/20"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
            )}
            onClick={() => setSelectedTier("standard")}
          >
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-white/50" />
                <span className="text-xs uppercase tracking-widest text-white/30 font-semibold">
                  Standard Professional
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-white">£39</span>
                <span className="text-white/40 mb-1">/month</span>
              </div>
              <p className="text-xs text-white/30 mt-1">Full access · cancel anytime</p>
            </div>

            <p className="text-sm text-white/50">
              Full platform access. The standard rate for professionals ready to invest in their career transition.
            </p>

            <Button
              onClick={() => handleCheckout("standard")}
              disabled={checkoutMutation.isPending}
              variant="outline"
              className={cn(
                "w-full font-bold bg-transparent",
                selectedTier === "standard"
                  ? "border-white/30 text-white hover:bg-white/5"
                  : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
              )}
            >
              {checkoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Start Standard Access
            </Button>
          </div>
        </div>

        {/* What's included */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white">Everything included in every plan</h2>
            <p className="text-white/40 mt-2">No tiers within tiers. Full access, always.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {FEATURES_ALL.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/60">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <div className="grid sm:grid-cols-3 gap-6 border-y border-white/5 py-10">
          {[
            {
              icon: <Shield className="h-5 w-5 text-cyan-400" />,
              title: "Secure checkout",
              desc: "Payments handled by Stripe. We never store card details.",
            },
            {
              icon: <Users className="h-5 w-5 text-cyan-400" />,
              title: "Built for career changers",
              desc: "Designed for NHS professionals, teachers, engineers, and others transitioning into PM roles.",
            },
            {
              icon: <TrendingUp className="h-5 w-5 text-cyan-400" />,
              title: "Cancel anytime",
              desc: "No lock-in. Cancel from your account settings at any time.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
              <div>
                <p className="text-sm font-semibold text-white/70">{item.title}</p>
                <p className="text-xs text-white/30 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center">Common questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="border border-white/8 rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-semibold text-white/70">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 text-white/30 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-white/30 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-white/40 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div className="text-center space-y-2 pb-8">
          <p className="text-white/20 text-sm">
            Test payments: use card{" "}
            <span className="font-mono text-white/30">4242 4242 4242 4242</span>
          </p>
          <p className="text-white/15 text-xs">
            PM Simulate · UK career transition platform · Powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}

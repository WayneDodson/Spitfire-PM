import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Crown,
  BookOpen,
  Trophy,
  Zap,
  Users,
  Star,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const PREMIUM_LEVELS = [
  { level: 3, title: "Agile & Scrum Mastery", lessons: 12 },
  { level: 4, title: "Stakeholder Management", lessons: 12 },
  { level: 5, title: "Risk & Budget Control", lessons: 12 },
  { level: 6, title: "Leadership & Team Dynamics", lessons: 12 },
  { level: 7, title: "Advanced PM & Certification", lessons: 12 },
];

const FEATURES = [
  { icon: BookOpen, text: "60 advanced lessons across 5 levels" },
  { icon: CheckCircle2, text: "Knowledge checks with expert explanations" },
  { icon: Trophy, text: "Advanced achievement badges & XP rewards" },
  { icon: Zap, text: "Practice scenarios: Healthcare, Construction, Tech" },
  { icon: Users, text: "Stakeholder management simulations" },
  { icon: Star, text: "Certification preparation (PMP, PRINCE2, Agile)" },
];

export default function Subscription() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isPortaling, setIsPortaling] = useState(false);

  const { data: subStatus } = trpc.stripe.getSubscriptionStatus.useQuery(
    undefined,
    { enabled: !!user }
  );

  const createCheckout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to start checkout");
      setIsCheckingOut(false);
    },
  });

  const createPortal = trpc.stripe.createPortalSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to open billing portal");
      setIsPortaling(false);
    },
  });

  const handleSubscribe = async () => {
    if (!user) {
      setLocation("/login");
      return;
    }
    setIsCheckingOut(true);
    const origin = window.location.origin;
    createCheckout.mutate({
      successUrl: `${origin}/dashboard?subscribed=true`,
      cancelUrl: `${origin}/subscribe`,
    });
  };

  const handleManageSubscription = async () => {
    setIsPortaling(true);
    const origin = window.location.origin;
    createPortal.mutate({
      returnUrl: `${origin}/dashboard`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasSubscription = subStatus?.hasSubscription;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          onClick={() => setLocation("/dashboard")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Button>
      </div>

      <div className="container py-20 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
              <Crown className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Unlock Premium Access
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master all 7 levels of project management. Go from fundamentals to
            advanced certification-ready skills.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Tier */}
          <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">Free</Badge>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">£0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mt-2">Perfect for getting started</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Level 1: Introduction to PM (12 lessons)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Level 2: Waterfall (unlock with 1 referral)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">XP system and basic achievements</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">PM Glossary and Frameworks Reference</span>
              </div>
            </div>

            {user ? (
              <Button variant="outline" className="w-full" onClick={() => setLocation("/dashboard")}>
                Current Plan
              </Button>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => setLocation("/login")}>
                Get Started Free
              </Button>
            )}
          </div>

          {/* Premium Tier */}
          <div className="bg-card border-2 border-amber-500/50 rounded-2xl p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
              MOST POPULAR
            </div>

            <div>
              <Badge className="mb-3 bg-amber-500/10 text-amber-600 border-amber-500/20">
                Premium
              </Badge>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">£20</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mt-2">
                Full access to all 7 levels
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="text-sm font-medium">Everything in Free</span>
              </div>
              {PREMIUM_LEVELS.map((l) => (
                <div key={l.level} className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span className="text-sm">
                    Level {l.level}: {l.title} ({l.lessons} lessons)
                  </span>
                </div>
              ))}
            </div>

            {hasSubscription ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Active subscription
                </div>
                {subStatus?.subscription?.currentPeriodEnd && (
                  <p className="text-xs text-muted-foreground">
                    Renews{" "}
                    {new Date(
                      subStatus.subscription.currentPeriodEnd
                    ).toLocaleDateString()}
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleManageSubscription}
                  disabled={isPortaling}
                >
                  {isPortaling ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Manage Subscription
                </Button>
              </div>
            ) : (
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                size="lg"
                onClick={handleSubscribe}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting to checkout...
                  </>
                ) : (
                  <>
                    <Crown className="mr-2 h-4 w-4" />
                    Subscribe for £20/month
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            What you'll master with Premium
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-amber-500" />
                </div>
                <span className="text-sm text-muted-foreground">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Cancel anytime. No long-term commitment required.
          </p>
          <p className="text-sm text-muted-foreground">
            Secure payment powered by Stripe. Your card details are never stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, CheckCircle2, Zap, Trophy } from "lucide-react";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Onboarding() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="container pt-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="container py-12 md:py-20">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Welcome to Project Pro
            </h1>
            <p className="text-xl text-muted-foreground">
              Master project management through realistic simulations and hands-on practice.
            </p>
          </div>

          {/* What you get */}
          <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-bold">What's included for free</h2>
            <div className="space-y-4">
              {[
                { icon: BookOpen, text: "12 comprehensive lessons on PM fundamentals" },
                { icon: CheckCircle2, text: "Knowledge checks with instant feedback" },
                { icon: Zap, text: "XP system and achievement badges" },
                { icon: Trophy, text: "Practice scenarios with real-world decisions" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-card-foreground">{text}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={() => setLocation("/login")}
              >
                Create Free Account
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => setLocation("/login")}
              >
                Already have an account? Sign in
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              No credit card required. Level 1 is always free.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Target, Zap, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Hero Section */}
      <div className="container py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
            Project Pro: The PM Simulator
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Master Project Management<br />
            Through Realistic Simulations
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Learn Waterfall, Agile, Scrum, and more through hands-on scenarios. Build confidence with real-world decisions and immediate feedback.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => setLocation("/onboarding")}
            >
              Start Learning Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">NO CREDIT CARD REQUIRED</p>
        </div>
      </div>

      {/* Why Project Pro Section */}
      <div className="container py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Project Pro?</h2>
          <p className="text-xl text-muted-foreground">Traditional PM courses teach theory. We teach through practice.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-8 space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Learn by Doing</h3>
            <p className="text-muted-foreground">
              Make real project decisions and see immediate consequences. No boring lectures—just hands-on practice with realistic scenarios.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Immediate Feedback</h3>
            <p className="text-muted-foreground">
              Every decision comes with expert feedback explaining why it worked or didn't. Learn from mistakes in a safe environment.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Build Confidence</h3>
            <p className="text-muted-foreground">
              Progress from beginner to advanced scenarios. Track your growth and prove your skills with completed projects.
            </p>
          </div>
        </div>
      </div>

      {/* What You'll Master Section */}
      <div className="container py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">What You'll Master</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            "Waterfall methodology",
            "Agile & Scrum frameworks",
            "Stakeholder management",
            "Risk identification & mitigation",
            "Budget & timeline management",
            "Scope control",
            "Team leadership",
            "Quality assurance"
          ].map((skill) => (
            <div key={skill} className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-card-foreground">{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Become a Project Management Pro?</h2>
          <p className="text-lg text-muted-foreground">Start your free learning journey today. No credit card required.</p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => setLocation("/onboarding")}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

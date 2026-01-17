import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LearningPath() {
  const [, setLocation] = useLocation();

  const modules = [
    {
      id: 1,
      title: "Introduction to Project Management",
      description: "Learn the fundamentals of PM",
      status: "available"
    },
    {
      id: 2,
      title: "PM Methodologies",
      description: "Waterfall, Agile, Scrum deep dive",
      status: "locked"
    },
    {
      id: 3,
      title: "Core PM Concepts",
      description: "Stakeholder, risk, budget management",
      status: "locked"
    },
    {
      id: 4,
      title: "Hands-On Practice",
      description: "Apply your knowledge in realistic project scenarios",
      status: "locked"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Back Button */}
      <div className="container pt-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/assessment")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="container py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
              Assessment Complete!
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Learning Path</h1>
            <p className="text-xl text-muted-foreground">
              Based on your assessment, we've created a customized learning path for you
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Recommended Path: Beginner</h2>
            <p className="text-muted-foreground mb-8">
              You'll start with the fundamentals and progressively build your skills through hands-on practice.
            </p>

            <div className="space-y-4">
              {modules.map((module, index) => (
                <div 
                  key={module.id}
                  className={`flex items-start gap-4 p-6 rounded-lg border ${
                    module.status === "available" 
                      ? "border-primary bg-primary/5" 
                      : "border-border bg-muted/30"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {module.status === "available" ? (
                      <Circle className="h-6 w-6 text-primary" />
                    ) : (
                      <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Module {index + 1}
                      </span>
                      {module.status === "locked" && (
                        <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                          Locked
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-1">{module.title}</h3>
                    <p className="text-muted-foreground">{module.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="flex-1"
              onClick={() => setLocation("/tutorial/1")}
            >
              Start Your Learning Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="flex-1"
              onClick={() => setLocation("/scenarios")}
            >
              Skip to Practice Scenarios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

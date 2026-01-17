import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Building2, Home, Globe } from "lucide-react";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";

const scenarios = [
  {
    id: "healthcare-ward",
    title: "New Hospital Ward Commissioning",
    sector: "Healthcare",
    description: "Commission a new pediatric ward in a regional hospital. Manage medical equipment procurement, staff training, regulatory compliance, and patient safety protocols.",
    difficulty: "Intermediate",
    duration: "45-60 min",
    icon: Building2,
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30"
  },
  {
    id: "construction-renovation",
    title: "Residential House Renovation",
    sector: "Construction",
    description: "Renovate a Victorian-era home while preserving historical features. Coordinate contractors, manage budget constraints, handle unexpected structural issues, and satisfy demanding homeowners.",
    difficulty: "Beginner",
    duration: "30-45 min",
    icon: Home,
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30"
  },
  {
    id: "tech-website",
    title: "Corporate Website Refresh",
    sector: "Technology",
    description: "Lead a complete redesign of a company's public website. Manage design team, developers, content writers, and stakeholder feedback while meeting a tight launch deadline.",
    difficulty: "Beginner",
    duration: "30-45 min",
    icon: Globe,
    color: "from-blue-500/20 to-indigo-500/20",
    borderColor: "border-blue-500/30"
  }
];

export default function ScenarioSelection() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Back Button */}
      <div className="container pt-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/learning-path")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="container py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Scenario</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Practice your project management skills with realistic scenarios from different industries. 
              You can try all three to experience different challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <div 
                  key={scenario.id}
                  className={`bg-gradient-to-br ${scenario.color} border ${scenario.borderColor} rounded-xl p-6 space-y-4 hover:scale-105 transition-transform cursor-pointer`}
                  onClick={() => setLocation(`/scenario/${scenario.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs px-2 py-1 bg-card rounded text-card-foreground font-medium">
                        {scenario.sector}
                      </span>
                      <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                        {scenario.difficulty}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">{scenario.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {scenario.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-sm text-muted-foreground">
                      ⏱️ {scenario.duration}
                    </span>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation(`/scenario/${scenario.id}`);
                      }}
                      className="gap-2"
                    >
                      Start
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              💡 Tip: Each scenario teaches different aspects of project management. Try all three for a complete learning experience!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

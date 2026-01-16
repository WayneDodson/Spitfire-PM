import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, AlertCircle, CheckCircle2, Clock, DollarSign, Users } from "lucide-react";
import { useState } from "react";
import { useLocation, useParams } from "wouter";

const scenarioData: Record<string, any> = {
  "healthcare-ward": {
    title: "New Hospital Ward Commissioning",
    sector: "Healthcare",
    description: "You're the project manager for commissioning a new 20-bed pediatric ward at St. Mary's Regional Hospital. The board expects the ward to be operational in 6 months with a budget of $2.5M.",
    initialStats: {
      budget: 100,
      timeline: 100,
      quality: 100,
      stakeholder: 100
    }
  },
  "construction-renovation": {
    title: "Residential House Renovation",
    sector: "Construction",
    description: "You've been hired to renovate a 120-year-old Victorian home. The owners want to modernize while preserving historical character. Budget: $150k, Timeline: 4 months.",
    initialStats: {
      budget: 100,
      timeline: 100,
      quality: 100,
      stakeholder: 100
    }
  },
  "tech-website": {
    title: "Corporate Website Refresh",
    sector: "Technology",
    description: "Lead the redesign of TechCorp's public website. The CEO wants a modern, mobile-first design launched before the annual conference in 3 months. Budget: $80k.",
    initialStats: {
      budget: 100,
      timeline: 100,
      quality: 100,
      stakeholder: 100
    }
  }
};

const decisions = [
  {
    id: 1,
    question: "The project kickoff meeting is tomorrow. How do you prepare?",
    options: [
      {
        text: "Send a detailed agenda 24 hours in advance with clear objectives",
        impact: { timeline: 5, stakeholder: 10 },
        feedback: "Great! Clear communication sets expectations and shows professionalism."
      },
      {
        text: "Wing it - you'll figure it out during the meeting",
        impact: { timeline: -10, stakeholder: -15 },
        feedback: "Poor preparation leads to confusion and wastes everyone's time."
      },
      {
        text: "Cancel it - meetings are a waste of time",
        impact: { timeline: -5, stakeholder: -20, quality: -10 },
        feedback: "Kickoff meetings align the team. Skipping them causes misalignment later."
      }
    ]
  },
  {
    id: 2,
    question: "A key stakeholder requests a major scope change mid-project. What do you do?",
    options: [
      {
        text: "Assess impact on timeline/budget, then discuss trade-offs with stakeholder",
        impact: { stakeholder: 15, quality: 5 },
        feedback: "Perfect! Managing scope changes requires impact analysis and negotiation."
      },
      {
        text: "Say yes immediately to keep them happy",
        impact: { budget: -20, timeline: -15, stakeholder: 5 },
        feedback: "Agreeing without analysis leads to budget overruns and missed deadlines."
      },
      {
        text: "Refuse the change - the scope is locked",
        impact: { stakeholder: -25 },
        feedback: "Being inflexible damages relationships. Changes can be managed properly."
      }
    ]
  },
  {
    id: 3,
    question: "You discover the project will be 2 weeks late. How do you handle it?",
    options: [
      {
        text: "Inform stakeholders immediately with a recovery plan",
        impact: { stakeholder: 10, timeline: 5 },
        feedback: "Excellent! Transparency and proactive solutions build trust."
      },
      {
        text: "Hide it and hope you can catch up",
        impact: { stakeholder: -30, timeline: -10 },
        feedback: "Hiding problems makes them worse. Stakeholders will lose trust."
      },
      {
        text: "Blame the team for not working hard enough",
        impact: { stakeholder: -15, quality: -20 },
        feedback: "Blame destroys morale and doesn't solve the problem."
      }
    ]
  }
];

export default function Scenario() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [currentDecision, setCurrentDecision] = useState(0);
  const [stats, setStats] = useState(scenarioData[id!]?.initialStats || {});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const scenario = scenarioData[id!];

  if (!scenario) {
    return <div>Scenario not found</div>;
  }

  const handleOptionSelect = (optionIndex: number) => {
    if (showFeedback) return;
    
    setSelectedOption(optionIndex);
    setShowFeedback(true);

    const option = decisions[currentDecision].options[optionIndex];
    const newStats = { ...stats };
    
    Object.entries(option.impact).forEach(([key, value]) => {
      newStats[key] = Math.max(0, Math.min(100, newStats[key] + (value as number)));
    });
    
    setStats(newStats);
  };

  const handleNext = () => {
    if (currentDecision < decisions.length - 1) {
      setCurrentDecision(currentDecision + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsComplete(true);
    }
  };

  const getStatColor = (value: number) => {
    if (value >= 70) return "text-emerald-500";
    if (value >= 40) return "text-amber-500";
    return "text-red-500";
  };

  const getOverallScore = () => {
    return Math.round((stats.budget + stats.timeline + stats.quality + stats.stakeholder) / 4);
  };

  if (isComplete) {
    const score = getOverallScore();
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container pt-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/scenarios")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Scenarios
          </Button>
        </div>

        <div className="container py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              {score >= 70 ? (
                <CheckCircle2 className="h-20 w-20 text-emerald-500 mx-auto mb-4" />
              ) : (
                <AlertCircle className="h-20 w-20 text-amber-500 mx-auto mb-4" />
              )}
              <h1 className="text-4xl font-bold mb-4">Scenario Complete!</h1>
              <p className="text-xl text-muted-foreground">
                {score >= 70 ? "Excellent work! You managed the project successfully." : 
                 score >= 40 ? "Good effort! There's room for improvement." :
                 "This was challenging. Review the feedback and try again."}
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 mb-8">
              <div className="text-6xl font-bold text-primary mb-2">{score}%</div>
              <div className="text-muted-foreground">Overall Project Health</div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold">{stats.budget}%</div>
                  <div className="text-sm text-muted-foreground">Budget</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold">{stats.timeline}%</div>
                  <div className="text-sm text-muted-foreground">Timeline</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold">{stats.quality}%</div>
                  <div className="text-sm text-muted-foreground">Quality</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold">{stats.stakeholder}%</div>
                  <div className="text-sm text-muted-foreground">Stakeholder</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setLocation("/scenarios")}
              >
                Try Another Scenario
              </Button>
              <Button 
                className="flex-1"
                onClick={() => window.location.reload()}
              >
                Retry This Scenario
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const decision = decisions[currentDecision];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header with Back Button */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/scenarios")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="text-sm text-muted-foreground">
              Decision {currentDecision + 1} of {decisions.length}
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              <div>
                <div className={`text-lg font-bold ${getStatColor(stats.budget)}`}>{stats.budget}%</div>
                <div className="text-xs text-muted-foreground">Budget</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <div className={`text-lg font-bold ${getStatColor(stats.timeline)}`}>{stats.timeline}%</div>
                <div className="text-xs text-muted-foreground">Timeline</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border">
              <CheckCircle2 className="h-5 w-5 text-purple-500" />
              <div>
                <div className={`text-lg font-bold ${getStatColor(stats.quality)}`}>{stats.quality}%</div>
                <div className="text-xs text-muted-foreground">Quality</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border">
              <Users className="h-5 w-5 text-amber-500" />
              <div>
                <div className={`text-lg font-bold ${getStatColor(stats.stakeholder)}`}>{stats.stakeholder}%</div>
                <div className="text-xs text-muted-foreground">Stakeholder</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Content */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {currentDecision === 0 && (
            <div className="bg-card border border-border rounded-xl p-8 mb-8">
              <div className="text-sm text-primary font-medium mb-2">{scenario.sector}</div>
              <h1 className="text-3xl font-bold mb-4">{scenario.title}</h1>
              <p className="text-muted-foreground leading-relaxed">{scenario.description}</p>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl p-8">
            <div className="mb-8">
              <Progress value={((currentDecision + 1) / decisions.length) * 100} className="mb-2" />
              <div className="text-sm text-muted-foreground text-right">
                {Math.round(((currentDecision + 1) / decisions.length) * 100)}% Complete
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">{decision.question}</h2>

            <div className="space-y-4">
              {decision.options.map((option, index) => (
                <div key={index}>
                  <button
                    onClick={() => handleOptionSelect(index)}
                    disabled={showFeedback}
                    className={`w-full text-left p-6 rounded-lg border-2 transition-all ${
                      selectedOption === index
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-accent/30"
                    } ${showFeedback && selectedOption !== index ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                        selectedOption === index ? "border-primary bg-primary" : "border-border"
                      }`}>
                        {selectedOption === index && (
                          <div className="w-3 h-3 rounded-full bg-primary-foreground"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{option.text}</p>
                      </div>
                    </div>
                  </button>

                  {showFeedback && selectedOption === index && (
                    <div className="mt-3 p-4 bg-accent/50 border border-accent rounded-lg">
                      <p className="text-sm">{option.feedback}</p>
                      {Object.keys(option.impact).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Object.entries(option.impact).map(([key, value]) => (
                            <span 
                              key={key}
                              className={`text-xs px-2 py-1 rounded ${
                                (value as number) > 0 ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                              }`}
                            >
                              {key}: {(value as number) > 0 ? "+" : ""}{value}%
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {showFeedback && (
              <div className="mt-8">
                <Button onClick={handleNext} size="lg" className="w-full">
                  {currentDecision < decisions.length - 1 ? "Next Decision" : "Complete Scenario"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
    },
    decisions: [
      {
        id: 1,
        question: "The medical equipment vendor offers a 15% discount if you order all equipment now, but the ward won't be ready for installation for 3 months. Storage costs would be $5,000/month.",
        options: [
          {
            text: "Accept the discount and arrange storage (saves money but adds complexity)",
            impact: { budget: 10, timeline: -5 },
            feedback: "Good cost-benefit analysis! The $45k discount (15% of typical $300k equipment) outweighs $15k storage costs."
          },
          {
            text: "Order equipment just-in-time when the ward is ready (no storage needed)",
            impact: { stakeholder: 5, quality: 5 },
            feedback: "Safe choice. Avoids storage risks and ensures equipment arrives when needed, though you miss the discount."
          },
          {
            text: "Negotiate a delayed delivery with the same discount",
            impact: { budget: 15, stakeholder: 10, timeline: 5 },
            feedback: "Excellent! Creative negotiation that gets the best of both worlds. This is expert-level PM thinking."
          }
        ]
      },
      {
        id: 2,
        question: "During inspection, you discover the ward's air filtration system doesn't meet new pediatric infection control standards updated last month. Upgrading will cost $80k and delay opening by 3 weeks.",
        options: [
          {
            text: "Upgrade immediately to meet the new standards",
            impact: { budget: -15, timeline: -15, quality: 20, stakeholder: 10 },
            feedback: "Correct decision! Patient safety is non-negotiable in healthcare. Regulatory compliance protects the hospital from liability."
          },
          {
            text: "Apply for a temporary waiver while you upgrade gradually",
            impact: { timeline: -5, quality: -10, stakeholder: -15 },
            feedback: "Risky! Waivers are rarely granted for patient safety issues. This could delay opening even more and damage reputation."
          },
          {
            text: "Proceed with opening and upgrade during the first maintenance window",
            impact: { budget: 10, timeline: 10, quality: -30, stakeholder: -25 },
            feedback: "Dangerous! Operating without proper infection control in a pediatric ward is unethical and illegal. This could result in serious consequences."
          }
        ]
      },
      {
        id: 3,
        question: "Nursing staff request an additional week of training on the new pediatric monitoring equipment. The hospital board wants to open on schedule to start generating revenue.",
        options: [
          {
            text: "Provide the extra training week and delay opening",
            impact: { timeline: -10, quality: 15, stakeholder: 15 },
            feedback: "Right choice! Properly trained staff prevent medical errors. One week delay is minor compared to patient safety risks."
          },
          {
            text: "Open on schedule with current training level",
            impact: { budget: 5, timeline: 10, quality: -20, stakeholder: -10 },
            feedback: "Risky! Inadequate training on medical equipment can lead to patient harm and staff stress. Not worth the timeline gain."
          },
          {
            text: "Offer optional overtime training sessions while opening on schedule",
            impact: { budget: -5, quality: 5, stakeholder: 5 },
            feedback: "Reasonable compromise, but not ideal. Tired staff working overtime may not retain training effectively."
          }
        ]
      }
    ]
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
    },
    decisions: [
      {
        id: 1,
        question: "During demolition, contractors discover original Victorian-era stained glass windows hidden behind drywall. Restoring them costs $12k and adds 2 weeks, but significantly increases home value.",
        options: [
          {
            text: "Restore the stained glass windows",
            impact: { budget: -10, timeline: -10, quality: 20, stakeholder: 15 },
            feedback: "Excellent! Historical features are exactly what the homeowners wanted preserved. This adds significant value and character."
          },
          {
            text: "Remove and sell the windows to offset costs",
            impact: { budget: 5, timeline: 5, quality: -15, stakeholder: -25 },
            feedback: "Poor choice! This contradicts the project goal of preserving historical character. Homeowners will be very disappointed."
          },
          {
            text: "Store the windows for potential future installation",
            impact: { budget: -5, stakeholder: -10 },
            feedback: "Weak compromise. You're paying for storage but not delivering value. Make a clear decision now."
          }
        ]
      },
      {
        id: 2,
        question: "The structural engineer finds the foundation has settling issues that weren't visible during inspection. Fixing it properly costs $25k and adds 3 weeks. A 'quick fix' costs $8k but may cause problems in 5-10 years.",
        options: [
          {
            text: "Do the proper foundation repair",
            impact: { budget: -20, timeline: -15, quality: 20, stakeholder: 10 },
            feedback: "Absolutely correct! Foundation issues will only get worse. Proper repair protects the homeowners' investment and your reputation."
          },
          {
            text: "Do the quick fix and disclose it to homeowners",
            impact: { budget: -5, timeline: -5, quality: -15, stakeholder: -20 },
            feedback: "Risky! Even with disclosure, you're knowingly delivering substandard work. This could damage your professional reputation."
          },
          {
            text: "Do the quick fix without disclosure to stay on budget",
            impact: { budget: 5, timeline: 5, quality: -30, stakeholder: -30 },
            feedback: "Unethical and potentially illegal! Concealing structural issues is fraud. This could result in lawsuits and license revocation."
          }
        ]
      },
      {
        id: 3,
        question: "The electrician and plumber both need to work in the kitchen the same week. Scheduling them separately adds 1 week to the timeline. Working simultaneously risks coordination issues and rework.",
        options: [
          {
            text: "Schedule them separately to avoid conflicts",
            impact: { timeline: -10, quality: 10 },
            feedback: "Safe choice! One extra week is worth avoiding costly rework from coordination mistakes."
          },
          {
            text: "Have them work simultaneously with daily coordination meetings",
            impact: { stakeholder: 10, quality: 5 },
            feedback: "Good compromise! Active coordination can make simultaneous work successful. Requires strong project management."
          },
          {
            text: "Have them work simultaneously without special coordination",
            impact: { timeline: 5, quality: -20, budget: -15 },
            feedback: "Recipe for disaster! Trades working on top of each other without coordination leads to mistakes, rework, and conflicts."
          }
        ]
      }
    ]
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
    },
    decisions: [
      {
        id: 1,
        question: "The CEO loves bold, modern design with animations. The marketing director wants clean, minimal design for faster load times and better SEO. They're at an impasse.",
        options: [
          {
            text: "Present data on user behavior and industry best practices to guide the decision",
            impact: { stakeholder: 15, quality: 10, timeline: 5 },
            feedback: "Excellent! Data-driven decisions remove emotion from the debate. This is professional project management."
          },
          {
            text: "Create two design prototypes and let them vote",
            impact: { timeline: -10, budget: -10, stakeholder: 5 },
            feedback: "Reasonable but expensive. Two prototypes double the design work. Better to align on requirements first."
          },
          {
            text: "Side with the CEO since they have final authority",
            impact: { stakeholder: -20, quality: -10 },
            feedback: "Poor choice! Ignoring the marketing director's expertise damages relationships and may hurt website performance."
          }
        ]
      },
      {
        id: 2,
        question: "Developers discover the current CMS is severely outdated. Migrating to a modern CMS adds $15k and 3 weeks but prevents future problems. Working with the old system is risky.",
        options: [
          {
            text: "Migrate to the modern CMS now",
            impact: { budget: -15, timeline: -15, quality: 20, stakeholder: 10 },
            feedback: "Smart long-term thinking! Technical debt always costs more to fix later. This investment protects the company's future."
          },
          {
            text: "Refresh the design on the old CMS and plan migration later",
            impact: { budget: 5, timeline: 5, quality: -15 },
            feedback: "Kicking the can down the road. You'll have to redo this work soon, and the old CMS may cause launch issues."
          },
          {
            text: "Negotiate a phased approach: launch on old CMS, migrate within 6 months",
            impact: { timeline: 5, quality: 5, stakeholder: 10 },
            feedback: "Reasonable compromise if timeline is critical. Requires commitment to follow through on the migration plan."
          }
        ]
      },
      {
        id: 3,
        question: "The content team is 2 weeks behind on writing new website copy. Launching with placeholder text meets the deadline but looks unprofessional. Delaying disappoints the CEO.",
        options: [
          {
            text: "Delay launch until content is ready",
            impact: { timeline: -10, quality: 15, stakeholder: -10 },
            feedback: "Right choice! A website with placeholder text damages credibility. Better to launch properly than quickly."
          },
          {
            text: "Launch with placeholder text and update it later",
            impact: { timeline: 10, quality: -25, stakeholder: -15 },
            feedback: "Very poor! Visitors form first impressions in seconds. Placeholder text makes the company look unprofessional."
          },
          {
            text: "Hire freelance writers to complete content on time",
            impact: { budget: -10, quality: 5, stakeholder: 10 },
            feedback: "Good problem-solving! Bringing in help keeps the project on track. Ensure freelancers match the brand voice."
          }
        ]
      }
    ]
  }
};

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

  const decisions = scenario.decisions;

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
              {decision.options.map((option: any, index: number) => (
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
                          {Object.entries(option.impact).map(([key, value]: [string, any]) => (
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

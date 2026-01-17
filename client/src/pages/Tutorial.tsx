import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Tutorial() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleCheckAnswers = () => {
    setShowResults(true);
  };

  const handleContinue = () => {
    setLocation("/scenarios");
  };

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
          Back to Learning Path
        </Button>
      </div>

      <div className="container py-12 md:py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Tutorial Content */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">Introduction to Project Management</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8">What is Project Management?</h1>

            <div className="bg-card border border-border rounded-xl p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">What is Project Management?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Project management is the application of knowledge, skills, tools, and techniques to project activities 
                  to meet project requirements. In simpler terms, it's the art and science of getting things done—on 
                  time, within budget, and to the required quality standard.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Projects vs Operations</h2>
                <p className="text-muted-foreground mb-4">
                  A project is temporary and creates a unique product, service, or result. Operations are ongoing and 
                  repetitive. For example:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="font-bold text-primary">Project</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Launching a new website (has a start and end date, creates something new)
                    </p>
                  </div>
                  <div className="p-4 bg-accent/50 border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-accent-foreground"></div>
                      <span className="font-bold">Operation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Maintaining the website after launch (ongoing, repetitive tasks)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">The Project Lifecycle</h2>
                <p className="text-muted-foreground mb-4">Every project goes through five phases:</p>
                <div className="space-y-3">
                  {[
                    { phase: "Initiation", desc: "Define the project and get approval" },
                    { phase: "Planning", desc: "Create detailed plans for execution" },
                    { phase: "Execution", desc: "Do the work and create deliverables" },
                    { phase: "Monitoring & Controlling", desc: "Track progress and make adjustments" },
                    { phase: "Closing", desc: "Finalize everything and document lessons learned" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-bold mb-1">{item.phase}</div>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-accent/20 border border-accent rounded-lg p-6">
                <p className="text-sm text-muted-foreground italic">
                  Most project failures happen due to poor planning or unclear requirements, not technical problems!
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">What Makes a Project Successful?</h2>
                <p className="text-muted-foreground mb-4">A successful project delivers:</p>
                <div className="space-y-2">
                  {[
                    "On Time: Meets the agreed timeline",
                    "On Budget: Stays within financial constraints",
                    "Quality: Meets requirements and stakeholder expectations",
                    "Stakeholder Satisfaction: Everyone is happy with the outcome"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Section */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Test Your Knowledge</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="font-bold mb-4">1. Which of the following is an example of a project?</h3>
                <RadioGroup 
                  value={quizAnswers["q1"]} 
                  onValueChange={(val) => setQuizAnswers({...quizAnswers, q1: val})}
                  className="space-y-3"
                >
                  {[
                    "Processing customer orders daily",
                    "Building a new office building",
                    "Weekly team meetings",
                    "Monthly financial reporting"
                  ].map((option, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/30">
                      <RadioGroupItem value={option} id={`q1-${i}`} />
                      <Label htmlFor={`q1-${i}`} className="flex-1 cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {showResults && quizAnswers["q1"] === "Building a new office building" && (
                  <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary">
                    ✓ Correct! Building a new office is temporary and creates something unique.
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold mb-4">2. What is the most common cause of project failure?</h3>
                <RadioGroup 
                  value={quizAnswers["q2"]} 
                  onValueChange={(val) => setQuizAnswers({...quizAnswers, q2: val})}
                  className="space-y-3"
                >
                  {[
                    "Technical problems",
                    "Bad weather",
                    "Poor planning or unclear requirements",
                    "Team members calling in sick"
                  ].map((option, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/30">
                      <RadioGroupItem value={option} id={`q2-${i}`} />
                      <Label htmlFor={`q2-${i}`} className="flex-1 cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {showResults && quizAnswers["q2"] === "Poor planning or unclear requirements" && (
                  <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary">
                    ✓ Correct! Most failures are due to poor planning, not technical issues.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              {!showResults ? (
                <Button 
                  onClick={handleCheckAnswers}
                  disabled={!quizAnswers["q1"] || !quizAnswers["q2"]}
                  className="flex-1"
                >
                  Check Answers
                </Button>
              ) : (
                <Button onClick={handleContinue} className="flex-1">
                  Continue to Practice Scenarios
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

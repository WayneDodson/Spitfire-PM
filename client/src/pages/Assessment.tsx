import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const questions = [
  {
    id: 1,
    question: "How familiar are you with project management?",
    options: [
      "Never heard of it",
      "Heard of it, but no experience",
      "Some experience (1-2 projects)",
      "Regular experience (3+ projects)",
      "Experienced PM professional"
    ]
  },
  {
    id: 2,
    question: "How familiar are you with the Waterfall methodology?",
    options: [
      "Never heard of it",
      "Heard of it, but don't know details",
      "Understand the basics",
      "Have used it before",
      "Expert level"
    ]
  },
  {
    id: 3,
    question: "How familiar are you with Agile/Scrum?",
    options: [
      "Never heard of it",
      "Heard of it, but don't know details",
      "Understand the basics",
      "Have used it before",
      "Expert level"
    ]
  },
  {
    id: 4,
    question: "Have you ever managed a project budget?",
    options: [
      "No, never",
      "No, but I understand the concept",
      "Yes, small budgets (under $10k)",
      "Yes, medium budgets ($10k-$100k)",
      "Yes, large budgets ($100k+)"
    ]
  },
  {
    id: 5,
    question: "Have you ever managed a project team?",
    options: [
      "No, never",
      "No, but I've been part of teams",
      "Yes, small teams (2-3 people)",
      "Yes, medium teams (4-10 people)",
      "Yes, large teams (10+ people)"
    ]
  },
  {
    id: 6,
    question: "How comfortable are you with stakeholder management?",
    options: [
      "Not comfortable at all",
      "Slightly uncomfortable",
      "Somewhat comfortable",
      "Comfortable",
      "Very comfortable"
    ]
  },
  {
    id: 7,
    question: "What's your primary learning goal?",
    options: [
      "Learn PM fundamentals from scratch",
      "Improve existing PM skills",
      "Prepare for PM certification",
      "Learn specific methodologies",
      "Practice decision-making"
    ]
  }
];

export default function Assessment() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setLocation("/learning-path");
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      setLocation("/onboarding");
    }
  };

  const currentQ = questions[currentQuestion];
  const hasAnswer = answers[currentQuestion] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Back Button */}
      <div className="container pt-8">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="container py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8">{currentQ.question}</h2>

            <RadioGroup 
              value={answers[currentQuestion]} 
              onValueChange={handleAnswer}
              className="space-y-4"
            >
              {currentQ.options.map((option, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleAnswer(option)}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="mt-8 flex justify-end">
              <Button 
                size="lg"
                onClick={handleNext}
                disabled={!hasAnswer}
                className="gap-2"
              >
                {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Assessment"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

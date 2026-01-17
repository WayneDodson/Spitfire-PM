import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [goal, setGoal] = useState("");

  const handleContinue = () => {
    if (name && email) {
      setLocation("/assessment");
    }
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
          onClick={() => setLocation("/")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="container py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Project Pro</h1>
            <p className="text-xl text-muted-foreground">
              Let's get to know you so we can personalize your learning experience
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Create Your Profile</h2>
              <p className="text-muted-foreground mb-8">
                Tell us about yourself to help us customize your journey
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Current Role (Optional)</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select your current role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="junior-pm">Junior PM</SelectItem>
                      <SelectItem value="pm">Project Manager</SelectItem>
                      <SelectItem value="senior-pm">Senior PM</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Why are you learning PM? (Optional)</Label>
                  <Select value={goal} onValueChange={setGoal}>
                    <SelectTrigger id="goal">
                      <SelectValue placeholder="Select your learning goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="career-change">Career change</SelectItem>
                      <SelectItem value="skill-up">Skill development</SelectItem>
                      <SelectItem value="certification">Certification prep</SelectItem>
                      <SelectItem value="work-project">Current work project</SelectItem>
                      <SelectItem value="curiosity">Personal interest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleContinue}
              disabled={!name || !email}
            >
              Continue to Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

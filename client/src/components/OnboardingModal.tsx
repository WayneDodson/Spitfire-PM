import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  Target,
  Briefcase,
  GraduationCap,
  Clock,
  ChevronLeft,
} from "lucide-react";

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

const INDUSTRIES = [
  "NHS / Healthcare",
  "Social Care",
  "Local Government",
  "Housing / Property",
  "Finance / Banking",
  "Education",
  "Technology / IT",
  "Retail / Logistics",
  "Construction / Engineering",
  "Charity / Third Sector",
  "Other",
];

const TARGET_ROLES = [
  "Junior Project Manager",
  "Project Coordinator",
  "Project Support Officer",
  "Project Manager",
  "Senior Project Manager",
  "Programme Manager",
  "PMO Analyst",
  "Not sure yet",
];

const CERTIFICATIONS = [
  "Google Project Management Certificate",
  "PRINCE2 Foundation",
  "PRINCE2 Practitioner",
  "APM PMQ",
  "Agile / Scrum",
  "CMI Level 5",
  "None yet",
];

const TIMELINES = [
  { value: "1_month", label: "Within 1 month", desc: "I have interviews lined up" },
  { value: "3_months", label: "1–3 months", desc: "Actively applying soon" },
  { value: "6_months", label: "3–6 months", desc: "Building towards it" },
  { value: "12_months", label: "6–12 months", desc: "Long-term planning" },
  { value: "no_rush", label: "No fixed timeline", desc: "Just want to be ready" },
];

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState("");
  const [currentIndustry, setCurrentIndustry] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [goalTimeline, setGoalTimeline] = useState("");

  const updateCareerContext = trpc.profile.updateCareerContext.useMutation({
    onSuccess: () => {
      toast.success("Welcome! Your profile is set up — let's get started.");
      onComplete();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save profile");
    },
  });

  const toggleCert = (cert: string) => {
    if (cert === "None yet") {
      setSelectedCerts(["None yet"]);
      return;
    }
    setSelectedCerts((prev) => {
      const without = prev.filter((c) => c !== "None yet");
      return without.includes(cert)
        ? without.filter((c) => c !== cert)
        : [...without, cert];
    });
  };

  const handleFinish = () => {
    if (!displayName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    updateCareerContext.mutate({
      displayName: displayName.trim(),
      currentIndustry: currentIndustry || undefined,
      targetRole: targetRole || undefined,
      certifications: selectedCerts.length > 0 ? selectedCerts.join(",") : undefined,
      goalTimeline: (goalTimeline as any) || undefined,
    });
  };

  const canProceedStep1 = displayName.trim().length >= 2;
  const totalSteps = 4;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-lg bg-[#0d1420] border border-white/10 text-white p-0 overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Progress bar */}
        <div className="h-1 bg-white/5">
          <div
            className="h-1 bg-cyan-400 transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {/* Step indicator */}
          <p className="text-xs text-white/30 uppercase tracking-widest mb-6">
            Step {step} of {totalSteps}
          </p>

          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <div className="w-12 h-12 bg-cyan-400/10 rounded-xl flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-black mb-2">Welcome to PM Simulate</h2>
                <p className="text-white/50 text-sm leading-relaxed">
                  You've taken the first step. Let's personalise your experience so the platform
                  works for your specific career transition.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-white/70">
                  What should we call you?
                </Label>
                <Input
                  id="displayName"
                  placeholder="e.g., Sarah"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={50}
                  autoFocus
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-400/50"
                />
                <p className="text-xs text-white/30">
                  This is how we'll address you throughout the platform.
                </p>
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Current industry */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="w-12 h-12 bg-cyan-400/10 rounded-xl flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-black mb-2">Where are you coming from?</h2>
                <p className="text-white/50 text-sm">
                  Your background shapes how we frame scenarios and feedback.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {INDUSTRIES.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => setCurrentIndustry(industry)}
                    className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                      currentIndustry === industry
                        ? "border-cyan-400/60 bg-cyan-400/10 text-white"
                        : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white/70"
                    }`}
                  >
                    {currentIndustry === industry && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 inline mr-1.5" />
                    )}
                    {industry}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-white/40 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                >
                  {currentIndustry ? "Continue" : "Skip for now"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Target role + certifications */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <div className="w-12 h-12 bg-cyan-400/10 rounded-xl flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-black mb-2">What's your target?</h2>
                <p className="text-white/50 text-sm">
                  Tell us the role you're aiming for and any training you've already completed.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-white/70 text-sm">Target role</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TARGET_ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => setTargetRole(role)}
                      className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                        targetRole === role
                          ? "border-cyan-400/60 bg-cyan-400/10 text-white"
                          : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white/70"
                      }`}
                    >
                      {targetRole === role && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 inline mr-1.5" />
                      )}
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-white/70 text-sm">Certifications / training completed</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CERTIFICATIONS.map((cert) => (
                    <button
                      key={cert}
                      onClick={() => toggleCert(cert)}
                      className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                        selectedCerts.includes(cert)
                          ? "border-cyan-400/60 bg-cyan-400/10 text-white"
                          : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white/70"
                      }`}
                    >
                      {selectedCerts.includes(cert) && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 inline mr-1.5" />
                      )}
                      {cert}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setStep(2)}
                  className="text-white/40 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Timeline + finish */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <div className="w-12 h-12 bg-cyan-400/10 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-black mb-2">When do you want to be ready?</h2>
                <p className="text-white/50 text-sm">
                  This helps us calibrate your readiness tracker and set realistic milestones.
                </p>
              </div>

              <div className="space-y-2">
                {TIMELINES.map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setGoalTimeline(value)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      goalTimeline === value
                        ? "border-cyan-400/60 bg-cyan-400/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-semibold text-sm ${goalTimeline === value ? "text-white" : "text-white/60"}`}>
                          {label}
                        </p>
                        <p className="text-xs text-white/30 mt-0.5">{desc}</p>
                      </div>
                      {goalTimeline === value && (
                        <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setStep(3)}
                  className="text-white/40 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button
                  onClick={handleFinish}
                  disabled={updateCareerContext.isPending}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                >
                  {updateCareerContext.isPending ? "Setting up..." : "Start My Journey"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

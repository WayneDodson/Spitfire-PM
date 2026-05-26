/**
 * CancellationFlowModal
 *
 * A 4-step emotionally intelligent cancellation journey.
 * The goal is not to trap users — it is to support them.
 *
 * Step 1 — Why are you leaving? (reason selector)
 * Step 2 — Free PM Career Clarity Call offer (mentor offer)
 * Step 3 — Mentor question form (if accepted)
 * Step 4 — Warm farewell + optional 3-month re-engagement opt-in
 */

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Heart,
  Phone,
  CheckCircle2,
  ArrowRight,
  X,
  Sparkles,
  Clock,
  TrendingUp,
  MessageSquare,
  Calendar,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CancellationReason =
  | "too_expensive"
  | "need_more_time"
  | "not_using_enough"
  | "feel_overwhelmed"
  | "unsure_if_ready"
  | "got_the_job"
  | "struggling_with_interviews"
  | "need_career_advice"
  | "other";

const REASONS: { value: CancellationReason; label: string; supportResponse: string }[] = [
  {
    value: "too_expensive",
    label: "It's too expensive right now",
    supportResponse: "Financial pressure is real. Let's see if there's a way to make this work for you.",
  },
  {
    value: "need_more_time",
    label: "I need more time",
    supportResponse: "Career transitions take time — that's completely normal. There's no rush.",
  },
  {
    value: "not_using_enough",
    label: "I'm not using it enough",
    supportResponse: "Life gets busy. A mentor conversation might help you find a rhythm that works.",
  },
  {
    value: "feel_overwhelmed",
    label: "I feel overwhelmed",
    supportResponse: "Feeling overwhelmed is a sign you care about getting this right — not that you can't do it.",
  },
  {
    value: "unsure_if_ready",
    label: "I'm not sure I'm ready",
    supportResponse: "Readiness rarely arrives before you start. A conversation might change your perspective.",
  },
  {
    value: "got_the_job",
    label: "I got the job! 🎉",
    supportResponse: "That's exactly why this exists. Congratulations — you've earned it.",
  },
  {
    value: "struggling_with_interviews",
    label: "I'm struggling with interviews",
    supportResponse: "Interview confidence is something a mentor conversation can genuinely help with.",
  },
  {
    value: "need_career_advice",
    label: "I need career advice",
    supportResponse: "That's exactly what our free mentor call is for. Let's talk.",
  },
  {
    value: "other",
    label: "Something else",
    supportResponse: "Whatever it is, we'd like to understand — and help if we can.",
  },
];

const HELP_TOPICS = [
  "Interview preparation",
  "CV feedback",
  "Confidence issues",
  "Breaking into PM from another industry",
  "Career transition advice",
  "Stakeholder confidence",
  "Promotion readiness",
  "Understanding real-world PM expectations",
  "General guidance",
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface CancellationFlowModalProps {
  open: boolean;
  onClose: () => void;
  onCancelled: () => void;
  readinessScore?: number;
  levelsCompleted?: number;
  overallProgress?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CancellationFlowModal({
  open,
  onClose,
  onCancelled,
  readinessScore = 0,
  levelsCompleted = 0,
  overallProgress = 0,
}: CancellationFlowModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedReason, setSelectedReason] = useState<CancellationReason | null>(null);
  const [customReason, setCustomReason] = useState("");
  const [cancellationReasonId, setCancellationReasonId] = useState<number | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [mainQuestion, setMainQuestion] = useState("");
  const [currentSituation, setCurrentSituation] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReason = trpc.cancellation.submitReason.useMutation();
  const submitMentorRequest = trpc.cancellation.submitMentorRequest.useMutation();
  const submitReEngagement = trpc.cancellation.submitReEngagement.useMutation();

  const selectedReasonData = REASONS.find((r) => r.value === selectedReason);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  // Step 1 → Submit reason and advance to Step 2
  const handleReasonSubmit = async () => {
    if (!selectedReason) return;
    setIsSubmitting(true);
    try {
      const result = await submitReason.mutateAsync({
        reason: selectedReason,
        customReason: customReason || undefined,
        readinessScore,
        levelsCompleted,
        overallProgress,
      });
      setCancellationReasonId(result.cancellationReasonId);

      // If they got the job, skip mentor offer and go straight to farewell
      if (selectedReason === "got_the_job") {
        setStep(4);
      } else {
        setStep(2);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3 → Submit mentor request
  const handleMentorSubmit = async () => {
    if (!mainQuestion.trim()) return;
    setIsSubmitting(true);
    try {
      await submitMentorRequest.mutateAsync({
        cancellationReasonId: cancellationReasonId ?? undefined,
        helpTopics: selectedTopics,
        mainQuestion,
        currentSituation: currentSituation || undefined,
        desiredOutcome: desiredOutcome || undefined,
      });
      toast.success("We'll be in touch to arrange your free call.");
      setStep(4);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 4 → Submit re-engagement preference and complete cancellation
  const handleFarewell = async (optIn: boolean) => {
    setIsSubmitting(true);
    try {
      await submitReEngagement.mutateAsync({
        cancellationReasonId: cancellationReasonId ?? undefined,
        optedIn: optIn,
      });
      if (optIn) {
        toast.success("We'll check in with you in 3 months. Take care.");
      } else {
        toast.success("Your membership has been cancelled. Your progress is still here when you're ready.");
      }
      onCancelled();
    } catch {
      toast.error("Something went wrong cancelling your subscription. Please contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset state on close
    setStep(1);
    setSelectedReason(null);
    setCustomReason("");
    setCancellationReasonId(null);
    setSelectedTopics([]);
    setMainQuestion("");
    setCurrentSituation("");
    setDesiredOutcome("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-lg bg-[#0d1117] border border-border text-white p-0 overflow-hidden">

        {/* ── Step 1: Why are you leaving? ─────────────────────────────── */}
        {step === 1 && (
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-foreground/40 uppercase tracking-widest mb-1">Before you go</p>
                <h2 className="text-2xl font-black">What's stopping you right now?</h2>
                <p className="text-foreground/50 text-sm mt-2">
                  Your answer helps us understand — and might help us support you better.
                </p>
              </div>
              <button onClick={handleClose} className="text-foreground/30 hover:text-foreground/60 mt-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 mb-6">
              {REASONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setSelectedReason(r.value)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                    selectedReason === r.value
                      ? "border-cyan-400/60 bg-cyan-400/10 text-white"
                      : "border-border bg-muted/50 text-foreground/60 hover:border-border/70 hover:text-foreground/80"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {selectedReason === "other" && (
              <Textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Tell us a bit more…"
                className="mb-4 bg-white/5 border-border text-foreground placeholder:text-foreground/30 resize-none"
                rows={3}
              />
            )}

            {selectedReasonData && selectedReason !== "other" && (
              <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-xl p-4 mb-4">
                <p className="text-cyan-300 text-sm italic">"{selectedReasonData.supportResponse}"</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleReasonSubmit}
                disabled={!selectedReason || isSubmitting}
                className="flex-1 bg-white text-black hover:bg-white/90 font-bold"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-foreground/40 hover:text-foreground/60"
              >
                Keep membership
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Free Mentor Call Offer ───────────────────────────── */}
        {step === 2 && (
          <div className="p-8">
            <div className="flex items-start justify-between mb-2">
              <div className="w-12 h-12 bg-cyan-400/10 rounded-2xl flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-cyan-400" />
              </div>
              <button onClick={handleClose} className="text-foreground/30 hover:text-foreground/60">
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2 className="text-2xl font-black mb-2">Free PM Career Clarity Call</h2>
            <p className="text-foreground/60 text-sm mb-6 leading-relaxed">
              Before you leave, would a free conversation with an experienced Project Manager help you move forward?
            </p>

            <div className="space-y-3 mb-6">
              {[
                { icon: MessageSquare, text: "Sometimes one real conversation creates more progress than another week of studying." },
                { icon: TrendingUp, text: "You are closer than you think. Confidence often arrives after capability." },
                { icon: Heart, text: "Let's make sure you're leaving for the right reason — not because self-doubt is winning." },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 text-sm text-foreground/60">
                  <Icon className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="bg-muted/60 border border-border rounded-xl p-4 mb-6">
              <p className="text-xs text-foreground/40 uppercase tracking-widest mb-2">What you'll get</p>
              <ul className="space-y-1.5 text-sm text-foreground/70">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0" /> A 30-minute call with an experienced PM</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0" /> Honest advice on your specific situation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0" /> No sales pitch — just genuine guidance</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0" /> Completely free, no obligation</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setStep(3)}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Yes — I'd like a free clarity call
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStep(4)}
                className="w-full text-foreground/40 hover:text-foreground/60 text-sm"
              >
                No thanks — continue with cancellation
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Mentor Question Form ─────────────────────────────── */}
        {step === 3 && (
          <div className="p-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-cyan-400 uppercase tracking-widest mb-1">Free Mentor Call</p>
                <h2 className="text-2xl font-black">Tell us what you need</h2>
                <p className="text-foreground/50 text-sm mt-1">
                  The more you share, the more we can prepare to genuinely help you.
                </p>
              </div>
              <button onClick={handleClose} className="text-foreground/30 hover:text-foreground/60">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Help topics */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-foreground/80 mb-3">What would you like help with?</p>
              <div className="flex flex-wrap gap-2">
                {HELP_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      selectedTopics.includes(topic)
                        ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-300"
                        : "border-border bg-muted/50 text-foreground/50 hover:border-border/70 hover:text-foreground/70"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Main question */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-foreground/80 block mb-2">
                What's the main question you want answered? <span className="text-red-400">*</span>
              </label>
              <Textarea
                value={mainQuestion}
                onChange={(e) => setMainQuestion(e.target.value)}
                placeholder="Tell us where you are, what you're struggling with, and what clarity you're hoping for…"
                className="bg-white/5 border-border text-foreground placeholder:text-foreground/30 resize-none"
                rows={4}
              />
              <p className="text-xs text-foreground/30 mt-1">{mainQuestion.length} / 2000 characters</p>
            </div>

            {/* Current situation */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-foreground/80 block mb-2">
                Where are you in your career transition right now?
              </label>
              <Textarea
                value={currentSituation}
                onChange={(e) => setCurrentSituation(e.target.value)}
                placeholder="e.g. I've been in the NHS for 8 years and I'm trying to move into a PM role…"
                className="bg-white/5 border-border text-foreground placeholder:text-foreground/30 resize-none"
                rows={3}
              />
            </div>

            {/* Desired outcome */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-foreground/80 block mb-2">
                What outcome are you hoping for from this call?
              </label>
              <Textarea
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                placeholder="e.g. I want to understand what's actually holding me back from getting interviews…"
                className="bg-white/5 border-border text-foreground placeholder:text-foreground/30 resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleMentorSubmit}
                disabled={!mainQuestion.trim() || mainQuestion.length < 10 || isSubmitting}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-black"
              >
                {isSubmitting ? "Submitting…" : "Request my free call"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStep(4)}
                className="text-foreground/40 hover:text-foreground/60"
              >
                Skip
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 4: Warm Farewell + Re-Engagement Opt-In ─────────────── */}
        {step === 4 && (
          <div className="p-8">
            {selectedReason === "got_the_job" ? (
              /* Special farewell for people who got the job */
              <>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">🎉</div>
                  <h2 className="text-2xl font-black mb-2">You did it.</h2>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    This is exactly what this platform exists for. Congratulations on your new PM role — you've earned every bit of it.
                  </p>
                </div>
                <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-xl p-4 mb-6">
                  <p className="text-cyan-300 text-sm italic text-center">
                    "Your progress still matters. Everything you practised here is now real experience."
                  </p>
                </div>
                <Button
                  onClick={() => handleFarewell(false)}
                  disabled={isSubmitting}
                  className="w-full bg-white text-black hover:bg-white/90 font-bold"
                >
                  {isSubmitting ? "Completing…" : "Complete cancellation"}
                </Button>
              </>
            ) : (
              /* Standard farewell with re-engagement opt-in */
              <>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-rose-400" />
                  </div>
                </div>

                <h2 className="text-2xl font-black mb-2">Before you go…</h2>
                <p className="text-foreground/60 text-sm mb-6 leading-relaxed">
                  Would you mind if we checked in with you in 3 months to see how your Project Management journey is going?
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    { icon: Clock, text: "Career transitions take time. Sometimes the right opportunity arrives later." },
                    { icon: TrendingUp, text: "Your progress still matters. You are closer than you think." },
                    { icon: Sparkles, text: "Sometimes confidence arrives after capability — not before." },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-start gap-3 text-sm text-foreground/50">
                      <Icon className="h-4 w-4 text-foreground/30 flex-shrink-0 mt-0.5" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-muted/60 border border-border rounded-xl p-4 mb-6">
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    Your goal matters. Sometimes the right next step is timing, confidence, or simply the right opportunity appearing.
                    We'd love the chance to support you again if you still want to make Project Management your next career move.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => handleFarewell(true)}
                    disabled={isSubmitting}
                    className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-semibold"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Yes — check in with me in 3 months
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleFarewell(false)}
                    disabled={isSubmitting}
                    className="w-full text-foreground/40 hover:text-foreground/60 text-sm"
                  >
                    {isSubmitting ? "Completing…" : "No thanks — I'd prefer not to be contacted"}
                  </Button>
                </div>

                <p className="text-xs text-foreground/20 text-center mt-4">
                  Your progress will still be here when you're ready.
                </p>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

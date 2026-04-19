/**
 * FounderAccessModal — celebration screen shown when a user earns Founder Access.
 *
 * Framed as earned access, not a discount.
 * Shown once when founderAccessEarned transitions from false → true.
 */

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Star, CheckCircle2, Zap } from "lucide-react";

interface FounderAccessModalProps {
  open: boolean;
  onClose: () => void;
}

export function FounderAccessModal({ open, onClose }: FounderAccessModalProps) {
  const [, navigate] = useLocation();

  const handleClaim = () => {
    onClose();
    navigate("/subscribe?tier=founder");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#0a1628] border border-cyan-500/30 text-white p-0 overflow-hidden">
        {/* Glow top */}
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-500" />

        <div className="p-8 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-cyan-400/10 rounded-full flex items-center justify-center">
                <Star className="h-10 w-10 text-cyan-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-cyan-400/70 font-semibold">
              Commitment Reward Activated
            </p>
            <h2 className="text-3xl font-black text-white leading-tight">
              You Unlocked<br />
              <span className="text-cyan-400">Founder Access</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Your consistency during the free trial has earned you PM Readiness Member Pricing.
              This is not a discount — this is what commitment looks like.
            </p>
          </div>

          {/* What they earned */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-left space-y-3">
            <p className="text-xs text-white/40 uppercase tracking-wider">You earned</p>
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Founder Access</span>
              <div className="text-right">
                <span className="text-2xl font-black text-cyan-400">£19</span>
                <span className="text-white/40 text-sm">/month</span>
              </div>
            </div>
            <p className="text-xs text-white/30">
              First 6 months at Founder pricing · then £39/month · cancel anytime
            </p>
            <div className="pt-1 space-y-1.5">
              {[
                "Full access to all 7 levels",
                "All simulations and scenarios",
                "PM Readiness Certificate",
                "Interview preparation toolkit",
                "Lifetime access to your progress",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs text-white/60">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Button
              onClick={handleClaim}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-base py-6"
            >
              <Zap className="h-5 w-5 mr-2" />
              Claim Founder Access — £19/month
            </Button>
            <button
              onClick={onClose}
              className="text-xs text-white/25 hover:text-white/40 transition-colors"
            >
              I'll claim this later
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

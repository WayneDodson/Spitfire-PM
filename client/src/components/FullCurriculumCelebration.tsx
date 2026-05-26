import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Trophy, Star, CheckCircle2, Rocket, Heart } from "lucide-react";
import ShareProgress from "@/components/ShareProgress";

interface FullCurriculumCelebrationProps {
  userName?: string;
  onDismiss: () => void;
}

export default function FullCurriculumCelebration({ userName, onDismiss }: FullCurriculumCelebrationProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const colours = ["#22d3ee", "#f59e0b", "#10b981", "#a855f7", "#ef4444", "#ffffff"];

    // Opening burst
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.5 },
      colors: colours,
      scalar: 1.4,
    });

    // Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.65 },
        colors: colours,
      });
    }, 300);

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.65 },
        colors: colours,
      });
    }, 500);

    // Sustained shower — 5 seconds
    const end = Date.now() + 5000;
    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.65 },
        colors: colours,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.65 },
        colors: colours,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    setTimeout(frame, 800);

    // Final top-down shower at 3s
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.1 },
        colors: colours,
        scalar: 1.2,
        gravity: 0.8,
      });
    }, 3000);
  }, []);

  const firstName = userName?.split(" ")[0] || "there";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onDismiss}
    >
      <div
        className="relative bg-card border border-cyan-400/30 rounded-2xl shadow-2xl max-w-xl w-full p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-400/10 via-transparent to-amber-400/10 pointer-events-none" />

        {/* Trophy */}
        <div className="text-7xl leading-none">🏆</div>

        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400/20 to-amber-400/20 border border-cyan-400/30 flex items-center justify-center">
            <Trophy className="h-10 w-10 text-cyan-400" />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black text-foreground">
            You've done it{firstName !== "there" ? `, ${firstName}` : ""}!
          </h2>
          <p className="text-cyan-400 font-bold text-lg mt-1">
            Full Curriculum Complete
          </p>
        </div>

        <p className="text-foreground/70 leading-relaxed text-base max-w-md mx-auto">
          You now know what you need to know to get a position as a Project Manager.
          You've put in the work, made the decisions, and built the proof. Keep up the
          training, keep applying, and you <span className="text-cyan-400 font-semibold">will</span> get there.
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star
              key={i}
              className="h-6 w-6 text-amber-400 fill-amber-400"
            />
          ))}
        </div>

        {/* Milestone badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "7 Levels Complete" },
            { icon: <Rocket className="h-3.5 w-3.5" />, label: "Advanced Sims Cleared" },
            { icon: <Heart className="h-3.5 w-3.5" />, label: "Interview Ready" },
          ].map((badge) => (
            <span
              key={badge.label}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
            >
              {badge.icon}
              {badge.label}
            </span>
          ))}
        </div>

        {/* Share */}
        <div className="pt-1">
          <ShareProgress
            achievement="I just completed the full Spitfire PM curriculum — 7 levels, all simulations, interview-ready! 🏆"
          />
        </div>

        <Button onClick={onDismiss} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-base py-5 mt-2">
          <Rocket className="h-5 w-5 mr-2" />
          Keep Training — Keep Applying
        </Button>

        <p className="text-xs text-foreground/30">Click anywhere outside to close</p>
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Trophy, Star, CheckCircle2, Share2 } from "lucide-react";
import ShareProgress from "@/components/ShareProgress";

type Difficulty = "beginner" | "intermediate" | "advanced";

const TIER_META: Record<Difficulty, {
  emoji: string;
  title: string;
  subtitle: string;
  message: string;
  colours: [string, string, string];
  shareText: string;
}> = {
  beginner: {
    emoji: "🌱",
    title: "Beginner Tier Complete!",
    subtitle: "You've mastered the foundations of project management.",
    message: "Every scenario in the Beginner tier is behind you. You now have a solid grounding in core PM decisions — the kind of thinking that gets you noticed in interviews and on the job.",
    colours: ["#22c55e", "#86efac", "#ffffff"],
    shareText: "I just completed all Beginner simulations on Spitfire PM — my PM foundation is solid! 🌱",
  },
  intermediate: {
    emoji: "⚡",
    title: "Intermediate Tier Complete!",
    subtitle: "You can handle competing priorities and complex stakeholders.",
    message: "Every Intermediate scenario cleared. You've demonstrated you can navigate ambiguity, manage stakeholders, and make sound decisions under pressure — that's genuine PM competence.",
    colours: ["#eab308", "#fde047", "#ffffff"],
    shareText: "I just completed all Intermediate simulations on Spitfire PM — I can handle real PM complexity! ⚡",
  },
  advanced: {
    emoji: "🏆",
    title: "Advanced Tier Complete!",
    subtitle: "You're interview-ready and job-ready.",
    message: "Every Advanced scenario done. You've proven you can manage crises, lead projects from initiation to close, and answer the toughest PM interview questions. You are ready.",
    colours: ["#ef4444", "#f97316", "#fbbf24"],
    shareText: "I just completed ALL Advanced simulations on Spitfire PM — I'm interview-ready and job-ready! 🏆",
  },
};

interface TierCelebrationProps {
  tier: Difficulty;
  onDismiss: () => void;
}

export default function TierCelebration({ tier, onDismiss }: TierCelebrationProps) {
  const meta = TIER_META[tier];
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const [c1, c2, c3] = meta.colours;

    // Initial burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: [c1, c2, c3],
      scalar: 1.2,
    });

    // Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: [c1, c2, c3],
      });
    }, 300);

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: [c1, c2, c3],
      });
    }, 500);

    // Sustained shower for advanced
    if (tier === "advanced") {
      const end = Date.now() + 3000;
      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: [c1, c2, c3],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: [c1, c2, c3],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      setTimeout(frame, 800);
    }
  }, [tier, meta.colours]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onDismiss}
    >
      <div
        className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Big emoji */}
        <div className="text-6xl leading-none">{meta.emoji}</div>

        {/* Trophy icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">{meta.title}</h2>
          <p className="text-primary font-semibold mt-1">{meta.subtitle}</p>
        </div>

        {/* Message */}
        <p className="text-muted-foreground leading-relaxed text-sm">{meta.message}</p>

        {/* Stars decoration */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <Star
              key={i}
              className="h-6 w-6 text-yellow-500 fill-yellow-500"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>

        {/* Share */}
        <div className="pt-2">
          <ShareProgress achievement={meta.shareText} />
        </div>

        {/* Dismiss */}
        <Button onClick={onDismiss} className="w-full mt-2">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Continue
        </Button>

        <p className="text-xs text-muted-foreground">Click anywhere outside to close</p>
      </div>
    </div>
  );
}

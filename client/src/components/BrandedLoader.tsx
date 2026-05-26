/**
 * BrandedLoader — full-screen loading state with Spitfire PM logo mark.
 * Replaces the plain black screen with a consistent branded experience.
 */
import { Target } from "lucide-react";

interface BrandedLoaderProps {
  message?: string;
}

export function BrandedLoader({ message }: BrandedLoaderProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-5">
      {/* Logo mark */}
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Target className="h-7 w-7 text-white" />
        </div>
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/40 animate-spin" style={{ animationDuration: "2s" }} />
      </div>

      {/* Wordmark */}
      <span className="font-bold text-lg tracking-tight text-foreground">Spitfire PM</span>

      {/* Optional message */}
      {message && (
        <p className="text-sm text-foreground/40">{message}</p>
      )}
    </div>
  );
}

/**
 * FocusResetProvider — PM Simulate Performance System
 *
 * Wraps the application and tracks active user time.
 * Triggers:
 *   - FocusResetOverlay every 20 minutes of active use
 *   - HydrationReminder every 60 minutes of active use
 *
 * "Active" = user has interacted (mouse move, click, keypress, scroll)
 * within the last 60 seconds. Pauses when tab is hidden.
 *
 * Session limits:
 *   - Max 3 skips per session for the focus reset
 *   - Hydration reminder can be snoozed for 10 minutes
 */

import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { toast } from "sonner";
import FocusResetOverlay from "./FocusResetOverlay";

// ─── Context ──────────────────────────────────────────────────────────────────

interface FocusResetContextValue {
  activeSeconds: number;
  sessionResets: number;
  sessionHydrations: number;
}

const FocusResetContext = createContext<FocusResetContextValue>({
  activeSeconds: 0,
  sessionResets: 0,
  sessionHydrations: 0,
});

export const useFocusReset = () => useContext(FocusResetContext);

// ─── Constants ────────────────────────────────────────────────────────────────

const FOCUS_RESET_INTERVAL = 20 * 60; // 20 minutes in seconds
const HYDRATION_INTERVAL = 60 * 60;   // 60 minutes in seconds
const INACTIVITY_THRESHOLD = 60;       // pause timer after 60s of no interaction
const MAX_SKIPS_PER_SESSION = 3;
const HYDRATION_SNOOZE_DURATION = 10 * 60; // 10 minutes

// ─── Hydration messages ───────────────────────────────────────────────────────

const HYDRATION_MESSAGES = [
  {
    headline: "Drink a glass of water.",
    sub: "Small habits create big outcomes.",
  },
  {
    headline: "High performers protect their energy.",
    sub: "Take 60 seconds. Hydrate. Reset. Continue.",
  },
  {
    headline: "Focus needs fuel.",
    sub: "Water first. Then progress.",
  },
  {
    headline: "Leadership starts with discipline.",
    sub: "Drink water. Return stronger.",
  },
  {
    headline: "Project Managers protect their focus.",
    sub: "Hydration is part of the system.",
  },
];

// ─── Provider ─────────────────────────────────────────────────────────────────

interface FocusResetProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export default function FocusResetProvider({
  children,
  enabled = true,
}: FocusResetProviderProps) {
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [showReset, setShowReset] = useState(false);
  const [skipsRemaining, setSkipsRemaining] = useState(MAX_SKIPS_PER_SESSION);
  const [sessionResets, setSessionResets] = useState(0);
  const [sessionHydrations, setSessionHydrations] = useState(0);

  const lastInteractionRef = useRef(Date.now());
  const hydrationSnoozedUntilRef = useRef(0);
  const nextResetAtRef = useRef(FOCUS_RESET_INTERVAL);
  const nextHydrationAtRef = useRef(HYDRATION_INTERVAL);

  // Track user activity
  const recordInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart", "click"];
    events.forEach((e) => window.addEventListener(e, recordInteraction, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, recordInteraction));
  }, [enabled, recordInteraction]);

  // Main timer — ticks every second when user is active and tab is visible
  useEffect(() => {
    if (!enabled) return;

    const tick = setInterval(() => {
      // Pause if tab is hidden
      if (document.hidden) return;

      // Pause if user has been inactive for more than INACTIVITY_THRESHOLD seconds
      const secondsSinceInteraction = (Date.now() - lastInteractionRef.current) / 1000;
      if (secondsSinceInteraction > INACTIVITY_THRESHOLD) return;

      // Don't tick if reset overlay is showing
      if (showReset) return;

      setActiveSeconds((prev) => {
        const next = prev + 1;

        // Check focus reset trigger
        if (next >= nextResetAtRef.current) {
          nextResetAtRef.current = next + FOCUS_RESET_INTERVAL;
          setShowReset(true);
        }

        // Check hydration trigger
        if (
          next >= nextHydrationAtRef.current &&
          Date.now() > hydrationSnoozedUntilRef.current
        ) {
          nextHydrationAtRef.current = next + HYDRATION_INTERVAL;
          const msg = HYDRATION_MESSAGES[sessionHydrations % HYDRATION_MESSAGES.length];
          showHydrationToast(msg, () => {
            // Snooze: delay next trigger by 10 minutes from now
            hydrationSnoozedUntilRef.current = Date.now() + HYDRATION_SNOOZE_DURATION * 1000;
            nextHydrationAtRef.current = next + HYDRATION_SNOOZE_DURATION;
          });
          setSessionHydrations((h) => h + 1);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [enabled, showReset, sessionHydrations]);

  const handleResetComplete = useCallback(() => {
    setShowReset(false);
    setSessionResets((r) => r + 1);
  }, []);

  const handleResetSkip = useCallback(() => {
    setSkipsRemaining((s) => Math.max(0, s - 1));
    setShowReset(false);
  }, []);

  return (
    <FocusResetContext.Provider value={{ activeSeconds, sessionResets, sessionHydrations }}>
      {children}
      {showReset && (
        <FocusResetOverlay
          onComplete={handleResetComplete}
          onSkip={handleResetSkip}
          skipsRemaining={skipsRemaining}
        />
      )}
    </FocusResetContext.Provider>
  );
}

// ─── Hydration Toast ─────────────────────────────────────────────────────────

function showHydrationToast(
  msg: { headline: string; sub: string },
  onSnooze: () => void
) {
  toast.custom(
    (id) => (
      <div className="flex items-start gap-4 bg-[#0d1526] border border-sky-500/20 rounded-2xl p-5 shadow-2xl max-w-sm w-full">
        <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-xl">💧</span>
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-white font-bold text-sm">{msg.headline}</p>
          <p className="text-white/50 text-xs">{msg.sub}</p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => toast.dismiss(id)}
              className="px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 rounded-lg text-sky-300 text-xs font-medium transition-colors"
            >
              Done ✓
            </button>
            <button
              onClick={() => {
                onSnooze();
                toast.dismiss(id);
              }}
              className="px-3 py-1.5 text-white/30 hover:text-white/50 text-xs transition-colors"
            >
              Snooze 10 min
            </button>
          </div>
        </div>
      </div>
    ),
    {
      duration: 30000, // 30 seconds before auto-dismiss
      position: "bottom-right",
    }
  );
}

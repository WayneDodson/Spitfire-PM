/**
 * AddToCalendar.tsx
 * Reusable "Add to Calendar" button group for coaching sessions.
 *
 * Props:
 *   googleUrl  — Google Calendar "add event" URL (opens in new tab)
 *   appleUrl   — URL to download the .ics file (Apple Calendar / Outlook desktop)
 *   outlookUrl — Outlook Web "add event" URL (opens in new tab)
 *   className  — optional extra classes on the container
 *   compact    — when true, shows icon-only buttons (for tight spaces)
 */

import { Calendar, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddToCalendarProps {
  googleUrl: string;
  appleUrl: string;
  outlookUrl: string;
  className?: string;
  compact?: boolean;
}

export function AddToCalendar({ googleUrl, appleUrl, outlookUrl, className = "", compact = false }: AddToCalendarProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Section header */}
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
        <Calendar className="h-4 w-4 text-cyan-400" />
        Add to your calendar
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Google Calendar */}
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-border hover:bg-white/10 hover:border-cyan-500/40 text-sm font-medium text-foreground transition-all duration-150"
        >
          {/* Google "G" icon */}
          <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {!compact && "Google Calendar"}
          <ExternalLink className="h-3 w-3 opacity-50" />
        </a>

        {/* Apple Calendar (.ics download) */}
        <a
          href={appleUrl}
          download
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-border hover:bg-white/10 hover:border-cyan-500/40 text-sm font-medium text-foreground transition-all duration-150"
        >
          {/* Apple icon */}
          <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 fill-current" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          {!compact && "Apple Calendar"}
          <Download className="h-3 w-3 opacity-50" />
        </a>

        {/* Outlook Web */}
        <a
          href={outlookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-border hover:bg-white/10 hover:border-cyan-500/40 text-sm font-medium text-foreground transition-all duration-150"
        >
          {/* Outlook icon */}
          <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" aria-hidden="true">
            <rect x="1" y="4" width="14" height="16" rx="1.5" fill="#0078D4" />
            <path d="M8 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" fill="#fff" />
            <rect x="15" y="4" width="8" height="16" rx="1.5" fill="#0078D4" opacity=".6" />
            <path d="M15 8h8M15 12h8M15 16h8" stroke="#fff" strokeWidth="1.2" />
          </svg>
          {!compact && "Outlook"}
          <ExternalLink className="h-3 w-3 opacity-50" />
        </a>
      </div>

      <p className="text-xs text-muted-foreground">
        Apple Calendar and Outlook desktop: click "Apple Calendar" to download the .ics file, then open it.
      </p>
    </div>
  );
}

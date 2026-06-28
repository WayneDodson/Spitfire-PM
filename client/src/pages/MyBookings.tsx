/**
 * MyBookings.tsx
 * User-facing page listing all coaching bookings for the logged-in user,
 * with "Add to Calendar" buttons for any confirmed/scheduled sessions.
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { AppHeader } from "@/components/AppHeader";
import { AddToCalendar } from "@/components/AddToCalendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Video,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

// ── Status badge colours ──────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  pending_review: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  accepted: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  declined: "bg-red-500/15 text-red-400 border-red-500/30",
  payment_pending: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  confirmed: "bg-green-500/15 text-green-400 border-green-500/30",
  scheduled: "bg-green-500/15 text-green-400 border-green-500/30",
  completed: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  no_show: "bg-red-500/15 text-red-400 border-red-500/30",
  cancelled: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  rescheduled: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  pending_review: "Pending Review",
  accepted: "Accepted",
  declined: "Declined",
  payment_pending: "Payment Pending",
  confirmed: "Confirmed",
  scheduled: "Scheduled",
  completed: "Completed",
  no_show: "No Show",
  cancelled: "Cancelled",
  rescheduled: "Rescheduled",
};

// Statuses where a calendar event is meaningful
const CALENDAR_STATUSES = new Set(["confirmed", "scheduled", "rescheduled", "accepted"]);

type Booking = {
  id: number;
  status: string;
  scheduledAt: Date | null;
  meetingLink?: string | null;
  createdAt: Date;
  service?: { name: string; durationMinutes: number } | null;
  calendarUrls?: { google: string; apple: string; outlook: string } | null;
};

function BookingCard({ booking }: { booking: Booking }) {
  const [expanded, setExpanded] = useState(false);

  const hasCalendar =
    CALENDAR_STATUSES.has(booking.status) &&
    booking.scheduledAt &&
    booking.calendarUrls;

  const scheduledDate = booking.scheduledAt
    ? new Date(booking.scheduledAt).toLocaleString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : null;

  const statusStyle = STATUS_STYLES[booking.status] ?? "bg-slate-500/15 text-slate-400 border-slate-500/30";
  const statusLabel = STATUS_LABELS[booking.status] ?? booking.status;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-cyan-500/30">
      {/* Card header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground truncate">
              {booking.service?.name ?? "PM Coaching Session"}
            </span>
            <Badge
              variant="outline"
              className={`text-xs px-2 py-0.5 border ${statusStyle}`}
            >
              {statusLabel}
            </Badge>
          </div>

          {scheduledDate ? (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-cyan-400" />
              <span>{scheduledDate}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Date to be confirmed</span>
            </div>
          )}

          {booking.meetingLink && (
            <div className="flex items-center gap-1.5 text-sm">
              <Video className="h-3.5 w-3.5 flex-shrink-0 text-cyan-400" />
              <a
                href={booking.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 truncate max-w-xs"
              >
                Join meeting
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {hasCalendar && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Add to Calendar
              {expanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expandable calendar section */}
      {hasCalendar && expanded && booking.calendarUrls && (
        <div className="border-t border-border bg-background/50 px-5 py-4">
          <AddToCalendar
            googleUrl={booking.calendarUrls.google}
            appleUrl={booking.calendarUrls.apple}
            outlookUrl={booking.calendarUrls.outlook}
          />
        </div>
      )}

      {/* Booking meta */}
      <div className="px-5 pb-3 text-xs text-muted-foreground">
        Booking #{booking.id} &middot; Submitted{" "}
        {new Date(booking.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>
    </div>
  );
}

export default function MyBookings() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: bookings, isLoading, error } = trpc.coaching.getMyBookings.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader activePath="/my-bookings" />
        <div className="container max-w-3xl py-24 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader activePath="/my-bookings" />
        <div className="container max-w-2xl py-24 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto">
            <CalendarDays className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold">Sign in to view your bookings</h1>
          <p className="text-muted-foreground">
            Your coaching session history and calendar links are available after signing in.
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader activePath="/my-bookings" />

      <div className="container max-w-3xl py-12">
        {/* Page header */}
        <div className="mb-8 space-y-1">
          <h1 className="text-3xl font-bold">My Coaching Bookings</h1>
          <p className="text-muted-foreground">
            View your session history and add confirmed sessions to your calendar.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Failed to load bookings. Please refresh the page.</span>
          </div>
        )}

        {!isLoading && !error && bookings && bookings.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <CalendarDays className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No bookings yet</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              You have not made any coaching booking requests. Book your free 20-minute PM Career Assessment to get started.
            </p>
            <Button
              onClick={() => setLocation("/one-to-one-coaching/assessment")}
              className="bg-amber-500 hover:bg-amber-600 text-white mt-2"
            >
              Book a Free Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {!isLoading && !error && bookings && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking as Booking} />
            ))}

            <div className="pt-4 text-center">
              <Button
                variant="outline"
                onClick={() => setLocation("/one-to-one-coaching")}
              >
                Book Another Session
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

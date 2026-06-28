/**
 * coachingCalendar.ts
 * Express handler for ICS file downloads + server-side calendar URL builders.
 *
 * Route: GET /api/coaching/calendar/:bookingId.ics
 *
 * The route is intentionally unauthenticated so that users can open the link
 * directly from an email client without needing to be logged in.  The booking
 * ID is not secret, but the ICS file only exposes the session title, time, and
 * meeting link — no personal form data.
 */

import type { Request, Response } from "express";
import { getDb } from "./db";
import { coachingBookings, coachingServices } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { generateIcs, buildGoogleCalendarUrl, buildOutlookUrl, type CalendarEventParams } from "./calendarUtils";

const APP_URL = process.env.APP_URL ?? "https://www.spitfire-pm.com";
const ORGANISER_EMAIL = process.env.EMAIL_FROM_ADDRESS ?? "support@spitfireitsolutions.com";

// ── Build CalendarEventParams from a booking + service row ───────────────────
export function buildCalendarParams(
  booking: {
    id: number;
    fullName: string;
    scheduledAt: Date;
    meetingLink?: string | null;
    timezone?: string | null;
  },
  service: {
    name: string;
    durationMinutes: number;
  },
): CalendarEventParams {
  const description =
    `Your ${service.name} with Spitfire PM has been confirmed.\n\n` +
    `Duration: ${service.durationMinutes} minutes\n` +
    (booking.meetingLink ? `Meeting link: ${booking.meetingLink}\n` : "") +
    `\nIf you need to reschedule or cancel, please email support@spitfireitsolutions.com at least 24 hours in advance.`;

  return {
    title: `Spitfire PM — ${service.name}`,
    description,
    location: booking.meetingLink ?? undefined,
    startUtc: booking.scheduledAt,
    durationMinutes: service.durationMinutes,
    uid: `coaching-${booking.id}@spitfire-pm.com`,
    organiserEmail: ORGANISER_EMAIL,
    meetingLink: booking.meetingLink ?? undefined,
  };
}

// ── ICS download handler ──────────────────────────────────────────────────────
export async function handleCoachingIcsDownload(req: Request, res: Response) {
  const rawId = req.params.bookingId;
  const bookingId = parseInt(rawId, 10);

  if (!bookingId || isNaN(bookingId)) {
    return res.status(400).send("Invalid booking ID");
  }

  try {
    const db = await getDb();
    if (!db) return res.status(503).send("Database unavailable");

    const [booking] = await db
      .select()
      .from(coachingBookings)
      .where(eq(coachingBookings.id, bookingId))
      .limit(1);

    if (!booking) return res.status(404).send("Booking not found");
    if (!booking.scheduledAt) return res.status(400).send("Session not yet scheduled");

    const [service] = await db
      .select()
      .from(coachingServices)
      .where(eq(coachingServices.id, booking.serviceId))
      .limit(1);

    const svc = service ?? { name: "PM Coaching Session", durationMinutes: 20 };

    const params = buildCalendarParams({ ...booking, scheduledAt: booking.scheduledAt as Date }, svc);
    const icsContent = generateIcs(params);

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="spitfire-pm-coaching-${bookingId}.ics"`);
    res.setHeader("Cache-Control", "no-store");
    return res.send(icsContent);
  } catch (err) {
    console.error("[CoachingCalendar] ICS download error:", err);
    return res.status(500).send("Failed to generate calendar file");
  }
}

// ── Exported URL builders (used by tRPC procedures and email templates) ───────
export { buildGoogleCalendarUrl, buildOutlookUrl };
export { buildCalendarParams as buildCoachingCalendarParams };

/**
 * Build all three calendar URLs for a given booking.
 * Returns null for each URL if the session is not yet scheduled.
 */
export function buildAllCalendarUrls(
  booking: {
    id: number;
    fullName: string;
    scheduledAt: Date | null;
    meetingLink?: string | null;
    timezone?: string | null;
  },
  service: {
    name: string;
    durationMinutes: number;
  },
): { google: string; apple: string; outlook: string } | null {
  if (!booking.scheduledAt) return null;

  const params = buildCalendarParams(
    { ...booking, scheduledAt: booking.scheduledAt as Date },
    service,
  );

  return {
    google: buildGoogleCalendarUrl(params),
    apple: `${APP_URL}/api/coaching/calendar/${booking.id}.ics`,
    outlook: buildOutlookUrl(params),
  };
}

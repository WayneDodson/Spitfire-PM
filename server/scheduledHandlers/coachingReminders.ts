/**
 * Coaching Reminder Handler
 * Called by the Heartbeat cron every 30 minutes.
 * Sends 24-hour and 1-hour reminder emails for upcoming coaching sessions.
 *
 * Route: POST /api/scheduled/coaching-reminders
 */

import type { Request, Response } from "express";
import { getDb } from "../db";
import { coachingBookings, coachingServices } from "../../drizzle/schema";
import { and, eq, gte, lte, isNotNull } from "drizzle-orm";
import { send24hReminder, send1hReminder } from "../coachingEmail";

const CRON_SECRET = process.env.CRON_SECRET ?? "";

export async function coachingRemindersHandler(req: Request, res: Response) {
  // Auth: accept both the Heartbeat platform header and a shared secret for local testing
  const taskUid = req.headers["x-manus-cron-task-uid"] as string | undefined;
  const authHeader = req.headers["authorization"] as string | undefined;

  const isHeartbeat = !!taskUid;
  const isSecretAuth = CRON_SECRET && authHeader === `Bearer ${CRON_SECRET}`;

  if (!isHeartbeat && !isSecretAuth) {
    return res.status(403).json({ error: "cron-only endpoint" });
  }

  try {
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "db unavailable" });

    const now = new Date();

    // ── 24-hour window: sessions between 23h and 25h from now ─────────────────
    const h24Start = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const h24End   = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    // ── 1-hour window: sessions between 50min and 70min from now ──────────────
    const h1Start = new Date(now.getTime() + 50 * 60 * 1000);
    const h1End   = new Date(now.getTime() + 70 * 60 * 1000);

    const statusFilter = ["confirmed", "scheduled"];

    // Fetch bookings in the 24h window
    const upcoming24h = await db
      .select({ booking: coachingBookings, service: coachingServices })
      .from(coachingBookings)
      .leftJoin(coachingServices, eq(coachingBookings.serviceId, coachingServices.id))
      .where(
        and(
          isNotNull(coachingBookings.scheduledAt),
          gte(coachingBookings.scheduledAt, h24Start),
          lte(coachingBookings.scheduledAt, h24End),
        )
      );

    // Fetch bookings in the 1h window
    const upcoming1h = await db
      .select({ booking: coachingBookings, service: coachingServices })
      .from(coachingBookings)
      .leftJoin(coachingServices, eq(coachingBookings.serviceId, coachingServices.id))
      .where(
        and(
          isNotNull(coachingBookings.scheduledAt),
          gte(coachingBookings.scheduledAt, h1Start),
          lte(coachingBookings.scheduledAt, h1End),
        )
      );

    let sent24h = 0;
    let sent1h = 0;
    const errors: string[] = [];

    // Send 24h reminders
    for (const { booking, service } of upcoming24h) {
      if (!statusFilter.includes(booking.status)) continue;
      try {
        await send24hReminder(
          booking.email,
          booking.fullName,
          service?.name ?? "PM Coaching Session",
          booking.scheduledAt!,
          booking.meetingLink ?? undefined,
        );
        sent24h++;
      } catch (e) {
        errors.push(`24h reminder failed for booking ${booking.id}: ${(e as Error).message}`);
        console.error("[CoachingReminders] 24h send error:", e);
      }
    }

    // Send 1h reminders
    for (const { booking, service } of upcoming1h) {
      if (!statusFilter.includes(booking.status)) continue;
      try {
        await send1hReminder(
          booking.email,
          booking.fullName,
          service?.name ?? "PM Coaching Session",
          booking.scheduledAt!,
          booking.meetingLink ?? undefined,
        );
        sent1h++;
      } catch (e) {
        errors.push(`1h reminder failed for booking ${booking.id}: ${(e as Error).message}`);
        console.error("[CoachingReminders] 1h send error:", e);
      }
    }

    console.log(`[CoachingReminders] Sent: ${sent24h} × 24h, ${sent1h} × 1h. Errors: ${errors.length}`);

    return res.json({
      ok: true,
      sent24h,
      sent1h,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: now.toISOString(),
    });
  } catch (err) {
    const error = (err as Error).message;
    console.error("[CoachingReminders] Fatal error:", err);
    return res.status(500).json({
      error,
      stack: (err as Error).stack,
      context: { url: req.url, taskUid: req.headers["x-manus-cron-task-uid"] },
      timestamp: new Date().toISOString(),
    });
  }
}

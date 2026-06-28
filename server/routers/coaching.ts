/**
 * Coaching router — all tRPC procedures for the 1-to-1 coaching feature.
 */
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import {
  coachingBookings,
  coachingServices,
  coachingAvailability,
  coachingBlockedDates,
  coachingTestimonials,
} from "../../drizzle/schema";
import { eq, and, gte, lte, ne, desc, asc, sql, inArray } from "drizzle-orm";
import { buildAllCalendarUrls } from "../coachingCalendar";
import Stripe from "stripe";
import { notifyOwner } from "../_core/notification";
import {
  sendAssessmentRequestReceived,
  sendAssessmentAccepted,
  sendAssessmentDeclined,
  sendPaidBookingConfirmation,
  sendCancellationConfirmation,
  sendRescheduleConfirmation,
  sendSessionFollowUp,
  sendAdminBookingNotification,
} from "../coachingEmail";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "support@spitfireitsolutions.com";

function getStripe(): Stripe | null {
  if (!STRIPE_SECRET_KEY) return null;
  return new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2026-02-25.clover" });
}

// ── Assessment form schema ────────────────────────────────────────────────────
const assessmentFormSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  jobTitle: z.string().min(2).max(100),
  industry: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  timezone: z.string().min(2).max(100),
  qualifications: z.string().max(500).optional(),
  targetRole: z.string().min(2).max(200),
  mainChallenge: z.string().min(10).max(1000),
  timeline: z.string().min(2).max(200),
  interestedInPaid: z.boolean(),
  preferredDays: z.string().max(200).optional(),
  preferredTimes: z.string().max(200).optional(),
  privacyConsent: z.boolean(),
  bookingConsent: z.boolean(),
  serviceId: z.number().optional(), // undefined = free assessment (serviceId=0 sentinel)
  termsAccepted: z.boolean().optional(),
});

// Free assessment sentinel service ID (row 0 in DB — we'll look it up by slug)
const FREE_ASSESSMENT_SLUG = "free_assessment";

export const coachingRouter = router({
  // ── Public: get all active services ────────────────────────────────────────
  getServices: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(coachingServices)
      .where(eq(coachingServices.isActive, true))
      .orderBy(asc(coachingServices.orderIndex));
  }),

  // ── Public: get visible testimonials ───────────────────────────────────────
  getTestimonials: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(coachingTestimonials)
      .where(eq(coachingTestimonials.isVisible, true))
      .orderBy(asc(coachingTestimonials.orderIndex));
  }),

  // ── Public: get available slots for a given date range ─────────────────────
  getAvailableSlots: publicProcedure
    .input(z.object({
      fromDate: z.string(), // YYYY-MM-DD
      toDate: z.string(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const from = new Date(input.fromDate + "T00:00:00Z");
      const to = new Date(input.toDate + "T23:59:59Z");

      // Get availability rules
      const availability = await db
        .select()
        .from(coachingAvailability)
        .where(eq(coachingAvailability.isActive, true));

      // Get blocked dates (stored as YYYY-MM-DD strings)
      const blocked = await db
        .select()
        .from(coachingBlockedDates)
        .where(
          and(
            gte(coachingBlockedDates.date, input.fromDate),
            lte(coachingBlockedDates.date, input.toDate)
          )
        );

      const blockedSet = new Set(blocked.map((b) => b.date));

      // Get existing confirmed bookings in range
      const existingBookings = await db
        .select({ scheduledAt: coachingBookings.scheduledAt })
        .from(coachingBookings)
        .where(
          and(
            gte(coachingBookings.scheduledAt, from),
            lte(coachingBookings.scheduledAt, to),
            ne(coachingBookings.status, "cancelled")
          )
        );

      // Build slots
      const slots: { date: string; time: string; datetime: string }[] = [];
      const current = new Date(from);
      current.setUTCHours(0, 0, 0, 0);

      while (current <= to) {
        const dateStr = current.toISOString().split("T")[0];
        const dayOfWeek = current.getUTCDay();

        if (!blockedSet.has(dateStr)) {
          const dayAvail = availability.filter((a) => a.dayOfWeek === dayOfWeek);

          for (const avail of dayAvail) {
            const sessionDur = avail.sessionDurationMinutes;
            const buffer = avail.bufferMinutes;
            const [startH, startM] = avail.startTime.split(":").map(Number);
            const [endH, endM] = avail.endTime.split(":").map(Number);
            const startMins = startH * 60 + startM;
            const endMins = endH * 60 + endM;

            for (let mins = startMins; mins + sessionDur <= endMins; mins += sessionDur + buffer) {
              const h = Math.floor(mins / 60);
              const m = mins % 60;
              const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
              const slotDt = new Date(current);
              slotDt.setUTCHours(h, m, 0, 0);

              // Skip past slots
              if (slotDt <= new Date()) continue;

              // Check no conflict within (sessionDur + buffer) minutes
              const conflictWindow = (sessionDur + buffer) * 60 * 1000;
              const conflict = existingBookings.some((b) => {
                if (!b.scheduledAt) return false;
                return Math.abs(b.scheduledAt.getTime() - slotDt.getTime()) < conflictWindow;
              });

              if (!conflict) {
                slots.push({ date: dateStr, time: timeStr, datetime: slotDt.toISOString() });
              }
            }
          }
        }

        current.setUTCDate(current.getUTCDate() + 1);
      }

      return slots;
    }),

  // ── Public: check if email already has a free booking ──────────────────────
  checkFreeEligibility: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { eligible: true };

      // Find the free assessment service
      const [freeSvc] = await db
        .select()
        .from(coachingServices)
        .where(eq(coachingServices.slug, FREE_ASSESSMENT_SLUG))
        .limit(1);

      if (!freeSvc) return { eligible: true };

      const existing = await db
        .select()
        .from(coachingBookings)
        .where(
          and(
            eq(coachingBookings.email, input.email.toLowerCase()),
            eq(coachingBookings.serviceId, freeSvc.id),
            ne(coachingBookings.status, "cancelled")
          )
        )
        .limit(1);

      if (existing.length === 0) return { eligible: true };
      // Admin can override
      return { eligible: existing[0].freeAssessmentEligibleAgain };
    }),

  // ── Public: submit assessment form ─────────────────────────────────────────
  submitAssessment: publicProcedure
    .input(assessmentFormSchema)
    .mutation(async ({ input }) => {
      if (!input.privacyConsent || !input.bookingConsent) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Consent is required to proceed." });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Resolve service
      let serviceId: number;
      let serviceName: string;
      let serviceType: "free" | "paid" | "application";
      let pricePence: number;
      let isFree: boolean;

      if (!input.serviceId) {
        // Free assessment
        const [freeSvc] = await db
          .select()
          .from(coachingServices)
          .where(eq(coachingServices.slug, FREE_ASSESSMENT_SLUG))
          .limit(1);

        if (!freeSvc) throw new TRPCError({ code: "NOT_FOUND", message: "Free assessment service not configured" });
        serviceId = freeSvc.id;
        serviceName = freeSvc.name;
        serviceType = freeSvc.type;
        pricePence = 0;
        isFree = true;
      } else {
        const [svc] = await db
          .select()
          .from(coachingServices)
          .where(eq(coachingServices.id, input.serviceId))
          .limit(1);

        if (!svc) throw new TRPCError({ code: "NOT_FOUND", message: "Service not found" });
        serviceId = svc.id;
        serviceName = svc.name;
        serviceType = svc.type;
        pricePence = svc.pricePence;
        isFree = svc.type === "free";
      }

      // Prevent duplicate free assessments
      if (isFree) {
        const existing = await db
          .select()
          .from(coachingBookings)
          .where(
            and(
              eq(coachingBookings.email, input.email.toLowerCase()),
              eq(coachingBookings.serviceId, serviceId),
              ne(coachingBookings.status, "cancelled")
            )
          )
          .limit(1);

        if (existing.length > 0 && !existing[0].freeAssessmentEligibleAgain) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A free assessment has already been requested with this email address. Please contact us if you believe this is an error.",
          });
        }
      }

      const initialStatus = isFree ? "pending_review" : (serviceType === "application" ? "pending_review" : "payment_pending");

      // Insert booking
      const result = await db
        .insert(coachingBookings)
        .values({
          serviceId,
          fullName: input.fullName,
          email: input.email.toLowerCase(),
          phone: input.phone ?? null,
          jobTitle: input.jobTitle,
          industry: input.industry,
          country: input.country,
          timezone: input.timezone,
          qualifications: input.qualifications ?? null,
          targetRole: input.targetRole,
          mainChallenge: input.mainChallenge,
          timeline: input.timeline,
          interestedInPaid: input.interestedInPaid,
          preferredDays: input.preferredDays ?? null,
          preferredTimes: input.preferredTimes ?? null,
          privacyConsent: true,
          bookingConsent: true,
          status: initialStatus as any,
        });

      const bookingId = (result as any).insertId ?? 0;

      // Send confirmation email to user
      try {
        await sendAssessmentRequestReceived(input.email, input.fullName);
      } catch (e) {
        console.error("[Coaching] Failed to send user confirmation email:", e);
      }

      // Notify admin
      try {
        await sendAdminBookingNotification(ADMIN_EMAIL, {
          fullName: input.fullName,
          email: input.email,
          serviceName,
          jobTitle: input.jobTitle,
          industry: input.industry,
          mainChallenge: input.mainChallenge,
          timeline: input.timeline,
          interestedInPaid: input.interestedInPaid,
          bookingId,
        });
        await notifyOwner({
          title: `New coaching request: ${input.fullName}`,
          content: `${input.fullName} (${input.email}) submitted a ${serviceName} request.`,
        });
      } catch (e) {
        console.error("[Coaching] Failed to send admin notification:", e);
      }

      return { bookingId, requiresPayment: !isFree && pricePence > 0, pricePence };
    }),

  // ── Protected: create Stripe checkout for paid coaching ────────────────────
  createCoachingCheckout: protectedProcedure
    .input(z.object({
      bookingId: z.number(),
      successUrl: z.string().url(),
      cancelUrl: z.string().url(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [booking] = await db
        .select()
        .from(coachingBookings)
        .where(eq(coachingBookings.id, input.bookingId))
        .limit(1);

      if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });

      // ── Admin bypass: skip Stripe entirely, mark booking as paid ──────────────
      if (ctx.user.role === "admin") {
        await db
          .update(coachingBookings)
          .set({ amountPaidPence: booking.amountPaidPence ?? 0, stripeSessionId: "admin_bypass" })
          .where(eq(coachingBookings.id, booking.id));
        return { url: input.successUrl, adminBypass: true };
      }

      const stripe = getStripe();
      if (!stripe) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Payment system not configured" });

      // Get service details
      const [svc] = await db
        .select()
        .from(coachingServices)
        .where(eq(coachingServices.id, booking.serviceId))
        .limit(1);

      if (!svc || svc.pricePence <= 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This booking does not require payment" });
      }

      if (booking.amountPaidPence && booking.amountPaidPence > 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This booking has already been paid" });
      }

      // Validate same-origin redirect URLs
      const requestOrigin = ctx.req.headers.origin || `${ctx.req.protocol}://${ctx.req.headers.host}`;
      const successOrigin = new URL(input.successUrl).origin;
      const cancelOrigin = new URL(input.cancelUrl).origin;
      if (successOrigin !== requestOrigin || cancelOrigin !== requestOrigin) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Redirect URLs must be same-origin" });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "gbp",
            product_data: {
              name: svc.name,
              description: "1-to-1 Project Management Coaching — Spitfire PM",
            },
            unit_amount: svc.pricePence,
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        customer_email: booking.email,
        metadata: {
          bookingId: String(booking.id),
          userId: String(ctx.user.id),
          coachingPayment: "true",
        },
      });

      await db
        .update(coachingBookings)
        .set({ stripeSessionId: session.id })
        .where(eq(coachingBookings.id, booking.id));

      return { url: session.url };
    }),

  // ── Protected: get my bookings (with service info + calendar URLs) ──────────────────
  getMyBookings: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const bookings = await db
      .select()
      .from(coachingBookings)
      .where(eq(coachingBookings.email, ctx.user.email ?? ""))
      .orderBy(desc(coachingBookings.createdAt));

    if (bookings.length === 0) return [];

    // Fetch all referenced services in one query
    const serviceIds = Array.from(new Set(bookings.map((b) => b.serviceId)));
    const services = await db
      .select()
      .from(coachingServices)
      .where(inArray(coachingServices.id, serviceIds));

    const serviceMap = new Map(services.map((s) => [s.id, s]));

    return bookings.map((booking) => {
      const svc = serviceMap.get(booking.serviceId) ?? { name: "PM Coaching Session", durationMinutes: 20 };
      const calendarUrls = buildAllCalendarUrls(booking, svc);
      return { ...booking, service: svc, calendarUrls };
    });
  }),

  // ── Protected: get calendar URLs for a single booking ───────────────────────────
  getBookingCalendarUrls: protectedProcedure
    .input(z.object({ bookingId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const [booking] = await db
        .select()
        .from(coachingBookings)
        .where(
          and(
            eq(coachingBookings.id, input.bookingId),
            eq(coachingBookings.email, ctx.user.email ?? ""),
          )
        )
        .limit(1);

      if (!booking) return null;
      if (!booking.scheduledAt) return null;

      const [svc] = await db
        .select()
        .from(coachingServices)
        .where(eq(coachingServices.id, booking.serviceId))
        .limit(1);

      const service = svc ?? { name: "PM Coaching Session", durationMinutes: 20 };
      return buildAllCalendarUrls(booking, service);
    }),

  // ── Admin: get all bookings ─────────────────────────────────────────────────
  adminGetBookings: protectedProcedure
    .input(z.object({
      status: z.string().optional(),
      limit: z.number().min(1).max(200).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) return { bookings: [], total: 0 };

      const bookings = await db
        .select()
        .from(coachingBookings)
        .where(input.status ? eq(coachingBookings.status, input.status as any) : undefined)
        .orderBy(desc(coachingBookings.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return { bookings, total: bookings.length };
    }),

  // ── Admin: update booking ───────────────────────────────────────────────────
  adminUpdateBooking: protectedProcedure
    .input(z.object({
      bookingId: z.number(),
      status: z.enum(["pending_review", "accepted", "declined", "payment_pending", "confirmed", "scheduled", "completed", "no_show", "cancelled", "rescheduled"]).optional(),
      adminNotes: z.string().max(2000).optional(),
      scheduledAt: z.string().optional(),
      meetingLink: z.string().max(512).optional().or(z.literal("")),
      freeAssessmentEligibleAgain: z.boolean().optional(),
      sendEmailType: z.enum(["accepted", "declined", "reschedule", "cancellation", "follow_up"]).optional(),
      declineReason: z.string().max(500).optional(),
      refundNote: z.string().max(500).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [booking] = await db
        .select()
        .from(coachingBookings)
        .where(eq(coachingBookings.id, input.bookingId))
        .limit(1);

      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });

      const updateData: Record<string, unknown> = {};
      if (input.status !== undefined) updateData.status = input.status;
      if (input.adminNotes !== undefined) updateData.adminNotes = input.adminNotes;
      if (input.scheduledAt !== undefined) updateData.scheduledAt = new Date(input.scheduledAt);
      if (input.meetingLink !== undefined) updateData.meetingLink = input.meetingLink || null;
      if (input.freeAssessmentEligibleAgain !== undefined) updateData.freeAssessmentEligibleAgain = input.freeAssessmentEligibleAgain;

      if (Object.keys(updateData).length > 0) {
        await db.update(coachingBookings).set(updateData as any).where(eq(coachingBookings.id, input.bookingId));
      }

      // Send email if requested
      if (input.sendEmailType) {
        const name = booking.fullName;
        const email = booking.email;
        const scheduledAt = input.scheduledAt ? new Date(input.scheduledAt) : (booking.scheduledAt ?? undefined);
        const meetingLink = input.meetingLink || booking.meetingLink || undefined;

        const [svc] = booking.serviceId
          ? await db.select().from(coachingServices).where(eq(coachingServices.id, booking.serviceId)).limit(1)
          : [null];
        const serviceName = svc?.name ?? "Free PM Career Assessment";

        try {
          if (input.sendEmailType === "accepted") {
            await sendAssessmentAccepted(email, name);
          } else if (input.sendEmailType === "declined") {
            await sendAssessmentDeclined(email, name, input.declineReason);
          } else if (input.sendEmailType === "reschedule" && scheduledAt) {
            await sendRescheduleConfirmation(email, name, serviceName, scheduledAt, meetingLink);
          } else if (input.sendEmailType === "cancellation") {
            await sendCancellationConfirmation(email, name, serviceName, input.refundNote);
          } else if (input.sendEmailType === "follow_up") {
            await sendSessionFollowUp(email, name, serviceName);
          }
        } catch (e) {
          console.error("[Coaching] Failed to send admin-triggered email:", e);
        }
      }

      return { success: true };
    }),

  // ── Admin: availability ─────────────────────────────────────────────────────
  adminGetAvailability: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const db = await getDb();
    if (!db) return [];
    return db.select().from(coachingAvailability).orderBy(asc(coachingAvailability.dayOfWeek));
  }),

  adminSetAvailability: protectedProcedure
    .input(z.array(z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
      endTime: z.string().regex(/^\d{2}:\d{2}$/),
      sessionDurationMinutes: z.number().min(15).default(60),
      bufferMinutes: z.number().min(0).default(15),
      isActive: z.boolean(),
    })))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(coachingAvailability);
      if (input.length > 0) {
        await db.insert(coachingAvailability).values(input);
      }
      return { success: true };
    }),

  // ── Admin: blocked dates ────────────────────────────────────────────────────
  adminGetBlockedDates: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const db = await getDb();
    if (!db) return [];
    return db.select().from(coachingBlockedDates).orderBy(asc(coachingBlockedDates.date));
  }),

  adminAddBlockedDate: protectedProcedure
    .input(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), reason: z.string().max(200).optional() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(coachingBlockedDates).values({ date: input.date, reason: input.reason ?? null });
      return { success: true };
    }),

  adminRemoveBlockedDate: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(coachingBlockedDates).where(eq(coachingBlockedDates.id, input.id));
      return { success: true };
    }),

  // ── Admin: services ─────────────────────────────────────────────────────────
  adminGetServices: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const db = await getDb();
    if (!db) return [];
    return db.select().from(coachingServices).orderBy(asc(coachingServices.orderIndex));
  }),

  adminUpdateService: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(2).max(255).optional(),
      shortDescription: z.string().max(1000).optional(),
      pricePence: z.number().min(0).optional(),
      durationMinutes: z.number().min(15).optional(),
      isActive: z.boolean().optional(),
      orderIndex: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, ...rest } = input;
      await db.update(coachingServices).set(rest).where(eq(coachingServices.id, id));
      return { success: true };
    }),

  // ── Admin: testimonials ─────────────────────────────────────────────────────
  adminGetTestimonials: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const db = await getDb();
    if (!db) return [];
    return db.select().from(coachingTestimonials).orderBy(asc(coachingTestimonials.orderIndex));
  }),

  adminAddTestimonial: protectedProcedure
    .input(z.object({
      authorName: z.string().min(2).max(255),
      authorTitle: z.string().max(255).optional(),
      content: z.string().min(10).max(1000),
      isVisible: z.boolean().default(false),
      orderIndex: z.number().default(0),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(coachingTestimonials).values(input);
      return { success: true };
    }),

  adminUpdateTestimonial: protectedProcedure
    .input(z.object({
      id: z.number(),
      authorName: z.string().max(255).optional(),
      authorTitle: z.string().max(255).optional(),
      content: z.string().max(1000).optional(),
      isVisible: z.boolean().optional(),
      orderIndex: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, ...rest } = input;
      await db.update(coachingTestimonials).set(rest).where(eq(coachingTestimonials.id, id));
      return { success: true };
    }),

  adminDeleteTestimonial: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(coachingTestimonials).where(eq(coachingTestimonials.id, input.id));
      return { success: true };
    }),

  // ── Admin: CSV export ───────────────────────────────────────────────────────
  adminExportCsv: protectedProcedure
    .input(z.object({ status: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) return { csv: "" };

      const bookings = await db
        .select()
        .from(coachingBookings)
        .where(input.status ? eq(coachingBookings.status, input.status as any) : undefined)
        .orderBy(desc(coachingBookings.createdAt));

      const headers = [
        "ID", "Name", "Email", "Phone", "Service ID", "Status",
        "Job Title", "Industry", "Country", "Timezone",
        "Target Role", "Main Challenge", "Timeline",
        "Interested in Paid", "Amount Paid (£)", "Scheduled At",
        "Meeting Link", "Admin Notes", "Created At",
      ];

      const esc = (v: unknown) => {
        const s = String(v ?? "").replace(/"/g, '""');
        return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s}"` : s;
      };

      const rows = bookings.map((b) => [
        b.id,
        esc(b.fullName),
        esc(b.email),
        esc(b.phone ?? ""),
        b.serviceId,
        b.status,
        esc(b.jobTitle),
        esc(b.industry),
        esc(b.country),
        esc(b.timezone),
        esc(b.targetRole),
        esc(b.mainChallenge ?? ""),
        esc(b.timeline),
        b.interestedInPaid ? "Yes" : "No",
        b.amountPaidPence ? (b.amountPaidPence / 100).toFixed(2) : "0.00",
        b.scheduledAt ? b.scheduledAt.toISOString() : "",
        esc(b.meetingLink ?? ""),
        esc(b.adminNotes ?? ""),
        b.createdAt ? b.createdAt.toISOString() : "",
      ]);

      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      return { csv };
    }),
});

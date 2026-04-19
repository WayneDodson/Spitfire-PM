/**
 * Cancellation Flow Router
 *
 * Handles the 4-step emotionally intelligent cancellation journey:
 *   Step 1 → Submit cancellation reason (with readiness + progress snapshot)
 *   Step 2 → Offer free mentor call (UI only, no procedure needed)
 *   Step 3 → Submit mentor call request (question form)
 *   Step 4 → Submit re-engagement opt-in (3-month check-in preference)
 *
 * Every piece of context is stored so future outreach feels personal,
 * not like a generic marketing campaign.
 */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { cancellationReasons, mentorRequests, reEngagementOptIns, users, userProgress, subscriptions } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { notifyOwner } from "../_core/notification";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
function getStripe(): Stripe | null {
  if (!STRIPE_SECRET_KEY) return null;
  return new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2026-02-25.clover" });
}
// ─── Step 1: Submit Cancellation Reason ──────────────────────────────────────

const cancellationReasonSchema = z.object({
  reason: z.enum([
    "too_expensive",
    "need_more_time",
    "not_using_enough",
    "feel_overwhelmed",
    "unsure_if_ready",
    "got_the_job",
    "struggling_with_interviews",
    "need_career_advice",
    "other",
  ]),
  customReason: z.string().max(500).optional(),
  /** Readiness score at cancellation time — passed from the client */
  readinessScore: z.number().min(0).max(100).optional(),
  levelsCompleted: z.number().min(0).optional(),
  overallProgress: z.number().min(0).max(100).optional(),
});

// ─── Step 3: Submit Mentor Request ───────────────────────────────────────────

const mentorRequestSchema = z.object({
  cancellationReasonId: z.number().int().positive().optional(),
  helpTopics: z.array(z.string()).max(10).optional(),
  mainQuestion: z.string().min(10, "Please tell us a bit more — this helps us prepare for your call.").max(2000),
  currentSituation: z.string().max(1000).optional(),
  desiredOutcome: z.string().max(1000).optional(),
});

// ─── Step 4: Submit Re-Engagement Opt-In ─────────────────────────────────────

const reEngagementSchema = z.object({
  cancellationReasonId: z.number().int().positive().optional(),
  optedIn: z.boolean(),
});

// ─── Router ──────────────────────────────────────────────────────────────────

export const cancellationRouter = router({
  /**
   * Step 1 — Record why the user is leaving.
   * Captures a full snapshot of their progress and career context.
   * Returns the cancellationReasonId so subsequent steps can link back to it.
   */
  submitReason: protectedProcedure
    .input(cancellationReasonSchema)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Pull career context from user profile
      const [user] = await db
        .select({
          currentIndustry: users.currentIndustry,
          targetRole: users.targetRole,
          goalTimeline: users.goalTimeline,
        })
        .from(users)
        .where(eq(users.id, ctx.user.id));

      const [inserted] = await db
        .insert(cancellationReasons)
        .values({
          userId: ctx.user.id,
          reason: input.reason,
          customReason: input.customReason,
          readinessScore: input.readinessScore,
          levelsCompleted: input.levelsCompleted,
          overallProgress: input.overallProgress?.toFixed(2) as any,
          careerGoal: user?.goalTimeline ?? null,
          currentIndustry: user?.currentIndustry ?? null,
          targetRole: user?.targetRole ?? null,
        });

      const cancellationReasonId = (inserted as any).insertId as number;

      return { cancellationReasonId };
    }),

  /**
   * Step 3 — Record the mentor call request.
   * Notifies the owner immediately with full context.
   */
  submitMentorRequest: protectedProcedure
    .input(mentorRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const [user] = await db
        .select({
          displayName: users.displayName,
          name: users.name,
          email: users.email,
          currentIndustry: users.currentIndustry,
          targetRole: users.targetRole,
        })
        .from(users)
        .where(eq(users.id, ctx.user.id));

      const [inserted] = await db
        .insert(mentorRequests)
        .values({
          userId: ctx.user.id,
          cancellationReasonId: input.cancellationReasonId ?? null,
          helpTopics: input.helpTopics?.join(", ") ?? null,
          mainQuestion: input.mainQuestion,
          currentSituation: input.currentSituation ?? null,
          desiredOutcome: input.desiredOutcome ?? null,
          status: "pending",
        });

      const mentorRequestId = (inserted as any).insertId as number;

      // Notify the owner immediately — this person needs a human response
      const userName = user?.displayName || user?.name || "A user";
      const userEmail = user?.email || "unknown";
      const industry = user?.currentIndustry || "not specified";
      const targetRole = user?.targetRole || "not specified";
      const topics = input.helpTopics?.join(", ") || "not specified";

      await notifyOwner({
        title: `Mentor Call Request — ${userName}`,
        content: `${userName} (${userEmail}) has requested a free PM Career Clarity Call.\n\nBackground:\n- Current industry: ${industry}\n- Target role: ${targetRole}\n- Help topics: ${topics}\n\nMain question:\n"${input.mainQuestion}"\n\nCurrent situation:\n${input.currentSituation || "Not provided"}\n\nDesired outcome:\n${input.desiredOutcome || "Not provided"}\n\nPlease reach out to arrange their free mentor call.`,
      });

      return { mentorRequestId };
    }),

  /**
   * Step 4 — Record the re-engagement opt-in preference.
   * If opted in, schedules a check-in date 3 months from now.
   * Then proceeds to cancel the Stripe subscription.
   */
  submitReEngagement: protectedProcedure
    .input(reEngagementSchema)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Calculate check-in date: 3 months from today
      const checkInDate = input.optedIn
        ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        : null;

      await db.insert(reEngagementOptIns).values({
        userId: ctx.user.id,
        cancellationReasonId: input.cancellationReasonId ?? null,
        optedIn: input.optedIn,
        checkInDate: checkInDate ?? undefined,
        checkInSent: false,
      });

      // Now cancel the Stripe subscription
      const [sub] = await db
        .select({ stripeSubscriptionId: subscriptions.stripeSubscriptionId })
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.userId, ctx.user.id),
            eq(subscriptions.status, "active")
          )
        )
        .limit(1);

      if (sub?.stripeSubscriptionId) {
        const stripeClient = getStripe();
        if (stripeClient) {
          await stripeClient.subscriptions.cancel(sub.stripeSubscriptionId);
        }
      }

      // Notify owner if user opted in to re-engagement
      if (input.optedIn) {
        const [user] = await db
          .select({ displayName: users.displayName, name: users.name, email: users.email })
          .from(users)
          .where(eq(users.id, ctx.user.id));

        const userName = user?.displayName || user?.name || "A user";
        const checkInDateStr = checkInDate?.toLocaleDateString("en-GB", {
          day: "numeric", month: "long", year: "numeric",
        }) || "in 3 months";

        await notifyOwner({
          title: `Re-Engagement Opt-In — ${userName}`,
          content: `${userName} (${user?.email}) has opted in to a 3-month check-in after cancelling.\n\nScheduled check-in date: ${checkInDateStr}\n\nRemember to reach out personally on this date — reference their original PM career journey, not generic messaging.`,
        });
      }

      return { success: true, optedIn: input.optedIn };
    }),

  /**
   * Admin: Get all cancellation reasons with linked mentor requests and opt-ins.
   * Used in the admin cancellations dashboard.
   */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const db = await getDb();
    if (!db) return [];

    const reasons = await db
      .select({
        id: cancellationReasons.id,
        userId: cancellationReasons.userId,
        reason: cancellationReasons.reason,
        customReason: cancellationReasons.customReason,
        readinessScore: cancellationReasons.readinessScore,
        levelsCompleted: cancellationReasons.levelsCompleted,
        overallProgress: cancellationReasons.overallProgress,
        careerGoal: cancellationReasons.careerGoal,
        currentIndustry: cancellationReasons.currentIndustry,
        targetRole: cancellationReasons.targetRole,
        createdAt: cancellationReasons.createdAt,
        userName: users.displayName,
        userEmail: users.email,
      })
      .from(cancellationReasons)
      .leftJoin(users, eq(cancellationReasons.userId, users.id))
      .orderBy(desc(cancellationReasons.createdAt))
      .limit(200);

    return reasons;
  }),

  /**
   * Admin: Get all pending mentor requests.
   */
  getMentorRequests: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const db = await getDb();
    if (!db) return [];

    const requests = await db
      .select({
        id: mentorRequests.id,
        userId: mentorRequests.userId,
        helpTopics: mentorRequests.helpTopics,
        mainQuestion: mentorRequests.mainQuestion,
        currentSituation: mentorRequests.currentSituation,
        desiredOutcome: mentorRequests.desiredOutcome,
        status: mentorRequests.status,
        adminNotes: mentorRequests.adminNotes,
        createdAt: mentorRequests.createdAt,
        userName: users.displayName,
        userEmail: users.email,
        userIndustry: users.currentIndustry,
        userTargetRole: users.targetRole,
      })
      .from(mentorRequests)
      .leftJoin(users, eq(mentorRequests.userId, users.id))
      .orderBy(desc(mentorRequests.createdAt))
      .limit(200);

    return requests;
  }),

  /**
   * Admin: Get all re-engagement opt-ins.
   */
  getReEngagementOptIns: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const db = await getDb();
    if (!db) return [];

    const optIns = await db
      .select({
        id: reEngagementOptIns.id,
        userId: reEngagementOptIns.userId,
        optedIn: reEngagementOptIns.optedIn,
        checkInDate: reEngagementOptIns.checkInDate,
        checkInSent: reEngagementOptIns.checkInSent,
        createdAt: reEngagementOptIns.createdAt,
        userName: users.displayName,
        userEmail: users.email,
      })
      .from(reEngagementOptIns)
      .leftJoin(users, eq(reEngagementOptIns.userId, users.id))
      .orderBy(desc(reEngagementOptIns.createdAt))
      .limit(200);

    return optIns;
  }),
});

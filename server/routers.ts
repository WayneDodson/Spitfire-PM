import { COOKIE_NAME } from "@shared/const";
import { stripeRouter } from "./routers/stripe";
import { cancellationRouter } from "./routers/cancellation";
import { apmRouter } from "./routers/apm";
import { adminQuestionsRouter } from "./routers/adminQuestions";
import { simulationsRouter } from "./routers/simulations";
import { brainSnapRouter } from "./routers/brainSnap";
import { coachingRouter } from "./routers/coaching";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as gamification from "./gamification";
import { getTrialStatus, startTrialIfNeeded, recordLessonCompletion, recordSimulationCompletion, recordCheckCompletion, STRIPE_PRICES } from "./trial";
import bcrypt from "bcryptjs";
import { PASSWORD_REGEX, PASSWORD_REGEX_MSG, PASSWORD_MIN_LENGTH } from "../shared/const";
import { achievements, userAchievements, userStats, xpTransactions } from "../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  apm: apmRouter,
  simulations: simulationsRouter,
  adminQuestions: adminQuestionsRouter,
  brainSnap: brainSnapRouter,
  coaching: coachingRouter,
  auth: router({
    me: publicProcedure.query(async opts => {
      const user = opts.ctx.user;
      if (!user) return null;
      // Start the 7-day free trial on first authenticated visit
      await startTrialIfNeeded(user.id);
      // Strip sensitive fields — never expose password hash or OAuth IDs to the client
      const { passwordHash: _ph, googleId: _gid, openId: _oid, ...safeUser } = user as any;
      return safeUser;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  referrals: router({
    // Get user's referral code (creates one if doesn't exist)
    getMyReferralCode: protectedProcedure.query(async ({ ctx }) => {
      const referralCode = await db.ensureUserHasReferralCode(ctx.user.id);
      return { referralCode };
    }),

    // Get count of successful referrals
    getMyReferralCount: protectedProcedure.query(async ({ ctx }) => {
      const count = await db.getReferralCount(ctx.user.id);
      return { count };
    }),

    // Track a referral (called when someone signs up with a referral code)
    trackReferral: publicProcedure
      .input(z.object({ referralCode: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new Error("Must be logged in to use referral code");
        }

        const referrer = await db.getUserByReferralCode(input.referralCode);
        if (!referrer) {
          throw new Error("Invalid referral code");
        }

        if (referrer.id === ctx.user.id) {
          throw new Error("Cannot refer yourself");
        }

        await db.createReferral({
          referrerId: referrer.id,
          referredUserId: ctx.user.id,
          referralCode: input.referralCode,
          signedUp: true,
        });

        return { success: true };
      }),
  }),

  levels: router({
    // Get all levels
    getAll: publicProcedure.query(async () => {
      return await db.getAllLevels();
    }),

    // Get user's progress across all levels
    getMyProgress: protectedProcedure.query(async ({ ctx }) => {
      const progress = await db.getUserProgress(ctx.user.id);
      const referralCount = await db.getReferralCount(ctx.user.id);
      const subscription = await db.getActiveSubscription(ctx.user.id);
      // Admin users always have full access — treat as subscribed
      const isAdmin = ctx.user.role === 'admin';

      return {
        progress,
        referralCount,
        hasActiveSubscription: isAdmin || !!subscription,
      };
    }),

    // Check if user can access a specific level
    canAccessLevel: protectedProcedure
      .input(z.object({ levelId: z.number() }))
      .query(async ({ input, ctx }) => {
        const levels = await db.getAllLevels();
        const level = levels.find((l) => l.id === input.levelId);

        if (!level) {
          return { canAccess: false, reason: "Level not found" };
        }

        // Levels 1 and 2 are always free (accessType = 'free')
        if (level.accessType === "free") {
          return { canAccess: true };
        }

        // Admin and founder access bypass subscription check
        const user = await db.getUserById(ctx.user.id);
        if (user?.role === 'admin' || user?.founderAccessEarned) {
          return { canAccess: true };
        }

        // Levels 3-7 (accessType = 'paid' or legacy 'referral') require active subscription
        const subscription = await db.getActiveSubscription(ctx.user.id);
        if (subscription) {
          return { canAccess: true };
        }
        return { canAccess: false, reason: "Requires active subscription" };
      }),

    // Update progress for a level
    updateProgress: protectedProcedure
      .input(
        z.object({
          levelId: z.number(),
          progressPercent: z.number().min(0).max(100),
          completed: z.boolean().optional(),
          finalScore: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await db.upsertUserProgress({
          userId: ctx.user.id,
          levelId: input.levelId,
          started: true,
          completed: input.completed || false,
          progressPercent: input.progressPercent,
          finalScore: input.finalScore,
          startedAt: new Date(),
          completedAt: input.completed ? new Date() : undefined,
        });

        return { success: true };
      }),
  }),

  lessons: router({
    // Get all lessons for a specific level
    getLessonsByLevel: publicProcedure
      .input(z.object({ levelId: z.number() }))
      .query(async ({ input }) => {
        return await db.getLessonsByLevel(input.levelId);
      }),

    // Get a specific lesson
    getLesson: publicProcedure
      .input(z.object({ lessonId: z.number() }))
      .query(async ({ input }) => {
        return await db.getLessonById(input.lessonId);
      }),

    // Check if user can access a specific lesson (mastery lock + trial + subscription)
    canAccess: protectedProcedure
      .input(z.object({ lessonId: z.number() }))
      .query(async ({ input, ctx }) => {
        return await db.canAccessLesson(ctx.user.id, input.lessonId);
      }),

    // Mark lesson as completed
    markLessonComplete: protectedProcedure
      .input(z.object({ lessonId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.markLessonComplete(ctx.user.id, input.lessonId);
        
        // Award XP for completing lesson
        await gamification.awardXP(ctx.user.id, 25, 'Completed lesson', 'lesson', input.lessonId);
        
        // Update lesson count in stats
        const dbInstance = await db.getDb();
        if (dbInstance) {
          await dbInstance
            .update(userStats)
            .set({ lessonsCompleted: sql`${userStats.lessonsCompleted} + 1` })
            .where(eq(userStats.userId, ctx.user.id));
        }
        
        // Record for trial engagement
        await recordLessonCompletion(ctx.user.id);
        
        // Check for achievements
        await gamification.checkAchievements(ctx.user.id);
        
        return result;
      }),

    // Save user's reflection response for a lesson
    saveReflection: protectedProcedure
      .input(z.object({
        lessonId: z.number(),
        response: z.enum(["yes", "almost", "need_more_practice"]),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.saveReflection(ctx.user.id, input.lessonId, input.response);
        return { success: true };
      }),

    // Get user's lesson progress for a level
    getMyLessonProgress: protectedProcedure
      .input(z.object({ levelId: z.number() }))
      .query(async ({ input, ctx }) => {
        return await db.getUserLessonProgress(ctx.user.id, input.levelId);
      }),
  }),

  knowledgeChecks: router({
    // Get knowledge checks for a specific lesson (legacy — by level + afterLessonNumber)
    getByLesson: publicProcedure
      .input(z.object({ levelId: z.number(), afterLessonNumber: z.number() }))
      .query(async ({ input }) => {
        return await db.getKnowledgeChecksByLesson(input.levelId, input.afterLessonNumber);
      }),

    // Get the single confidence check for a specific lesson ID
    getByLessonId: publicProcedure
      .input(z.object({ lessonId: z.number() }))
      .query(async ({ input }) => {
        return await db.getKnowledgeCheckByLessonId(input.lessonId);
      }),

    // Get the 5 end-of-level assessment questions for a level
    getAssessmentForLevel: publicProcedure
      .input(z.object({ levelId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAssessmentForLevel(input.levelId);
      }),

    // Submit answer and get feedback
    // If correct and it's a confidence check (not assessment), marks the lesson as passed
    submitAnswer: protectedProcedure
      .input(z.object({
        checkId: z.number(),
        selectedAnswerIndex: z.number(),
        lessonId: z.number().optional(), // provide for confidence checks to trigger mastery gate
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.submitKnowledgeCheckAnswer(ctx.user.id, input.checkId, input.selectedAnswerIndex);
        
        if (result.isCorrect) {
          // If a lessonId is provided, mark the confidence check as passed (mastery gate)
          if (input.lessonId) {
            await db.markConfidenceCheckPassed(ctx.user.id, input.lessonId);
          }
          // Award XP for passing a confidence check
          await gamification.awardXP(ctx.user.id, 15, 'Passed confidence check', 'quiz', input.checkId);
          // Record for trial engagement
          await recordCheckCompletion(ctx.user.id);
        }
        
        return result;
      }),

    // Get user's attempts for a level
    getMyAttempts: protectedProcedure
      .input(z.object({ levelId: z.number() }))
      .query(async ({ input, ctx }) => {
        return await db.getUserKnowledgeCheckAttempts(ctx.user.id, input.levelId);
      }),
  }),

  profile: router({
    // Update user's display name
    updateDisplayName: protectedProcedure
      .input(z.object({
        displayName: z.string()
          .min(2, "Name must be at least 2 characters")
          .max(50, "Name must be 50 characters or less")
          .trim()
          .regex(/^[a-zA-Z0-9\s'\-\.]+$/, "Name can only contain letters, numbers, spaces, hyphens, apostrophes and periods")
      }))
      .mutation(async ({ input, ctx }) => {
        // Sanitise: strip any remaining HTML tags just in case
        const sanitised = input.displayName.replace(/<[^>]*>/g, "").trim();
        await db.updateUserDisplayName(ctx.user.id, sanitised);
        return { success: true };
      }),

    // Get user profile
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const user = ctx.user as any;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        createdAt: user.createdAt,
        currentIndustry: user.currentIndustry ?? null,
        targetRole: user.targetRole ?? null,
        certifications: user.certifications ?? null,
        goalTimeline: user.goalTimeline ?? null,
      };
    }),

    // Update career context captured during onboarding
    updateCareerContext: protectedProcedure
      .input(z.object({
        displayName: z.string().min(2).max(50).trim().regex(/^[a-zA-Z0-9\s'\-\.]+$/, "Name can only contain letters, numbers, spaces, hyphens, apostrophes and periods"),
        currentIndustry: z.string().max(128).trim().optional(),
        targetRole: z.string().max(128).trim().optional(),
        certifications: z.string().max(255).trim().optional(),
        goalTimeline: z.enum(["1_month", "3_months", "6_months", "12_months", "no_rush"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const dbInstance = await db.getDb();
        if (!dbInstance) throw new Error("Database unavailable");
        const { users: usersTable } = await import("../drizzle/schema");
        const sanitisedName = input.displayName.replace(/<[^>]*>/g, "").trim();
        await dbInstance.update(usersTable)
          .set({
            displayName: sanitisedName,
            currentIndustry: input.currentIndustry ?? null,
            targetRole: input.targetRole ?? null,
            certifications: input.certifications ?? null,
            goalTimeline: input.goalTimeline ?? null,
          })
          .where(eq(usersTable.id, ctx.user.id));
        return { success: true };
      }),

    // Change password (email/password users only)
    changePassword: protectedProcedure
      .input(
        z.object({
          currentPassword: z.string().min(1, "Current password is required"),
          newPassword: z
            .string()
            .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
            .regex(PASSWORD_REGEX, PASSWORD_REGEX_MSG),
          confirmPassword: z.string(),
        }).refine((d) => d.newPassword === d.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        })
      )
      .mutation(async ({ ctx, input }) => {
        const dbInstance = await db.getDb();
        if (!dbInstance) throw new Error("Database unavailable");
        const user = ctx.user as any;
        if (user.authProvider !== "email") {
          throw new Error("Password change is only available for email/password accounts.");
        }
        if (!user.passwordHash) {
          throw new Error("No password set on this account.");
        }
        const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
        if (!valid) {
          throw new Error("Current password is incorrect.");
        }
        const { users: usersTable } = await import("../drizzle/schema");
        const newHash = await bcrypt.hash(input.newPassword, 12);
        await dbInstance
          .update(usersTable)
          .set({ passwordHash: newHash, updatedAt: new Date() })
          .where(eq(usersTable.id, ctx.user.id));
        return { success: true };
      }),
  }),

  stripe: stripeRouter,
  cancellation: cancellationRouter,

  trial: router({
    // Get the current user's trial status and engagement
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      return await getTrialStatus(ctx.user.id);
    }),

    // Get Stripe price IDs for all tiers
    getPrices: publicProcedure.query(() => {
      return STRIPE_PRICES;
    }),

    // Record a lesson completion for engagement tracking
    recordLesson: protectedProcedure.mutation(async ({ ctx }) => {
      await recordLessonCompletion(ctx.user.id);
      return { success: true };
    }),

    // Record a simulation completion for engagement tracking
    recordSimulation: protectedProcedure.mutation(async ({ ctx }) => {
      await recordSimulationCompletion(ctx.user.id);
      return { success: true };
    }),
  }),

  gamification: router({
    // Get user's gamification stats
    getMyStats: protectedProcedure.query(async ({ ctx }) => {
      return await gamification.getUserGamificationStats(ctx.user.id);
    }),

    // Get all achievements
    getAllAchievements: publicProcedure.query(async () => {
      const dbInstance = await db.getDb();
      if (!dbInstance) return [];
      return await dbInstance.select().from(achievements).orderBy(achievements.orderIndex);
    }),

    // Get user's unlocked achievements
    getMyAchievements: protectedProcedure.query(async ({ ctx }) => {
      const dbInstance = await db.getDb();
      if (!dbInstance) return [];
      
      const unlocked = await dbInstance
        .select({
          achievement: achievements,
          unlockedAt: userAchievements.unlockedAt,
        })
        .from(userAchievements)
        .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
        .where(eq(userAchievements.userId, ctx.user.id))
        .orderBy(desc(userAchievements.unlockedAt));
      
      return unlocked;
    }),

    // Get recent XP transactions
    getRecentXP: protectedProcedure.query(async ({ ctx }) => {
      const dbInstance = await db.getDb();
      if (!dbInstance) return [];
      
      return await dbInstance
        .select()
        .from(xpTransactions)
        .where(eq(xpTransactions.userId, ctx.user.id))
        .orderBy(desc(xpTransactions.createdAt))
        .limit(20);
    }),

     // Update streak (called on login)
    updateStreak: protectedProcedure.mutation(async ({ ctx }) => {
      return await gamification.updateStreak(ctx.user.id);
    }),
  }),
});
export type AppRouter = typeof appRouter;

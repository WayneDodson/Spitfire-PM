import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as gamification from "./gamification";
import { achievements, userAchievements, userStats, xpTransactions } from "../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
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

      return {
        progress,
        referralCount,
        hasActiveSubscription: !!subscription,
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

        // Level 1 is always free
        if (level.accessType === "free") {
          return { canAccess: true };
        }

        // Level 2 requires 1 referral
        if (level.accessType === "referral") {
          const referralCount = await db.getReferralCount(ctx.user.id);
          if (referralCount >= 1) {
            return { canAccess: true };
          }
          return { canAccess: false, reason: "Requires 1 referral" };
        }

        // Levels 3-7 require active subscription
        if (level.accessType === "paid") {
          const subscription = await db.getActiveSubscription(ctx.user.id);
          if (subscription) {
            return { canAccess: true };
          }
          return { canAccess: false, reason: "Requires active subscription" };
        }

        return { canAccess: false, reason: "Unknown access type" };
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
        
        // Check for achievements
        await gamification.checkAchievements(ctx.user.id);
        
        return result;
      }),

    // Get user's lesson progress for a level
    getMyLessonProgress: protectedProcedure
      .input(z.object({ levelId: z.number() }))
      .query(async ({ input, ctx }) => {
        return await db.getUserLessonProgress(ctx.user.id, input.levelId);
      }),
  }),

  knowledgeChecks: router({
    // Get knowledge checks for a specific lesson
    getByLesson: publicProcedure
      .input(z.object({ levelId: z.number(), afterLessonNumber: z.number() }))
      .query(async ({ input }) => {
        return await db.getKnowledgeChecksByLesson(input.levelId, input.afterLessonNumber);
      }),

    // Submit answer and get feedback
    submitAnswer: protectedProcedure
      .input(z.object({
        checkId: z.number(),
        selectedAnswerIndex: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.submitKnowledgeCheckAnswer(ctx.user.id, input.checkId, input.selectedAnswerIndex);
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
      return {
        id: ctx.user.id,
        name: ctx.user.name,
        email: ctx.user.email,
        displayName: ctx.user.displayName,
        role: ctx.user.role,
        createdAt: ctx.user.createdAt,
      };
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

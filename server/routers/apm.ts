/**
 * APM Qualification Prep router
 * Handles PFQ/PMQ qualification and module data, plus user progress tracking.
 */

import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import {
  apmQualifications,
  apmModules,
  apmModuleProgress,
} from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const apmRouter = router({
  /** List all qualifications (PFQ, PMQ) with module count */
  getQualifications: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const quals = await db
      .select()
      .from(apmQualifications)
      .orderBy(apmQualifications.orderIndex);

    // For each qualification, get module count and user progress summary
    const result = await Promise.all(
      quals.map(async (q) => {
        const modules = await db
          .select({ id: apmModules.id })
          .from(apmModules)
          .where(eq(apmModules.qualificationId, q.id));

        const progress = await db
          .select()
          .from(apmModuleProgress)
          .where(
            and(
              eq(apmModuleProgress.userId, ctx.user.id),
              eq(apmModuleProgress.qualificationId, q.id)
            )
          );

        const passedCount = progress.filter((p) => p.passed).length;

        return {
          ...q,
          moduleCount: modules.length,
          passedModules: passedCount,
        };
      })
    );

    return result;
  }),

  /** Get all modules for a qualification with user progress */
  getModulesByQualification: protectedProcedure
    .input(z.object({ qualificationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const modules = await db
        .select()
        .from(apmModules)
        .where(eq(apmModules.qualificationId, input.qualificationId))
        .orderBy(apmModules.moduleNumber);

      // Attach progress for each module
      const result = await Promise.all(
        modules.map(async (m) => {
          const [progress] = await db
            .select()
            .from(apmModuleProgress)
            .where(
              and(
                eq(apmModuleProgress.userId, ctx.user.id),
                eq(apmModuleProgress.moduleId, m.id)
              )
            )
            .limit(1);

          return {
            id: m.id,
            qualificationId: m.qualificationId,
            moduleNumber: m.moduleNumber,
            title: m.title,
            duration: m.duration,
            intro: m.intro,
            termCount: m.terms ? (JSON.parse(m.terms) as unknown[]).length : 0,
            quizCount: (JSON.parse(m.quiz) as unknown[]).length,
            progress: progress ?? null,
          };
        })
      );

      return result;
    }),

  /** Get a single module with full content (sections, terms, quiz) */
  getModule: protectedProcedure
    .input(z.object({ moduleId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      const [module] = await db
        .select()
        .from(apmModules)
        .where(eq(apmModules.id, input.moduleId))
        .limit(1);

      if (!module) return null;

      const [progress] = await db
        .select()
        .from(apmModuleProgress)
        .where(
          and(
            eq(apmModuleProgress.userId, ctx.user.id),
            eq(apmModuleProgress.moduleId, input.moduleId)
          )
        )
        .limit(1);

      return {
        ...module,
        sections: JSON.parse(module.sections) as Array<{
          heading: string;
          body: string;
        }>,
        terms: module.terms
          ? (JSON.parse(module.terms) as Array<{ t: string; d: string }>)
          : [],
        quiz: JSON.parse(module.quiz) as Array<{
          q: string;
          opts: string[];
          ans: number;
        }>,
        progress: progress ?? null,
      };
    }),

  /** Save quiz attempt and update progress */
  saveProgress: protectedProcedure
    .input(
      z.object({
        moduleId: z.string(),
        qualificationId: z.string(),
        score: z.number().int().min(0),
        totalQuestions: z.number().int().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const passed = input.score / input.totalQuestions >= 0.55;

      // Check for existing progress row
      const [existing] = await db
        .select()
        .from(apmModuleProgress)
        .where(
          and(
            eq(apmModuleProgress.userId, ctx.user.id),
            eq(apmModuleProgress.moduleId, input.moduleId)
          )
        )
        .limit(1);

      if (existing) {
        const newBest = Math.max(existing.bestScore, input.score);
        const nowPassed = existing.passed || passed;

        await db
          .update(apmModuleProgress)
          .set({
            bestScore: newBest,
            passed: nowPassed,
            attempts: existing.attempts + 1,
            passedAt:
              !existing.passed && passed ? new Date() : existing.passedAt,
          })
          .where(eq(apmModuleProgress.id, existing.id));

        return { passed: nowPassed, bestScore: newBest, attempts: existing.attempts + 1 };
      } else {
        await db.insert(apmModuleProgress).values({
          userId: ctx.user.id,
          moduleId: input.moduleId,
          qualificationId: input.qualificationId,
          bestScore: input.score,
          totalQuestions: input.totalQuestions,
          passed,
          attempts: 1,
          startedAt: new Date(),
          passedAt: passed ? new Date() : undefined,
        });

        return { passed, bestScore: input.score, attempts: 1 };
      }
    }),
});

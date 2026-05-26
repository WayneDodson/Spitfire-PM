import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { brainSnapQuestions, userBrainSnapLog } from "../../drizzle/schema";
import { eq, and, notInArray, sql } from "drizzle-orm";
import { getDb } from "../db";

export const brainSnapRouter = router({
  /**
   * Returns a random Brain Snap question the user has not yet seen.
   * Falls back to a random question from the full bank if all have been seen.
   */
  getRandom: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    // Get IDs already seen by this user
    const seen = await db
      .select({ questionId: userBrainSnapLog.questionId })
      .from(userBrainSnapLog)
      .where(eq(userBrainSnapLog.userId, ctx.user.id));

    const seenIds = seen.map((r) => r.questionId);

    // Try to find an unseen question
    let candidates = await db
      .select()
      .from(brainSnapQuestions)
      .where(
        seenIds.length > 0
          ? and(
              eq(brainSnapQuestions.isActive, true),
              notInArray(brainSnapQuestions.id, seenIds)
            )
          : eq(brainSnapQuestions.isActive, true)
      );

    // If all seen, reset and use full bank
    if (candidates.length === 0) {
      candidates = await db
        .select()
        .from(brainSnapQuestions)
        .where(eq(brainSnapQuestions.isActive, true));
    }

    if (candidates.length === 0) return null;

    // Pick a random one
    const question = candidates[Math.floor(Math.random() * candidates.length)];

    return {
      id: question.id,
      question: question.question,
      options: JSON.parse(question.options) as { id: string; text: string }[],
      correctOptionId: question.correctOptionId,
      explanation: question.explanation,
      topicTag: question.topicTag,
    };
  }),

  /**
   * Logs that the user has seen (and optionally answered) a Brain Snap question.
   */
  logSeen: protectedProcedure
    .input(
      z.object({
        questionId: z.number(),
        answeredCorrectly: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { ok: false };

      await db.insert(userBrainSnapLog).values({
        userId: ctx.user.id,
        questionId: input.questionId,
        answeredCorrectly: input.answeredCorrectly ?? null,
        seenAt: new Date(),
      });

      return { ok: true };
    }),
});

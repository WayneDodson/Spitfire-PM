/**
 * Admin Questions Router
 * Provides CRUD operations for knowledge check questions (per-lesson confidence checks,
 * level assessments) and APM module quiz questions.
 * All procedures are protected by adminProcedure.
 */
import { adminProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { knowledgeChecks, levels, lessons, apmModules, apmQualifications } from "../../drizzle/schema";
import { eq, and, asc } from "drizzle-orm";

export const adminQuestionsRouter = router({
  /**
   * Get all levels with their question counts (for the sidebar/filter)
   */
  getLevelSummary: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const allLevels = await db.select().from(levels).orderBy(asc(levels.orderIndex));
    const result = await Promise.all(
      allLevels.map(async (level) => {
        const checks = await db
          .select({ id: knowledgeChecks.id, isLevelAssessment: knowledgeChecks.isLevelAssessment })
          .from(knowledgeChecks)
          .where(eq(knowledgeChecks.levelId, level.id));
        return {
          id: level.id,
          title: level.title,
          orderIndex: level.orderIndex,
          perLessonCount: checks.filter((c) => !c.isLevelAssessment).length,
          assessmentCount: checks.filter((c) => c.isLevelAssessment).length,
        };
      })
    );
    return result;
  }),

  /**
   * Get all questions for a level (optionally filtered by type)
   */
  getQuestionsForLevel: adminProcedure
    .input(
      z.object({
        levelId: z.number(),
        type: z.enum(["all", "lesson", "assessment"]).default("all"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const allChecks = await db
        .select()
        .from(knowledgeChecks)
        .where(
          input.type === "all"
            ? eq(knowledgeChecks.levelId, input.levelId)
            : and(
                eq(knowledgeChecks.levelId, input.levelId),
                eq(knowledgeChecks.isLevelAssessment, input.type === "assessment")
              )
        )
        .orderBy(asc(knowledgeChecks.afterLessonNumber), asc(knowledgeChecks.id));

      // Attach lesson title where possible
      const lessonIds = allChecks.map((c) => c.lessonId).filter(Boolean) as number[];
      let lessonTitles: Record<number, string> = {};
      if (lessonIds.length > 0) {
        const lessonRows = await db
          .select({ id: lessons.id, title: lessons.title })
          .from(lessons)
          .where(eq(lessons.levelId, input.levelId));
        lessonTitles = Object.fromEntries(lessonRows.map((l) => [l.id, l.title]));
      }

      return allChecks.map((c) => ({
        ...c,
        options: typeof c.options === "string" ? JSON.parse(c.options) : c.options,
        lessonTitle: c.lessonId ? lessonTitles[c.lessonId] ?? null : null,
      }));
    }),

  /**
   * Update a knowledge check question
   */
  updateQuestion: adminProcedure
    .input(
      z.object({
        id: z.number(),
        question: z.string().min(10),
        options: z.array(z.string().min(1)).length(4),
        correctAnswerIndex: z.number().min(0).max(3),
        explanation: z.string().min(5),
        reinforcementMessage: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      await db
        .update(knowledgeChecks)
        .set({
          question: input.question,
          options: JSON.stringify(input.options),
          correctAnswerIndex: input.correctAnswerIndex,
          explanation: input.explanation,
          reinforcementMessage: input.reinforcementMessage ?? null,
        })
        .where(eq(knowledgeChecks.id, input.id));
      return { success: true };
    }),

  /**
   * Get all APM qualifications with module counts (for APM section)
   */
  getApmSummary: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const quals = await db
      .select()
      .from(apmQualifications)
      .orderBy(asc(apmQualifications.orderIndex));
    const result = await Promise.all(
      quals.map(async (q) => {
        const mods = await db
          .select({ id: apmModules.id })
          .from(apmModules)
          .where(eq(apmModules.qualificationId, q.id));
        return { id: q.id, title: q.title, moduleCount: mods.length };
      })
    );
    return result;
  }),

  /**
   * Get all quiz questions for an APM module
   */
  getApmModuleQuestions: adminProcedure
    .input(z.object({ moduleId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [mod] = await db
        .select()
        .from(apmModules)
        .where(eq(apmModules.id, input.moduleId));
      if (!mod) return null;
      const quiz = typeof mod.quiz === "string" ? JSON.parse(mod.quiz) : mod.quiz;
      return { moduleId: mod.id, title: mod.title, questions: quiz as Array<{ q: string; opts: string[]; ans: number }> };
    }),

  /**
   * Update a single APM quiz question by index
   */
  updateApmQuestion: adminProcedure
    .input(
      z.object({
        moduleId: z.string(),
        questionIndex: z.number().min(0),
        q: z.string().min(5),
        opts: z.array(z.string().min(1)).length(4),
        ans: z.number().min(0).max(3),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [mod] = await db
        .select({ quiz: apmModules.quiz })
        .from(apmModules)
        .where(eq(apmModules.id, input.moduleId));
      if (!mod) throw new Error("Module not found");
      const quiz: Array<{ q: string; opts: string[]; ans: number }> =
        typeof mod.quiz === "string" ? JSON.parse(mod.quiz) : mod.quiz;
      if (input.questionIndex >= quiz.length) throw new Error("Question index out of range");
      quiz[input.questionIndex] = { q: input.q, opts: input.opts, ans: input.ans };
      await db
        .update(apmModules)
        .set({ quiz: JSON.stringify(quiz) })
        .where(eq(apmModules.id, input.moduleId));
      return { success: true };
    }),

  /**
   * Get APM modules for a qualification (for the sidebar)
   */
  getApmModules: adminProcedure
    .input(z.object({ qualificationId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select({ id: apmModules.id, title: apmModules.title, moduleNumber: apmModules.moduleNumber })
        .from(apmModules)
        .where(eq(apmModules.qualificationId, input.qualificationId))
        .orderBy(asc(apmModules.moduleNumber));
    }),

  /**
   * Get ALL questions from the entire site for the Full Question Bank PDF.
   * Returns level knowledge checks (per-lesson + assessments) and APM module quizzes.
   */
  getAllQuestionsForPDF: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");

    // Level questions
    const allLevels = await db
      .select({ id: levels.id, title: levels.title, orderIndex: levels.orderIndex })
      .from(levels)
      .orderBy(asc(levels.orderIndex));

    const allLessons = await db
      .select({ id: lessons.id, title: lessons.title, levelId: lessons.levelId, lessonNumber: lessons.lessonNumber })
      .from(lessons)
      .orderBy(asc(lessons.lessonNumber));

    const allChecks = await db
      .select()
      .from(knowledgeChecks)
      .orderBy(asc(knowledgeChecks.levelId), asc(knowledgeChecks.afterLessonNumber), asc(knowledgeChecks.id));

    const lessonMap: Record<number, { title: string; levelId: number; lessonNumber: number }> = {};
    for (const l of allLessons) lessonMap[l.id] = { title: l.title, levelId: l.levelId, lessonNumber: l.lessonNumber };

    const levelSections = allLevels.map((lv) => {
      const perLesson = allChecks
        .filter((c) => c.levelId === lv.id && !c.isLevelAssessment)
        .map((c) => ({
          id: c.id,
          question: c.question,
          options: (typeof c.options === "string" ? JSON.parse(c.options) : c.options) as string[],
          correctAnswerIndex: c.correctAnswerIndex,
          explanation: c.explanation,
          lessonTitle: c.lessonId ? (lessonMap[c.lessonId]?.title ?? null) : null,
          afterLessonNumber: c.afterLessonNumber,
        }));
      const assessment = allChecks
        .filter((c) => c.levelId === lv.id && c.isLevelAssessment)
        .map((c) => ({
          id: c.id,
          question: c.question,
          options: (typeof c.options === "string" ? JSON.parse(c.options) : c.options) as string[],
          correctAnswerIndex: c.correctAnswerIndex,
          explanation: c.explanation,
          lessonTitle: null as string | null,
          afterLessonNumber: c.afterLessonNumber,
        }));
      return { levelId: lv.id, levelTitle: lv.title, perLesson, assessment };
    });

    // APM qualification questions
    const quals = await db
      .select({ id: apmQualifications.id, title: apmQualifications.title, orderIndex: apmQualifications.orderIndex })
      .from(apmQualifications)
      .orderBy(asc(apmQualifications.orderIndex));

    const allModules = await db
      .select()
      .from(apmModules)
      .orderBy(asc(apmModules.qualificationId), asc(apmModules.moduleNumber));

    const qualSections = quals.map((q) => {
      const mods = allModules
        .filter((m) => m.qualificationId === q.id)
        .map((m) => ({
          moduleId: m.id,
          moduleNumber: m.moduleNumber,
          title: m.title,
          questions: (typeof m.quiz === "string" ? JSON.parse(m.quiz) : m.quiz) as Array<{ q: string; opts: string[]; ans: number }>,
        }));
      return { qualId: q.id, qualTitle: q.title, modules: mods };
    });

    return { levelSections, qualSections };
  }),
});

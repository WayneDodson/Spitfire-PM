import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { simulations, userSimulationProgress, userStats, xpTransactions } from "../../drizzle/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";
import { getDb } from "../db";
import { getSimulationHintsForLesson } from "../../shared/lessonSimulationMap";

type Db = Exclude<Awaited<ReturnType<typeof getDb>>, null>;

// ─── helpers ────────────────────────────────────────────────────────────────

async function getOrCreateProgress(
  db: Db,
  userId: number,
  simulationId: number,
) {
  const [existing] = await db
    .select()
    .from(userSimulationProgress)
    .where(
      and(
        eq(userSimulationProgress.userId, userId),
        eq(userSimulationProgress.simulationId, simulationId),
      ),
    );
  if (existing) return existing;

  await db.insert(userSimulationProgress).values({
    userId,
    simulationId,
    status: "not_started",
    attempts: 0,
  });
  const [created] = await db
    .select()
    .from(userSimulationProgress)
    .where(
      and(
        eq(userSimulationProgress.userId, userId),
        eq(userSimulationProgress.simulationId, simulationId),
      ),
    );
  return created!;
}

async function awardXp(db: Db, userId: number, amount: number, reason: string, simulationId: number) {
  await db.insert(xpTransactions).values({
    userId,
    amount,
    reason,
    entityType: "other",
    entityId: simulationId,
  });
  await db
    .update(userStats)
    .set({ totalXp: sql`totalXp + ${amount}`, updatedAt: new Date() })
    .where(eq(userStats.userId, userId));
}

// ─── router ─────────────────────────────────────────────────────────────────

export const simulationsRouter = router({
  /** List all simulations, optionally filtered. Returns with user progress if authenticated. */
  list: publicProcedure
    .input(
      z.object({
        type: z.enum(["all", "decision_sim", "interview_sim", "build_sim", "full_project"]).optional(),
        levelId: z.number().optional(),
        difficulty: z.enum(["all", "beginner", "intermediate", "advanced"]).optional(),
        categoryTag: z.enum(["all", "high_impact", "interview_favourite", "common_scenario", "confidence_builder", "exam_prep"]).optional(),
        isInterviewBank: z.boolean().optional(),
        accessType: z.enum(["free", "pro", "advanced"]).optional(),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      let query = db.select().from(simulations).$dynamic();

      if (input?.type && input.type !== "all") {
        query = query.where(eq(simulations.type, input.type));
      }
      if (input?.levelId) {
        query = query.where(eq(simulations.levelId, input.levelId));
      }
      if (input?.difficulty && input.difficulty !== "all") {
        query = query.where(eq(simulations.difficulty, input.difficulty));
      }
      if (input?.categoryTag && input.categoryTag !== "all") {
        query = query.where(eq(simulations.categoryTag, input.categoryTag));
      }
      if (input?.isInterviewBank !== undefined) {
        query = query.where(eq(simulations.isInterviewBank, input.isInterviewBank));
      }
      if (input?.accessType) {
        query = query.where(eq(simulations.accessType, input.accessType));
      }

      const rows = await query.orderBy(simulations.levelId, simulations.orderIndex);

      // If authenticated, attach user progress
      if (ctx.user) {
        const progressRows = await db
          .select()
          .from(userSimulationProgress)
          .where(eq(userSimulationProgress.userId, ctx.user.id));

        const progressMap = new Map(progressRows.map((p) => [p.simulationId, p]));
        return rows.map((sim) => ({
          ...sim,
          userProgress: progressMap.get(sim.id) ?? null,
        }));
      }

      return rows.map((sim) => ({ ...sim, userProgress: null }));
    }),

  /** Get a single simulation by ID */
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const [sim] = await db
        .select()
        .from(simulations)
        .where(eq(simulations.id, input.id));
      if (!sim) throw new Error("Simulation not found");

      let userProgress = null;
      if (ctx.user) {
        userProgress = await getOrCreateProgress(db, ctx.user.id, input.id);
      }
      return { ...sim, userProgress };
    }),

  /** Start or resume a simulation — marks in_progress */
  start: protectedProcedure
    .input(z.object({ simulationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const progress = await getOrCreateProgress(db, ctx.user.id, input.simulationId);
      if (progress.status === "not_started") {
        await db
          .update(userSimulationProgress)
          .set({ status: "in_progress", startedAt: new Date(), attempts: sql`attempts + 1`, updatedAt: new Date() })
          .where(eq(userSimulationProgress.id, progress.id));
      }
      return { success: true };
    }),

  /** Submit a Decision Sim answer and get AI feedback */
  submitDecision: protectedProcedure
    .input(
      z.object({
        simulationId: z.number(),
        scenarioText: z.string(),
        chosenOption: z.string(),
        consequence: z.string(),
        score: z.number().min(1).max(4),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const prompt = `The user is a career changer learning project management. 
They chose "${input.chosenOption}" in this scenario: ${input.scenarioText}.
The consequence was: ${input.consequence}.
In 2-3 sentences, explain why this was ${input.score >= 3 ? "good" : "poor"} PM thinking, 
what a senior PM would have done, and one specific thing to remember.
Keep the tone encouraging and coaching, not critical.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are an expert PM career coach giving encouraging, specific feedback to a career changer." },
          { role: "user", content: prompt },
        ],
      });

      const feedback = String(response.choices[0]?.message?.content ?? "") ?? "Great attempt — keep practising!";
      return { feedback };
    }),

  /** Submit an Interview Sim answer and get AI STAR scoring */
  submitInterview: protectedProcedure
    .input(
      z.object({
        simulationId: z.number(),
        question: z.string(),
        answer: z.string().min(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const prompt = `The user is preparing for their first PM job interview. 
They answered the following question: ${input.question}
Their answer was: ${input.answer}
Score each STAR component out of 3 (Situation, Task, Action, Result). Then in 3-4 sentences provide 
coaching feedback: what they did well, what was vague or missing, 
and one specific improvement. Then provide a model answer of 
150-200 words. Tone: encouraging career coach, not examiner.
Return JSON in this exact format:
{
  "scores": { "situation": <1-3>, "task": <1-3>, "action": <1-3>, "result": <1-3> },
  "totalScore": <4-12>,
  "feedback": "<3-4 sentence coaching feedback>",
  "modelAnswer": "<150-200 word model answer>"
}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are an expert PM interview coach. Always return valid JSON." },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "star_feedback",
            strict: true,
            schema: {
              type: "object",
              properties: {
                scores: {
                  type: "object",
                  properties: {
                    situation: { type: "integer" },
                    task: { type: "integer" },
                    action: { type: "integer" },
                    result: { type: "integer" },
                  },
                  required: ["situation", "task", "action", "result"],
                  additionalProperties: false,
                },
                totalScore: { type: "integer" },
                feedback: { type: "string" },
                modelAnswer: { type: "string" },
              },
              required: ["scores", "totalScore", "feedback", "modelAnswer"],
              additionalProperties: false,
            },
          },
        },
      });

      const raw = String(response.choices[0]?.message?.content ?? "") ?? "{}";
      const parsed = JSON.parse(raw);
      return parsed as {
        scores: { situation: number; task: number; action: number; result: number };
        totalScore: number;
        feedback: string;
        modelAnswer: string;
      };
    }),

  /** Submit a Build Sim document and get AI review */
  submitDocument: protectedProcedure
    .input(
      z.object({
        simulationId: z.number(),
        documentType: z.string(),
        projectBrief: z.string(),
        userInput: z.string(),
        rubricFields: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const prompt = `The user is learning project management and has completed a ${input.documentType}.
The project context was: ${input.projectBrief}
Their completed document was: ${input.userInput}
A correct version would include: ${input.rubricFields}
For each field, note if it is: Complete and correct / Partially correct / Missing or incorrect.
Then give an overall score out of 10 and 2-3 sentences of coaching feedback.
Focus on what good PM thinking looks like for this document type.
Return JSON:
{
  "fieldFeedback": [{ "field": "<name>", "status": "complete|partial|missing", "comment": "<1 sentence>" }],
  "overallScore": <0-10>,
  "coaching": "<2-3 sentence coaching note>"
}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are an expert PM coach reviewing a student's PM document. Always return valid JSON." },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "document_feedback",
            strict: true,
            schema: {
              type: "object",
              properties: {
                fieldFeedback: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field: { type: "string" },
                      status: { type: "string" },
                      comment: { type: "string" },
                    },
                    required: ["field", "status", "comment"],
                    additionalProperties: false,
                  },
                },
                overallScore: { type: "integer" },
                coaching: { type: "string" },
              },
              required: ["fieldFeedback", "overallScore", "coaching"],
              additionalProperties: false,
            },
          },
        },
      });

      const raw = String(response.choices[0]?.message?.content ?? "") ?? "{}";
      return JSON.parse(raw) as {
        fieldFeedback: { field: string; status: string; comment: string }[];
        overallScore: number;
        coaching: string;
      };
    }),

  /** Complete a simulation — saves score, awards XP */
  complete: protectedProcedure
    .input(
      z.object({
        simulationId: z.number(),
        score: z.number().min(0).max(100),
        feedback: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const progress = await getOrCreateProgress(db, ctx.user.id, input.simulationId);

      const isBetter = progress.bestScore === null || input.score > (progress.bestScore ?? 0);
      const isFirstCompletion = progress.status !== "completed";

      await db
        .update(userSimulationProgress)
        .set({
          status: "completed",
          latestScore: input.score,
          bestScore: isBetter ? input.score : progress.bestScore,
          lastFeedback: input.feedback ?? null,
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(userSimulationProgress.id, progress.id));

      // Award XP on first completion
      if (isFirstCompletion) {
        const [sim] = await db.select().from(simulations).where(eq(simulations.id, input.simulationId));
        const xpAmount = sim?.type === "full_project" ? 100 : 40;
        await awardXp(db, ctx.user.id, xpAmount, `Completed simulation: ${sim?.title ?? input.simulationId}`, input.simulationId);
      }

      return { success: true, xpAwarded: isFirstCompletion };
    }),

  /** Get AI feedback for a Decision Sim choice (alias used by DecisionSimPlayer) */
  getDecisionFeedback: protectedProcedure
    .input(
      z.object({
        simulationId: z.number(),
        chosenOptionId: z.string(),
        scenario: z.string(),
        chosenText: z.string(),
        chosenConsequence: z.string(),
        chosenScore: z.number().min(1).max(4),
        takeaway: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const prompt = `The user is a career changer learning project management.
Scenario: ${input.scenario}
They chose: "${input.chosenText}"
Consequence: ${input.chosenConsequence}
Score: ${input.chosenScore}/4
Key takeaway: ${input.takeaway}

In 2-3 sentences, explain why this was ${input.chosenScore >= 3 ? "good" : "poor"} PM thinking, what a senior PM would have done differently, and one specific thing to remember. Keep the tone encouraging and coaching.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are an expert PM career coach giving encouraging, specific feedback to a career changer." },
          { role: "user", content: prompt },
        ],
      });
      const feedback = String(response.choices[0]?.message?.content ?? "") ?? "Great attempt — keep practising!";
      return { feedback };
    }),

  /** Score an Interview Sim answer (alias used by InterviewSimPlayer) */
  scoreInterview: protectedProcedure
    .input(
      z.object({
        simulationId: z.number(),
        question: z.string(),
        answer: z.string().min(10),
        coachingFocus: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const prompt = `The user is preparing for their first PM job interview.
Question: ${input.question}
Answer: ${input.answer}
Coaching focus: ${input.coachingFocus}

Score the answer 0-100 based on STAR structure, specificity, and PM relevance.
Provide 3-4 sentences of coaching feedback: what they did well, what was vague or missing, and one specific improvement.
Return JSON: { "score": <0-100>, "feedback": "<3-4 sentences>" }`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are an expert PM interview coach. Always return valid JSON." },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "interview_score",
            strict: true,
            schema: {
              type: "object",
              properties: {
                score: { type: "integer" },
                feedback: { type: "string" },
              },
              required: ["score", "feedback"],
              additionalProperties: false,
            },
          },
        },
      });
      const raw = String(response.choices[0]?.message?.content ?? "") ?? '{"score":50,"feedback":"Good effort — keep practising."}';
      return JSON.parse(raw) as { score: number; feedback: string };
    }),

  /** Review a Build Sim document (alias used by BuildSimPlayer) */
  reviewBuildDoc: protectedProcedure
    .input(
      z.object({
        simulationId: z.number(),
        documentType: z.string(),
        projectBrief: z.string(),
        documentText: z.string(),
        rubricFields: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const prompt = `The user is learning project management and has completed a ${input.documentType}.
Project brief: ${input.projectBrief}
Document: ${input.documentText}
A correct version would include: ${input.rubricFields}

Score the document 0-100 based on completeness, accuracy, and professional quality.
Provide 3-4 sentences of coaching feedback.
Return JSON: { "score": <0-100>, "feedback": "<3-4 sentences>" }`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are an expert PM coach reviewing a student's PM document. Always return valid JSON." },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "doc_review",
            strict: true,
            schema: {
              type: "object",
              properties: {
                score: { type: "integer" },
                feedback: { type: "string" },
              },
              required: ["score", "feedback"],
              additionalProperties: false,
            },
          },
        },
      });
      const raw = String(response.choices[0]?.message?.content ?? "") ?? '{"score":50,"feedback":"Good effort — keep practising."}';
      return JSON.parse(raw) as { score: number; feedback: string };
    }),

  /** Get user's simulation stats summary */
  stats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { totalCompleted: 0, totalAttempts: 0, averageScore: 0 };
    const rows = await db
      .select()
      .from(userSimulationProgress)
      .where(
        and(
          eq(userSimulationProgress.userId, ctx.user.id),
          eq(userSimulationProgress.status, "completed"),
        ),
      );

    // Get all simulations to know total counts per difficulty
    const allSims = await db.select({ id: simulations.id, difficulty: simulations.difficulty }).from(simulations);
    const completedIds = new Set(rows.map((r) => r.simulationId));

    const difficulties = ["beginner", "intermediate", "advanced"] as const;
    const byDifficulty: Record<string, { total: number; completed: number }> = {};
    for (const diff of difficulties) {
      const total = allSims.filter((s) => s.difficulty === diff).length;
      const completed = allSims.filter((s) => s.difficulty === diff && completedIds.has(s.id)).length;
      byDifficulty[diff] = { total, completed };
    }

    return {
      totalCompleted: rows.length,
      totalAttempts: rows.reduce((sum, r) => sum + r.attempts, 0),
      averageScore: rows.length
        ? Math.round(rows.reduce((sum, r) => sum + (r.bestScore ?? 0), 0) / rows.length)
        : 0,
      byDifficulty,
    };
  }),

  /**
   * Return up to 2 simulations relevant to a given lesson.
   * Uses the shared lessonSimulationMap to look up simulation titles,
   * then fetches the matching DB rows so the client gets full simulation data.
   */
  getForLesson: publicProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const hints = getSimulationHintsForLesson(input.lessonId);
      if (hints.length === 0) return [];

      const titles = hints.map((h) => h.title);
      const rows = await db
        .select()
        .from(simulations)
        .where(inArray(simulations.title, titles));

      // Attach user progress if authenticated
      let progressMap = new Map<number, typeof userSimulationProgress.$inferSelect>();
      if (ctx.user) {
        const progressRows = await db
          .select()
          .from(userSimulationProgress)
          .where(
            and(
              eq(userSimulationProgress.userId, ctx.user.id),
              inArray(
                userSimulationProgress.simulationId,
                rows.map((r) => r.id),
              ),
            ),
          );
        progressMap = new Map(progressRows.map((p) => [p.simulationId, p]));
      }

      // Preserve the hint order and attach the prompt text
      return hints
        .map((hint) => {
          const sim = rows.find((r) => r.title === hint.title);
          if (!sim) return null;
          return {
            ...sim,
            prompt: hint.prompt,
            userProgress: progressMap.get(sim.id) ?? null,
          };
        })
        .filter(Boolean);
    }),
});

import { eq, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, levels, userProgress, referrals, subscriptions, InsertReferral, InsertUserProgress, InsertSubscription } from "../drizzle/schema";
import { nanoid } from "nanoid";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Referral system helpers

export async function generateReferralCode(): Promise<string> {
  return nanoid(10);
}

export async function ensureUserHasReferralCode(userId: number): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user[0]) throw new Error("User not found");

  if (user[0].referralCode) {
    return user[0].referralCode;
  }

  const referralCode = await generateReferralCode();
  await db.update(users).set({ referralCode }).where(eq(users.id, userId));
  return referralCode;
}

export async function getUserByReferralCode(referralCode: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.referralCode, referralCode)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createReferral(referral: InsertReferral) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(referrals).values(referral);
}

export async function getReferralCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(referrals)
    .where(and(eq(referrals.referrerId, userId), eq(referrals.signedUp, true)));

  return result[0]?.count || 0;
}

// Level and progress helpers

export async function getAllLevels() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(levels).orderBy(levels.orderIndex);
}

export async function getUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
}

export async function upsertUserProgress(progress: InsertUserProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, progress.userId), eq(userProgress.levelId, progress.levelId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(userProgress)
      .set(progress)
      .where(and(eq(userProgress.userId, progress.userId), eq(userProgress.levelId, progress.levelId)));
  } else {
    await db.insert(userProgress).values(progress);
  }
}

// Subscription helpers

export async function getActiveSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function upsertSubscription(subscription: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (subscription.stripeSubscriptionId) {
    const existing = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, subscription.stripeSubscriptionId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(subscriptions)
        .set(subscription)
        .where(eq(subscriptions.stripeSubscriptionId, subscription.stripeSubscriptionId));
      return;
    }
  }

  await db.insert(subscriptions).values(subscription);
}

// Lesson helpers

export async function getLessonsByLevel(levelId: number) {
  const db = await getDb();
  if (!db) return [];

  const { lessons } = await import("../drizzle/schema");
  return await db.select().from(lessons).where(eq(lessons.levelId, levelId)).orderBy(lessons.lessonNumber);
}

export async function getLessonById(lessonId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const { lessons } = await import("../drizzle/schema");
  const result = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function markLessonComplete(userId: number, lessonId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { userLessonProgress } = await import("../drizzle/schema");
  
  const existing = await db
    .select()
    .from(userLessonProgress)
    .where(and(eq(userLessonProgress.userId, userId), eq(userLessonProgress.lessonId, lessonId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(userLessonProgress)
      .set({ completed: true, completedAt: new Date() })
      .where(and(eq(userLessonProgress.userId, userId), eq(userLessonProgress.lessonId, lessonId)));
  } else {
    await db.insert(userLessonProgress).values({
      userId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    });
  }

  return { success: true };
}

export async function getUserLessonProgress(userId: number, levelId: number) {
  const db = await getDb();
  if (!db) return [];

  const { userLessonProgress, lessons } = await import("../drizzle/schema");
  
  const result = await db
    .select({
      lessonId: userLessonProgress.lessonId,
      completed: userLessonProgress.completed,
      completedAt: userLessonProgress.completedAt,
    })
    .from(userLessonProgress)
    .innerJoin(lessons, eq(lessons.id, userLessonProgress.lessonId))
    .where(and(eq(userLessonProgress.userId, userId), eq(lessons.levelId, levelId)));

  return result;
}

// Knowledge check helpers

export async function getKnowledgeChecksByLesson(levelId: number, afterLessonNumber: number) {
  const db = await getDb();
  if (!db) return [];

  const { knowledgeChecks } = await import("../drizzle/schema");
  return await db
    .select()
    .from(knowledgeChecks)
    .where(and(eq(knowledgeChecks.levelId, levelId), eq(knowledgeChecks.afterLessonNumber, afterLessonNumber)));
}

export async function submitKnowledgeCheckAnswer(userId: number, checkId: number, selectedAnswerIndex: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { knowledgeChecks, userKnowledgeCheckAttempts } = await import("../drizzle/schema");
  
  // Get the question
  const check = await db.select().from(knowledgeChecks).where(eq(knowledgeChecks.id, checkId)).limit(1);
  if (!check[0]) throw new Error("Knowledge check not found");

  const isCorrect = check[0].correctAnswerIndex === selectedAnswerIndex;

  // Record the attempt
  await db.insert(userKnowledgeCheckAttempts).values({
    userId,
    knowledgeCheckId: checkId,
    selectedAnswerIndex,
    correct: isCorrect,
  });

  return {
    isCorrect,
    correctAnswerIndex: check[0].correctAnswerIndex,
    explanation: check[0].explanation,
  };
}

export async function getUserKnowledgeCheckAttempts(userId: number, levelId: number) {
  const db = await getDb();
  if (!db) return [];

  const { userKnowledgeCheckAttempts, knowledgeChecks } = await import("../drizzle/schema");
  
  const result = await db
    .select({
      checkId: userKnowledgeCheckAttempts.knowledgeCheckId,
      selectedAnswerIndex: userKnowledgeCheckAttempts.selectedAnswerIndex,
      isCorrect: userKnowledgeCheckAttempts.correct,
      attemptedAt: userKnowledgeCheckAttempts.attemptedAt,
    })
    .from(userKnowledgeCheckAttempts)
    .innerJoin(knowledgeChecks, eq(knowledgeChecks.id, userKnowledgeCheckAttempts.knowledgeCheckId))
    .where(and(eq(userKnowledgeCheckAttempts.userId, userId), eq(knowledgeChecks.levelId, levelId)));

  return result;
}

/**
 * Update user's display name
 */
export async function updateUserDisplayName(userId: number, displayName: string) {
  const dbInstance = await getDb();
  if (!dbInstance) throw new Error("Database not available");
  
  await dbInstance
    .update(users)
    .set({ displayName })
    .where(eq(users.id, userId));
}

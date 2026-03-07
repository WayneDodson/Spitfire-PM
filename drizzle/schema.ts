import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) - kept for backward compat, nullable for new email/google users */
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  /** Bcrypt hashed password - null for Google OAuth users */
  passwordHash: varchar("passwordHash", { length: 255 }),
  /** Google OAuth subject ID */
  googleId: varchar("googleId", { length: 128 }).unique(),
  /** Profile picture URL from Google */
  avatarUrl: varchar("avatarUrl", { length: 512 }),
  /** Auth method: 'email', 'google' */
  authProvider: mysqlEnum("authProvider", ["email", "google", "manus"]).default("email"),
  /** Email verified flag */
  emailVerified: boolean("emailVerified").default(false),
  /** User's preferred display name shown throughout the site */
  displayName: varchar("displayName", { length: 100 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  /** Unique referral code for this user */
  referralCode: varchar("referralCode", { length: 32 }).unique(),
  /** ID of the user who referred this user (nullable) */
  referredBy: int("referredBy"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Levels table - defines the 7 course levels
 */
export const levels = mysqlTable("levels", {
  id: int("id").primaryKey(), // 1-7
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  /** Level 1: free, Level 2: referral, Levels 3-7: paid */
  accessType: mysqlEnum("accessType", ["free", "referral", "paid"]).notNull(),
  /** Estimated hours to complete */
  estimatedHours: int("estimatedHours").notNull(),
  /** Order in which levels should be completed */
  orderIndex: int("orderIndex").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Level = typeof levels.$inferSelect;
export type InsertLevel = typeof levels.$inferInsert;

/**
 * User progress tracking for each level
 */
export const userProgress = mysqlTable("userProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  levelId: int("levelId").notNull(),
  /** Whether the user has started this level */
  started: boolean("started").default(false).notNull(),
  /** Whether the user has completed this level */
  completed: boolean("completed").default(false).notNull(),
  /** Progress percentage (0-100) */
  progressPercent: int("progressPercent").default(0).notNull(),
  /** Final test score (if applicable) */
  finalScore: int("finalScore"),
  /** When the level was started */
  startedAt: timestamp("startedAt"),
  /** When the level was completed */
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

/**
 * Referrals tracking - who referred whom
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  /** User who made the referral */
  referrerId: int("referrerId").notNull(),
  /** User who was referred */
  referredUserId: int("referredUserId").notNull(),
  /** Referral code used */
  referralCode: varchar("referralCode", { length: 32 }).notNull(),
  /** Whether the referred user has signed up */
  signedUp: boolean("signedUp").default(false).notNull(),
  /** When the referral was created */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Subscriptions tracking - Stripe subscription data
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Stripe subscription ID */
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).unique(),
  /** Stripe customer ID */
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  /** Subscription status */
  status: mysqlEnum("status", ["active", "canceled", "past_due", "unpaid", "trialing"]).notNull(),
  /** Current period start */
  currentPeriodStart: timestamp("currentPeriodStart"),
  /** Current period end */
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  /** Whether subscription will cancel at period end */
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
/**
 * Lessons table - individual lessons within each level
 */
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  levelId: int("levelId").notNull(),
  /** Lesson number within the level (1-12) */
  lessonNumber: int("lessonNumber").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  /** Main lesson content in markdown */
  content: text("content").notNull(),
  /** Estimated minutes to complete */
  estimatedMinutes: int("estimatedMinutes").default(30).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

/**
 * Knowledge checks - quiz questions that appear during lessons
 */
export const knowledgeChecks = mysqlTable("knowledgeChecks", {
  id: int("id").autoincrement().primaryKey(),
  levelId: int("levelId").notNull(),
  /** Which lesson this check appears after (6 or 12 for Level 1) */
  afterLessonNumber: int("afterLessonNumber").notNull(),
  question: text("question").notNull(),
  /** JSON array of answer options */
  options: text("options").notNull(),
  /** Index of correct answer (0-based) */
  correctAnswerIndex: int("correctAnswerIndex").notNull(),
  /** Explanation shown after answering */
  explanation: text("explanation").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type KnowledgeCheck = typeof knowledgeChecks.$inferSelect;
export type InsertKnowledgeCheck = typeof knowledgeChecks.$inferInsert;

/**
 * User lesson progress - tracks completion of individual lessons
 */
export const userLessonProgress = mysqlTable("userLessonProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type InsertUserLessonProgress = typeof userLessonProgress.$inferInsert;

/**
 * User knowledge check attempts
 */
export const userKnowledgeCheckAttempts = mysqlTable("userKnowledgeCheckAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  knowledgeCheckId: int("knowledgeCheckId").notNull(),
  /** User's selected answer index */
  selectedAnswerIndex: int("selectedAnswerIndex").notNull(),
  /** Whether the answer was correct */
  correct: boolean("correct").notNull(),
  attemptedAt: timestamp("attemptedAt").defaultNow().notNull(),
});

export type UserKnowledgeCheckAttempt = typeof userKnowledgeCheckAttempts.$inferSelect;
export type InsertUserKnowledgeCheckAttempt = typeof userKnowledgeCheckAttempts.$inferInsert;

/**
 * Achievements - gamification badges and milestones
 */
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique identifier for the achievement */
  key: varchar("key", { length: 64 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  /** Icon name or emoji */
  icon: varchar("icon", { length: 64 }).notNull(),
  /** XP points awarded for this achievement */
  xpReward: int("xpReward").default(0).notNull(),
  /** Achievement category */
  category: mysqlEnum("category", ["milestone", "streak", "mastery", "social", "special"]).notNull(),
  /** Order for display */
  orderIndex: int("orderIndex").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

/**
 * User achievements - tracks which achievements users have unlocked
 */
export const userAchievements = mysqlTable("userAchievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementId: int("achievementId").notNull(),
  /** When the achievement was unlocked */
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;

/**
 * User XP and gamification stats
 */
export const userStats = mysqlTable("userStats", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  /** Total XP points earned */
  totalXp: int("totalXp").default(0).notNull(),
  /** Current level based on XP */
  level: int("level").default(1).notNull(),
  /** Current streak (consecutive days) */
  currentStreak: int("currentStreak").default(0).notNull(),
  /** Longest streak achieved */
  longestStreak: int("longestStreak").default(0).notNull(),
  /** Last login date for streak tracking */
  lastLoginDate: timestamp("lastLoginDate"),
  /** Total lessons completed */
  lessonsCompleted: int("lessonsCompleted").default(0).notNull(),
  /** Total quizzes completed */
  quizzesCompleted: int("quizzesCompleted").default(0).notNull(),
  /** Perfect quiz scores */
  perfectScores: int("perfectScores").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = typeof userStats.$inferInsert;

/**
 * XP transactions - log of all XP earned
 */
export const xpTransactions = mysqlTable("xpTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Amount of XP earned (can be negative for penalties) */
  amount: int("amount").notNull(),
  /** Reason for XP award */
  reason: varchar("reason", { length: 255 }).notNull(),
  /** Related entity type */
  entityType: mysqlEnum("entityType", ["lesson", "quiz", "achievement", "streak", "bonus", "other"]),
  /** Related entity ID */
  entityId: int("entityId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type XpTransaction = typeof xpTransactions.$inferSelect;
export type InsertXpTransaction = typeof xpTransactions.$inferInsert;

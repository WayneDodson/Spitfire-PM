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
  /** Unique username for login (alternative to email) — alphanumeric + underscores, max 32 chars */
  username: varchar("username", { length: 32 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  /** Career transition context — captured during onboarding */
  currentIndustry: varchar("currentIndustry", { length: 128 }),
  targetRole: varchar("targetRole", { length: 128 }),
  /** Certifications held: comma-separated e.g. 'PRINCE2,Agile' */
  certifications: varchar("certifications", { length: 255 }),
  /** Goal timeline: '1_month' | '3_months' | '6_months' | '12_months' | 'no_rush' */
  goalTimeline: varchar("goalTimeline", { length: 32 }),

  /** 7-day free trial tracking */
  trialStartedAt: timestamp("trialStartedAt"),
  trialEndsAt: timestamp("trialEndsAt"),
  /** Whether user earned Founder Access through consistent engagement during trial */
  founderAccessEarned: boolean("founderAccessEarned").default(false).notNull(),
  founderAccessEarnedAt: timestamp("founderAccessEarnedAt"),

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
  /** Lesson number within the level (1-24 after split) */
  lessonNumber: int("lessonNumber").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  /** Main lesson content in markdown */
  content: text("content").notNull(),
  /** Estimated minutes to complete — target 8-12 after split */
  estimatedMinutes: int("estimatedMinutes").default(10).notNull(),
  /** ID of the original lesson this was split from (null for original/unsplit lessons) */
  parentLessonId: int("parentLessonId"),
  /** Part number within a split lesson pair: 1 = Part A, 2 = Part B, null = not split */
  partNumber: int("partNumber"),
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
  /** Which lesson this check appears after (1-24 per level) */
  afterLessonNumber: int("afterLessonNumber").notNull(),
  /** ID of the lesson this check belongs to (direct reference after split) */
  lessonId: int("lessonId"),
  question: text("question").notNull(),
  /** JSON array of answer options */
  options: text("options").notNull(),
  /** Index of correct answer (0-based) */
  correctAnswerIndex: int("correctAnswerIndex").notNull(),
  /** Explanation shown after answering */
  explanation: text("explanation").notNull(),
  /** Supportive message shown when user answers correctly */
  reinforcementMessage: varchar("reinforcementMessage", { length: 255 }),
  /** true = end-of-level 5-question assessment; false/null = per-lesson confidence check */
  isLevelAssessment: boolean("isLevelAssessment").default(false).notNull(),
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
  /** Whether the user passed the confidence check for this lesson (mastery gate) */
  confidenceCheckPassed: boolean("confidenceCheckPassed").default(false).notNull(),
  confidenceCheckPassedAt: timestamp("confidenceCheckPassedAt"),
  /** User's self-reflection: could they explain this to a hiring manager? */
  reflectionResponse: mysqlEnum("reflectionResponse", ["yes", "almost", "need_more_practice"]),
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

/**
 * Email tokens table — used for both email verification and password reset.
 * Each token is single-use and expires after 1 hour.
 */
export const emailTokens = mysqlTable("emailTokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** SHA-256 hash of the raw token (never store raw token) */
  tokenHash: varchar("tokenHash", { length: 64 }).notNull().unique(),
  /** 'email_verification' | 'password_reset' */
  type: mysqlEnum("type", ["email_verification", "password_reset"]).notNull(),
  /** Token expires at this time (1 hour from creation) */
  expiresAt: timestamp("expiresAt").notNull(),
  /** Whether the token has already been used */
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailToken = typeof emailTokens.$inferSelect;
export type InsertEmailToken = typeof emailTokens.$inferInsert;

/**
 * Daily engagement tracking — one row per user per calendar day.
 * Used to calculate Founder Access eligibility during the 7-day trial.
 */
export const dailyEngagement = mysqlTable("dailyEngagement", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Date string in YYYY-MM-DD format (UTC) */
  date: varchar("date", { length: 10 }).notNull(),
  /** Whether the user logged in on this day */
  loggedIn: boolean("loggedIn").default(true).notNull(),
  /** Number of lessons completed on this day */
  lessonsCompleted: int("lessonsCompleted").default(0).notNull(),
  /** Number of simulations/scenarios completed on this day */
  simulationsCompleted: int("simulationsCompleted").default(0).notNull(),
  /** Number of knowledge checks completed on this day */
  checksCompleted: int("checksCompleted").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailyEngagement = typeof dailyEngagement.$inferSelect;
export type InsertDailyEngagement = typeof dailyEngagement.$inferInsert;

/**
 * Cancellation reasons — captured at the start of the cancellation flow.
 * Stores why the user is leaving, their readiness score, and progress snapshot
 * so future re-engagement can feel personal and relevant.
 */
export const cancellationReasons = mysqlTable("cancellationReasons", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Primary reason selected from the dropdown */
  reason: mysqlEnum("reason", [
    "too_expensive",
    "need_more_time",
    "not_using_enough",
    "feel_overwhelmed",
    "unsure_if_ready",
    "got_the_job",
    "struggling_with_interviews",
    "need_career_advice",
    "other",
  ]).notNull(),
  /** Free text for "Other" or additional context */
  customReason: text("customReason"),
  /** Readiness score at time of cancellation (0–100) */
  readinessScore: int("readinessScore"),
  /** Number of levels completed at time of cancellation */
  levelsCompleted: int("levelsCompleted"),
  /** Overall progress percentage at time of cancellation */
  overallProgress: decimal("overallProgress", { precision: 5, scale: 2 }),
  /** User's original career goal from onboarding */
  careerGoal: varchar("careerGoal", { length: 255 }),
  /** Current industry from onboarding */
  currentIndustry: varchar("currentIndustry", { length: 100 }),
  /** Target PM role from onboarding */
  targetRole: varchar("targetRole", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CancellationReason = typeof cancellationReasons.$inferSelect;
export type InsertCancellationReason = typeof cancellationReasons.$inferInsert;

/**
 * Mentor call requests — submitted when a user accepts the free mentor call offer
 * during the cancellation flow.
 */
export const mentorRequests = mysqlTable("mentorRequests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Link back to the cancellation reason that triggered this */
  cancellationReasonId: int("cancellationReasonId"),
  /** Selected help topics (comma-separated enum values stored as text) */
  helpTopics: text("helpTopics"),
  /** Main question the user wants answered in the mentor call */
  mainQuestion: text("mainQuestion").notNull(),
  /** Where the user is now in their career transition */
  currentSituation: text("currentSituation"),
  /** What outcome the user is hoping for */
  desiredOutcome: text("desiredOutcome"),
  /** Status: pending → scheduled → completed → no_show */
  status: mysqlEnum("status", ["pending", "scheduled", "completed", "no_show"]).default("pending").notNull(),
  /** Admin notes on the request */
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type MentorRequest = typeof mentorRequests.$inferSelect;
export type InsertMentorRequest = typeof mentorRequests.$inferInsert;

/**
 * Re-engagement opt-ins — captured on the final farewell step.
 * If the user opts in, we check in with them in 3 months with a personalised message.
 */
export const reEngagementOptIns = mysqlTable("reEngagementOptIns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Link back to the cancellation reason */
  cancellationReasonId: int("cancellationReasonId"),
  /** Whether the user opted in to a 3-month check-in */
  optedIn: boolean("optedIn").default(false).notNull(),
  /** Scheduled check-in date (3 months from cancellation) */
  checkInDate: timestamp("checkInDate"),
  /** Whether the check-in has been sent */
  checkInSent: boolean("checkInSent").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ReEngagementOptIn = typeof reEngagementOptIns.$inferSelect;
export type InsertReEngagementOptIn = typeof reEngagementOptIns.$inferInsert;

/**
 * APM Qualifications — PFQ and PMQ top-level qualification definitions
 */
export const apmQualifications = mysqlTable("apmQualifications", {
  id: varchar("id", { length: 32 }).primaryKey(), // e.g. 'pfq', 'pmq'
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  level: varchar("level", { length: 64 }).notNull(), // e.g. 'Foundation', 'Practitioner'
  description: text("description"),
  /** Approximate study hours */
  estimatedHours: int("estimatedHours").notNull(),
  /** Display order */
  orderIndex: int("orderIndex").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ApmQualification = typeof apmQualifications.$inferSelect;
export type InsertApmQualification = typeof apmQualifications.$inferInsert;

/**
 * APM Modules — individual study modules within each qualification
 */
export const apmModules = mysqlTable("apmModules", {
  id: varchar("id", { length: 32 }).primaryKey(), // e.g. 'pfq-1', 'pmq-3'
  qualificationId: varchar("qualificationId", { length: 32 }).notNull(),
  /** Module number within the qualification */
  moduleNumber: int("moduleNumber").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  /** Estimated duration string e.g. '45 min' */
  duration: varchar("duration", { length: 32 }),
  /** Brief intro paragraph shown on module card */
  intro: text("intro"),
  /** Full study content — JSON array of {heading, body} sections */
  sections: text("sections").notNull(),
  /** Key terms glossary — JSON array of {t, d} objects */
  terms: text("terms"),
  /** Quiz questions — JSON array of {q, opts, ans} objects */
  quiz: text("quiz").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ApmModule = typeof apmModules.$inferSelect;
export type InsertApmModule = typeof apmModules.$inferInsert;

/**
 * APM Module Progress — tracks each user's quiz attempts per module
 */
export const apmModuleProgress = mysqlTable("apmModuleProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: varchar("moduleId", { length: 32 }).notNull(),
  qualificationId: varchar("qualificationId", { length: 32 }).notNull(),
  /** Best quiz score achieved (0 to total questions) */
  bestScore: int("bestScore").default(0).notNull(),
  /** Total questions in the quiz */
  totalQuestions: int("totalQuestions").notNull(),
  /** Whether the user has passed (>=55%) */
  passed: boolean("passed").default(false).notNull(),
  /** Number of attempts made */
  attempts: int("attempts").default(0).notNull(),
  /** When the module was first started */
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  /** When the user first passed */
  passedAt: timestamp("passedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ApmModuleProgress = typeof apmModuleProgress.$inferSelect;
export type InsertApmModuleProgress = typeof apmModuleProgress.$inferInsert;

/**
 * Simulations — the core product differentiator.
 * Four types: decision_sim, interview_sim, build_sim, full_project
 */
export const simulations = mysqlTable("simulations", {
  id: int("id").autoincrement().primaryKey(),
  /** Level this simulation belongs to (1–7) */
  levelId: int("levelId").notNull(),
  /** Display title */
  title: varchar("title", { length: 255 }).notNull(),
  /** Short description shown on the card */
  description: text("description").notNull(),
  /** Simulation type */
  type: mysqlEnum("type", ["decision_sim", "interview_sim", "build_sim", "full_project"]).notNull(),
  /** Difficulty tier */
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]).notNull(),
  /** Category tag shown on card */
  categoryTag: mysqlEnum("categoryTag", ["high_impact", "interview_favourite", "common_scenario", "confidence_builder", "exam_prep"]).notNull(),
  /** Estimated minutes to complete */
  estimatedMinutes: int("estimatedMinutes").notNull(),
  /** Free (Level 1) or Pro required */
  accessType: mysqlEnum("accessType", ["free", "pro"]).notNull().default("pro"),
  /** Full simulation content — JSON structure varies by type */
  content: text("content").notNull(),
  /** Display order within level */
  orderIndex: int("orderIndex").notNull(),
  /** Whether this is part of the standalone interview bank */
  isInterviewBank: boolean("isInterviewBank").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Simulation = typeof simulations.$inferSelect;
export type InsertSimulation = typeof simulations.$inferInsert;

/**
 * User simulation progress — tracks attempts and scores per simulation
 */
export const userSimulationProgress = mysqlTable("userSimulationProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  simulationId: int("simulationId").notNull(),
  /** Current status */
  status: mysqlEnum("status", ["not_started", "in_progress", "completed"]).default("not_started").notNull(),
  /** Best score achieved (0–100 normalised) */
  bestScore: int("bestScore"),
  /** Latest score */
  latestScore: int("latestScore"),
  /** Number of attempts */
  attempts: int("attempts").default(0).notNull(),
  /** Saved mid-simulation state (JSON) — for Full Project resume */
  savedState: text("savedState"),
  /** AI feedback from the last attempt (JSON) */
  lastFeedback: text("lastFeedback"),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserSimulationProgress = typeof userSimulationProgress.$inferSelect;
export type InsertUserSimulationProgress = typeof userSimulationProgress.$inferInsert;

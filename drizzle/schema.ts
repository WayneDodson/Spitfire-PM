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
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
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
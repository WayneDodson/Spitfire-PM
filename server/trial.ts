/**
 * Trial & Engagement Service
 *
 * Manages the 7-day free trial, daily engagement tracking,
 * and Founder Access eligibility logic.
 *
 * Founder Access is EARNED, not discounted.
 * Criteria: 5+ active days out of 7, 3+ lessons completed, 1+ simulation/scenario.
 */

import { eq, and, gte, lte, count, sum } from "drizzle-orm";
import { getDb } from "./db";
import { users, dailyEngagement } from "../drizzle/schema";

const TRIAL_DAYS = 7;

/** Founder Access criteria */
const FOUNDER_MIN_ACTIVE_DAYS = 5;
const FOUNDER_MIN_LESSONS = 3;
const FOUNDER_MIN_SIMULATIONS = 1;

/** Stripe price IDs */
export const STRIPE_PRICES = {
  founder: "price_1TNrMnAlIkFVb04s0DqEUelE",   // £19/month
  standard: "price_1TNrMnAlIkFVb04scUtJB4Hr",  // £39/month
  annual: "price_1TNrMoAlIkFVb04s7L47K0qg",    // £197/year
} as const;

export type PriceTier = keyof typeof STRIPE_PRICES;

/**
 * Start the 7-day trial for a user (called on first login after registration).
 * Idempotent — safe to call multiple times.
 */
export async function startTrialIfNeeded(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const [user] = await db.select({
    trialStartedAt: users.trialStartedAt,
  }).from(users).where(eq(users.id, userId));

  if (!user || user.trialStartedAt) return; // already started

  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

  await db.update(users)
    .set({ trialStartedAt: now, trialEndsAt })
    .where(eq(users.id, userId));
}

/**
 * Record a daily login for engagement tracking.
 * Creates or updates the row for today's date (UTC).
 */
export async function recordDailyLogin(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const today = getTodayUTC();

  const existing = await db.select({ id: dailyEngagement.id })
    .from(dailyEngagement)
    .where(and(
      eq(dailyEngagement.userId, userId),
      eq(dailyEngagement.date, today),
    ));

  if (existing.length === 0) {
    await db.insert(dailyEngagement).values({
      userId,
      date: today,
      loggedIn: true,
      lessonsCompleted: 0,
      simulationsCompleted: 0,
      checksCompleted: 0,
    });
  }
  // If row exists, loggedIn is already true — nothing to update
}

/**
 * Increment lesson completion count for today.
 */
export async function recordLessonCompletion(userId: number): Promise<void> {
  await upsertEngagement(userId, "lessonsCompleted");
}

/**
 * Increment simulation completion count for today.
 */
export async function recordSimulationCompletion(userId: number): Promise<void> {
  await upsertEngagement(userId, "simulationsCompleted");
}

/**
 * Increment knowledge check completion count for today.
 */
export async function recordCheckCompletion(userId: number): Promise<void> {
  await upsertEngagement(userId, "checksCompleted");
}

async function upsertEngagement(
  userId: number,
  field: "lessonsCompleted" | "simulationsCompleted" | "checksCompleted",
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const today = getTodayUTC();

  const existing = await db.select({
    id: dailyEngagement.id,
    lessonsCompleted: dailyEngagement.lessonsCompleted,
    simulationsCompleted: dailyEngagement.simulationsCompleted,
    checksCompleted: dailyEngagement.checksCompleted,
  }).from(dailyEngagement)
    .where(and(
      eq(dailyEngagement.userId, userId),
      eq(dailyEngagement.date, today),
    ));

  if (existing.length === 0) {
    await db.insert(dailyEngagement).values({
      userId,
      date: today,
      loggedIn: true,
      lessonsCompleted: field === "lessonsCompleted" ? 1 : 0,
      simulationsCompleted: field === "simulationsCompleted" ? 1 : 0,
      checksCompleted: field === "checksCompleted" ? 1 : 0,
    });
  } else {
    const current = existing[0];
    await db.update(dailyEngagement)
      .set({ [field]: (current[field] ?? 0) + 1 })
      .where(eq(dailyEngagement.id, current.id));
  }
}

/**
 * Get the full trial status for a user.
 */
export async function getTrialStatus(userId: number): Promise<TrialStatus> {
  const db = await getDb();
  if (!db) return defaultTrialStatus();

  const [user] = await db.select({
    trialStartedAt: users.trialStartedAt,
    trialEndsAt: users.trialEndsAt,
    founderAccessEarned: users.founderAccessEarned,
    founderAccessEarnedAt: users.founderAccessEarnedAt,
    role: users.role,
  }).from(users).where(eq(users.id, userId));

  if (!user || !user.trialStartedAt) {
    return defaultTrialStatus();
  }

  // Admin users are never subject to trial expiry — they always have full access
  if (user.role === 'admin') {
    return {
      ...defaultTrialStatus(),
      trialActive: true,
      trialExpired: false,
      trialStartedAt: user.trialStartedAt,
      founderAccessEarned: user.founderAccessEarned ?? false,
      founderAccessEarnedAt: user.founderAccessEarnedAt ?? null,
    };
  }

  const now = new Date();
  const trialEndsAt = user.trialEndsAt ?? new Date(user.trialStartedAt.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
  const trialActive = now < trialEndsAt;
  const trialExpired = now >= trialEndsAt;

  // Days elapsed (0-indexed from start)
  const msElapsed = now.getTime() - user.trialStartedAt.getTime();
  const dayNumber = Math.min(Math.floor(msElapsed / (24 * 60 * 60 * 1000)) + 1, TRIAL_DAYS);
  const daysRemaining = Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

  // Engagement during trial window
  const startDate = formatDateUTC(user.trialStartedAt);
  const endDate = formatDateUTC(trialEndsAt);

  const engagementRows = await db.select({
    date: dailyEngagement.date,
    lessonsCompleted: dailyEngagement.lessonsCompleted,
    simulationsCompleted: dailyEngagement.simulationsCompleted,
    checksCompleted: dailyEngagement.checksCompleted,
  }).from(dailyEngagement)
    .where(and(
      eq(dailyEngagement.userId, userId),
      gte(dailyEngagement.date, startDate),
      lte(dailyEngagement.date, endDate),
    ));

  const activeDays = engagementRows.length;
  const totalLessons = engagementRows.reduce((s, r) => s + (r.lessonsCompleted ?? 0), 0);
  const totalSimulations = engagementRows.reduce((s, r) => s + (r.simulationsCompleted ?? 0), 0);

  // Check Founder Access eligibility
  const founderEligible =
    activeDays >= FOUNDER_MIN_ACTIVE_DAYS &&
    totalLessons >= FOUNDER_MIN_LESSONS &&
    totalSimulations >= FOUNDER_MIN_SIMULATIONS;

  // Auto-award Founder Access if eligible and not yet awarded
  if (founderEligible && !user.founderAccessEarned) {
    await db.update(users)
      .set({ founderAccessEarned: true, founderAccessEarnedAt: now })
      .where(eq(users.id, userId));
  }

  return {
    trialActive,
    trialExpired,
    trialStartedAt: user.trialStartedAt,
    trialEndsAt,
    dayNumber,
    daysRemaining,
    activeDays,
    totalLessons,
    totalSimulations,
    founderEligible: founderEligible || user.founderAccessEarned,
    founderAccessEarned: user.founderAccessEarned || founderEligible,
    founderAccessEarnedAt: user.founderAccessEarnedAt ?? (founderEligible ? now : null),
    // Progress toward Founder Access (0-100)
    founderProgress: Math.min(100, Math.round(
      ((activeDays / FOUNDER_MIN_ACTIVE_DAYS) * 0.5 +
       (totalLessons / FOUNDER_MIN_LESSONS) * 0.35 +
       (totalSimulations / FOUNDER_MIN_SIMULATIONS) * 0.15) * 100
    )),
    engagementRows,
  };
}

export interface TrialStatus {
  trialActive: boolean;
  trialExpired: boolean;
  trialStartedAt: Date | null;
  trialEndsAt: Date | null;
  dayNumber: number;
  daysRemaining: number;
  activeDays: number;
  totalLessons: number;
  totalSimulations: number;
  founderEligible: boolean;
  founderAccessEarned: boolean;
  founderAccessEarnedAt: Date | null;
  founderProgress: number;
  engagementRows: Array<{
    date: string;
    lessonsCompleted: number | null;
    simulationsCompleted: number | null;
    checksCompleted: number | null;
  }>;
}

function defaultTrialStatus(): TrialStatus {
  return {
    trialActive: false,
    trialExpired: false,
    trialStartedAt: null,
    trialEndsAt: null,
    dayNumber: 0,
    daysRemaining: 0,
    activeDays: 0,
    totalLessons: 0,
    totalSimulations: 0,
    founderEligible: false,
    founderAccessEarned: false,
    founderAccessEarnedAt: null,
    founderProgress: 0,
    engagementRows: [],
  };
}

function getTodayUTC(): string {
  return formatDateUTC(new Date());
}

function formatDateUTC(date: Date): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

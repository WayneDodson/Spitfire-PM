import { getDb } from './db';
import * as schema from '../drizzle/schema';
import { eq, and, sql } from 'drizzle-orm';

/**
 * Award XP to a user and create transaction record
 */
export async function awardXP(
  userId: number,
  amount: number,
  reason: string,
  entityType?: 'lesson' | 'quiz' | 'achievement' | 'streak' | 'bonus' | 'other',
  entityId?: number
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Create XP transaction
  await db.insert(schema.xpTransactions).values({
    userId,
    amount,
    reason,
    entityType,
    entityId,
  });

  // Update user stats
  const [stats] = await db
    .select()
    .from(schema.userStats)
    .where(eq(schema.userStats.userId, userId));

  if (stats) {
    const newTotalXp = stats.totalXp + amount;
    const newLevel = calculateLevel(newTotalXp);

    await db
      .update(schema.userStats)
      .set({
        totalXp: newTotalXp,
        level: newLevel,
      })
      .where(eq(schema.userStats.userId, userId));
  } else {
    // Create stats if they don't exist
    const newLevel = calculateLevel(amount);
    await db.insert(schema.userStats).values({
      userId,
      totalXp: amount,
      level: newLevel,
    });
  }

  return amount;
}

/**
 * Calculate level based on total XP
 * Level 1: 0-499 XP
 * Level 2: 500-1499 XP
 * Level 3: 1500-2999 XP
 * And so on (exponential growth)
 */
export function calculateLevel(totalXp: number): number {
  if (totalXp < 500) return 1;
  if (totalXp < 1500) return 2;
  if (totalXp < 3000) return 3;
  if (totalXp < 5000) return 4;
  if (totalXp < 7500) return 5;
  if (totalXp < 10500) return 6;
  if (totalXp < 14000) return 7;
  if (totalXp < 18000) return 8;
  if (totalXp < 22500) return 9;
  if (totalXp < 27500) return 10;
  
  // Level 11+: every 5000 XP
  return 10 + Math.floor((totalXp - 27500) / 5000) + 1;
}

/**
 * Get XP required for next level
 */
export function getXpForNextLevel(currentLevel: number): number {
  const thresholds = [0, 500, 1500, 3000, 5000, 7500, 10500, 14000, 18000, 22500, 27500];
  
  if (currentLevel < thresholds.length) {
    return thresholds[currentLevel];
  }
  
  // Level 11+: every 5000 XP
  return 27500 + (currentLevel - 10) * 5000;
}

/**
 * Unlock achievement for user
 */
export async function unlockAchievement(userId: number, achievementKey: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Get achievement
  const [achievement] = await db
    .select()
    .from(schema.achievements)
    .where(eq(schema.achievements.key, achievementKey));

  if (!achievement) {
    console.error(`Achievement not found: ${achievementKey}`);
    return null;
  }

  // Check if already unlocked
  const [existing] = await db
    .select()
    .from(schema.userAchievements)
    .where(
      and(
        eq(schema.userAchievements.userId, userId),
        eq(schema.userAchievements.achievementId, achievement.id)
      )
    );

  if (existing) {
    return null; // Already unlocked
  }

  // Unlock achievement
  await db.insert(schema.userAchievements).values({
    userId,
    achievementId: achievement.id,
  });

  // Award XP
  if (achievement.xpReward > 0) {
    await awardXP(
      userId,
      achievement.xpReward,
      `Achievement unlocked: ${achievement.title}`,
      'achievement',
      achievement.id
    );
  }

  return achievement;
}

/**
 * Update user streak
 */
export async function updateStreak(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const [stats] = await db
    .select()
    .from(schema.userStats)
    .where(eq(schema.userStats.userId, userId));

  if (!stats) {
    // Create stats with streak of 1
    await db.insert(schema.userStats).values({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastLoginDate: new Date(),
    });
    
    // Award XP for first login
    await awardXP(userId, 10, 'Daily login', 'streak');
    return { currentStreak: 1, isNewStreak: true };
  }

  const now = new Date();
  const lastLogin = stats.lastLoginDate;

  if (!lastLogin) {
    // First login
    await db
      .update(schema.userStats)
      .set({
        currentStreak: 1,
        longestStreak: 1,
        lastLoginDate: now,
      })
      .where(eq(schema.userStats.userId, userId));
    
    await awardXP(userId, 10, 'Daily login', 'streak');
    return { currentStreak: 1, isNewStreak: true };
  }

  // Check if last login was yesterday
  const lastLoginDate = new Date(lastLogin);
  lastLoginDate.setHours(0, 0, 0, 0);
  
  const todayDate = new Date(now);
  todayDate.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((todayDate.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Already logged in today
    return { currentStreak: stats.currentStreak, isNewStreak: false };
  } else if (daysDiff === 1) {
    // Consecutive day - increment streak
    const newStreak = stats.currentStreak + 1;
    const newLongestStreak = Math.max(newStreak, stats.longestStreak);

    await db
      .update(schema.userStats)
      .set({
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastLoginDate: now,
      })
      .where(eq(schema.userStats.userId, userId));

    // Award XP (increases with streak)
    const xpReward = Math.min(10 + newStreak * 2, 100); // Cap at 100 XP
    await awardXP(userId, xpReward, `Daily login (${newStreak} day streak)`, 'streak');

    // Check for streak achievements
    if (newStreak === 3) await unlockAchievement(userId, 'streak_3');
    if (newStreak === 7) await unlockAchievement(userId, 'streak_7');
    if (newStreak === 14) await unlockAchievement(userId, 'streak_14');
    if (newStreak === 30) await unlockAchievement(userId, 'streak_30');
    if (newStreak === 100) await unlockAchievement(userId, 'streak_100');

    return { currentStreak: newStreak, isNewStreak: true };
  } else {
    // Streak broken - reset to 1
    await db
      .update(schema.userStats)
      .set({
        currentStreak: 1,
        lastLoginDate: now,
      })
      .where(eq(schema.userStats.userId, userId));

    await awardXP(userId, 10, 'Daily login', 'streak');
    return { currentStreak: 1, isNewStreak: true, streakBroken: true };
  }
}

/**
 * Check and unlock achievements based on user progress
 */
export async function checkAchievements(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const [stats] = await db
    .select()
    .from(schema.userStats)
    .where(eq(schema.userStats.userId, userId));

  if (!stats) return;

  // Check lesson-based achievements
  if (stats.lessonsCompleted === 1) {
    await unlockAchievement(userId, 'first_lesson');
  }

  // Check halfway achievement (42 lessons out of 84)
  if (stats.lessonsCompleted >= 42) {
    await unlockAchievement(userId, 'halfway_there');
  }

  // Check perfect quiz achievements
  if (stats.perfectScores === 1) {
    await unlockAchievement(userId, 'perfect_quiz');
  }
  if (stats.perfectScores >= 5) {
    await unlockAchievement(userId, 'perfect_5_quizzes');
  }

  // Check referral achievements
  const referralCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.referrals)
    .where(eq(schema.referrals.referrerId, userId));

  const count = referralCount[0]?.count || 0;
  if (count >= 1) await unlockAchievement(userId, 'first_referral');
  if (count >= 5) await unlockAchievement(userId, 'referral_5');
  if (count >= 10) await unlockAchievement(userId, 'referral_10');
}

/**
 * Get user's gamification stats
 */
export async function getUserGamificationStats(userId: number) {
  const db = await getDb();
  if (!db) return {
    totalXp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    lessonsCompleted: 0,
    quizzesCompleted: 0,
    perfectScores: 0,
    xpForNextLevel: 500,
    progressToNextLevel: 0,
  };

  const [stats] = await db
    .select()
    .from(schema.userStats)
    .where(eq(schema.userStats.userId, userId));

  if (!stats) {
    return {
      totalXp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lessonsCompleted: 0,
      quizzesCompleted: 0,
      perfectScores: 0,
      xpForNextLevel: 500,
      progressToNextLevel: 0,
    };
  }

  const xpForNextLevel = getXpForNextLevel(stats.level);
  const xpForCurrentLevel = stats.level === 1 ? 0 : getXpForNextLevel(stats.level - 1);
  const xpInCurrentLevel = stats.totalXp - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  const progressToNextLevel = Math.floor((xpInCurrentLevel / xpNeededForLevel) * 100);

  return {
    ...stats,
    xpForNextLevel,
    progressToNextLevel,
  };
}

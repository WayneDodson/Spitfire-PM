import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const achievements = [
  // Milestone Achievements - Progress-based
  {
    key: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    xpReward: 50,
    category: 'milestone',
    orderIndex: 1,
  },
  {
    key: 'level_1_complete',
    title: 'PM Foundation',
    description: 'Complete Level 1: Introduction to Project Management',
    icon: '🏆',
    xpReward: 200,
    category: 'milestone',
    orderIndex: 2,
  },
  {
    key: 'level_2_complete',
    title: 'Waterfall Master',
    description: 'Complete Level 2: Waterfall Methodology',
    icon: '📊',
    xpReward: 250,
    category: 'milestone',
    orderIndex: 3,
  },
  {
    key: 'level_3_complete',
    title: 'Agile Champion',
    description: 'Complete Level 3: Agile & Scrum',
    icon: '🚀',
    xpReward: 300,
    category: 'milestone',
    orderIndex: 4,
  },
  {
    key: 'level_4_complete',
    title: 'Stakeholder Whisperer',
    description: 'Complete Level 4: Stakeholder Management',
    icon: '🤝',
    xpReward: 350,
    category: 'milestone',
    orderIndex: 5,
  },
  {
    key: 'level_5_complete',
    title: 'Risk Navigator',
    description: 'Complete Level 5: Risk & Budget Management',
    icon: '⚖️',
    xpReward: 400,
    category: 'milestone',
    orderIndex: 6,
  },
  {
    key: 'level_6_complete',
    title: 'Team Leader',
    description: 'Complete Level 6: Leadership & Team Management',
    icon: '👥',
    xpReward: 450,
    category: 'milestone',
    orderIndex: 7,
  },
  {
    key: 'level_7_complete',
    title: 'PM Professional',
    description: 'Complete Level 7: Advanced PM & Certification Prep',
    icon: '🎓',
    xpReward: 500,
    category: 'milestone',
    orderIndex: 8,
  },
  {
    key: 'halfway_there',
    title: 'Halfway Hero',
    description: 'Complete 50% of all lessons',
    icon: '⭐',
    xpReward: 150,
    category: 'milestone',
    orderIndex: 9,
  },
  {
    key: 'course_complete',
    title: 'PM Master',
    description: 'Complete all 7 levels',
    icon: '👑',
    xpReward: 1000,
    category: 'milestone',
    orderIndex: 10,
  },

  // Streak Achievements - Consistency rewards
  {
    key: 'streak_3',
    title: 'Getting Started',
    description: 'Login 3 days in a row',
    icon: '🔥',
    xpReward: 50,
    category: 'streak',
    orderIndex: 11,
  },
  {
    key: 'streak_7',
    title: 'Week Warrior',
    description: 'Login 7 days in a row',
    icon: '🔥🔥',
    xpReward: 100,
    category: 'streak',
    orderIndex: 12,
  },
  {
    key: 'streak_14',
    title: 'Fortnight Fighter',
    description: 'Login 14 days in a row',
    icon: '🔥🔥🔥',
    xpReward: 200,
    category: 'streak',
    orderIndex: 13,
  },
  {
    key: 'streak_30',
    title: 'Monthly Master',
    description: 'Login 30 days in a row',
    icon: '🔥🔥🔥🔥',
    xpReward: 400,
    category: 'streak',
    orderIndex: 14,
  },
  {
    key: 'streak_100',
    title: 'Century Champion',
    description: 'Login 100 days in a row',
    icon: '💯',
    xpReward: 1000,
    category: 'streak',
    orderIndex: 15,
  },

  // Mastery Achievements - Skill-based
  {
    key: 'perfect_quiz',
    title: 'Quiz Ace',
    description: 'Get 100% on your first knowledge check',
    icon: '💯',
    xpReward: 75,
    category: 'mastery',
    orderIndex: 16,
  },
  {
    key: 'perfect_5_quizzes',
    title: 'Quiz Master',
    description: 'Get 100% on 5 knowledge checks',
    icon: '🎯',
    xpReward: 200,
    category: 'mastery',
    orderIndex: 17,
  },
  {
    key: 'perfect_all_quizzes',
    title: 'Quiz Legend',
    description: 'Get 100% on all knowledge checks',
    icon: '🏅',
    xpReward: 500,
    category: 'mastery',
    orderIndex: 18,
  },
  {
    key: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete a level in under 4 hours',
    icon: '⚡',
    xpReward: 150,
    category: 'mastery',
    orderIndex: 19,
  },
  {
    key: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a lesson between midnight and 5am',
    icon: '🦉',
    xpReward: 50,
    category: 'special',
    orderIndex: 20,
  },
  {
    key: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a lesson between 5am and 7am',
    icon: '🌅',
    xpReward: 50,
    category: 'special',
    orderIndex: 21,
  },

  // Social Achievements - Referral-based
  {
    key: 'first_referral',
    title: 'Sharing is Caring',
    description: 'Refer your first friend',
    icon: '🎁',
    xpReward: 100,
    category: 'social',
    orderIndex: 22,
  },
  {
    key: 'referral_5',
    title: 'Influencer',
    description: 'Refer 5 friends',
    icon: '📢',
    xpReward: 300,
    category: 'social',
    orderIndex: 23,
  },
  {
    key: 'referral_10',
    title: 'Community Builder',
    description: 'Refer 10 friends',
    icon: '🌟',
    xpReward: 600,
    category: 'social',
    orderIndex: 24,
  },

  // Special Achievements - Unique milestones
  {
    key: 'first_scenario',
    title: 'Scenario Starter',
    description: 'Complete your first practice scenario',
    icon: '🎮',
    xpReward: 100,
    category: 'special',
    orderIndex: 25,
  },
  {
    key: 'all_scenarios',
    title: 'Scenario Master',
    description: 'Complete all practice scenarios',
    icon: '🎪',
    xpReward: 300,
    category: 'special',
    orderIndex: 26,
  },
  {
    key: 'premium_unlock',
    title: 'Premium Member',
    description: 'Unlock premium levels (3-7)',
    icon: '💎',
    xpReward: 200,
    category: 'special',
    orderIndex: 27,
  },
];

console.log('Seeding achievements...');

for (const achievement of achievements) {
  await db.insert(schema.achievements).values(achievement);
  console.log(`✓ ${achievement.title}`);
}

console.log(`\n✅ Successfully seeded ${achievements.length} achievements!`);

await connection.end();

import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// 1. Find the user
const [users] = await conn.execute("SELECT id, username, email, role, trialStartedAt, trialEndsAt FROM users WHERE username = 'user'");
if (!users.length) { console.error('User not found'); process.exit(1); }
const user = users[0];
console.log('Found user:', user.id, user.username, user.email);

// 2. Give the user a permanent subscription so they bypass all trial/access checks
// Check if subscription exists
const [subs] = await conn.execute("SELECT id, status FROM subscriptions WHERE userId = ?", [user.id]);
if (subs.length) {
  await conn.execute(
    "UPDATE subscriptions SET status = 'active', currentPeriodEnd = DATE_ADD(NOW(), INTERVAL 10 YEAR) WHERE userId = ?",
    [user.id]
  );
  console.log('Updated existing subscription to active (10 year)');
} else {
  await conn.execute(
    `INSERT INTO subscriptions (userId, stripeCustomerId, stripeSubscriptionId, status, currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd, createdAt)
     VALUES (?, 'cus_test_user', 'sub_test_user', 'active', NOW(), DATE_ADD(NOW(), INTERVAL 10 YEAR), 0, NOW())`,
    [user.id]
  );
  console.log('Created new active subscription (10 year)');
}

// 3. Extend trial end date far into the future as a belt-and-suspenders measure
await conn.execute(
  "UPDATE users SET trialEndsAt = DATE_ADD(NOW(), INTERVAL 10 YEAR), founderAccessEarned = 1 WHERE id = ?",
  [user.id]
);
console.log('Extended trial end date to 10 years from now');

// 4. Reset all lesson progress
const [lpResult] = await conn.execute("DELETE FROM userLessonProgress WHERE userId = ?", [user.id]);
console.log(`Deleted ${lpResult.affectedRows} lesson progress rows`);

// 5. Reset knowledge check attempts
const [kcResult] = await conn.execute("DELETE FROM userKnowledgeCheckAttempts WHERE userId = ?", [user.id]);
console.log(`Deleted ${kcResult.affectedRows} knowledge check attempt rows`);

// 6. Reset achievements
const [achResult] = await conn.execute("DELETE FROM userAchievements WHERE userId = ?", [user.id]);
console.log(`Deleted ${achResult.affectedRows} achievement rows`);

// 7. Reset daily engagement
const [deResult] = await conn.execute("DELETE FROM dailyEngagement WHERE userId = ?", [user.id]);
console.log(`Deleted ${deResult.affectedRows} daily engagement rows`);

// 8. Reset user progress (level progress)
const [upResult] = await conn.execute("DELETE FROM userProgress WHERE userId = ?", [user.id]);
console.log(`Deleted ${upResult.affectedRows} user progress rows`);

// 9. Reset XP transactions
const [xpResult] = await conn.execute("DELETE FROM xpTransactions WHERE userId = ?", [user.id]);
console.log(`Deleted ${xpResult.affectedRows} XP transaction rows`);

// 10. Reset userStats (XP, streak, etc.)
const [statsResult] = await conn.execute("DELETE FROM userStats WHERE userId = ?", [user.id]);
console.log(`Deleted ${statsResult.affectedRows} userStats rows`);

await conn.end();
console.log('\nDone! User "user" now has full unrestricted access and clean progress.');

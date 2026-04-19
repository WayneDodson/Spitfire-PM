/**
 * seed-accounts.mjs
 *
 * Creates or updates two accounts:
 *  1. Test user  — username: user,  email: user@spitfire-pm.com,  password: Edenbridge1!
 *  2. Admin user — username: admin, email: admin@spitfire-pm.com, password: 1jV1v15ta03!
 *
 * Run once after DB is ready:
 *   node scripts/seed-accounts.mjs
 */

import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is not set.");
  process.exit(1);
}

const COST_FACTOR = 12;

const ACCOUNTS = [
  {
    username: "user",
    email: "user@spitfire-pm.com",
    displayName: "Test User",
    password: "Edenbridge1!",
    role: "user",
  },
  {
    username: "admin",
    email: "admin@spitfire-pm.com",
    displayName: "Admin",
    password: "1jV1v15ta03!",
    role: "admin",
  },
];

async function run() {
  const connection = await mysql.createConnection(DATABASE_URL);

  try {
    for (const account of ACCOUNTS) {
      const hash = await bcrypt.hash(account.password, COST_FACTOR);

      // Check if user exists by username or email
      const [rows] = await connection.execute(
        "SELECT id, username, email, role FROM users WHERE username = ? OR email = ? LIMIT 1",
        [account.username, account.email]
      );

      if (rows.length > 0) {
        const existing = rows[0];
        // Update password hash and role
        await connection.execute(
          "UPDATE users SET passwordHash = ?, role = ?, displayName = ?, name = ?, authProvider = 'email', emailVerified = 1, lastSignedIn = NOW() WHERE id = ?",
          [hash, account.role, account.displayName, account.displayName, existing.id]
        );
        console.log(`✓ Updated existing account: ${account.username} (id=${existing.id}, role=${account.role})`);
      } else {
        // Generate a simple referral code
        const referralCode = account.username.toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();

        await connection.execute(
          `INSERT INTO users
            (email, passwordHash, displayName, name, username, role, authProvider, emailVerified, referralCode, lastSignedIn, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, 'email', 1, ?, NOW(), NOW())`,
          [account.email, hash, account.displayName, account.displayName, account.username, account.role, referralCode]
        );
        console.log(`✓ Created new account: ${account.username} (role=${account.role})`);
      }
    }

    console.log("\nAll accounts seeded successfully.");
    console.log("─────────────────────────────────────────");
    console.log("  Test user  → username: user  / password: Edenbridge1!");
    console.log("  Admin      → username: admin / password: 1jV1v15ta03!");
    console.log("─────────────────────────────────────────");
  } finally {
    await connection.end();
  }
}

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});

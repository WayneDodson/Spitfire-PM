/**
 * Creates the owner admin account.
 * Username: Admin  |  Password: Edenbridge1  |  Role: admin
 * Run with: node scripts/create-admin.mjs
 */
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const USERNAME = "Admin";
const PASSWORD = "Edenbridge1";
const DISPLAY_NAME = "Admin";
const EMAIL = "admin@pmsimulate-6wguss2v.manus.space"; // internal placeholder

function generateReferralCode() {
  const bytes = crypto.randomBytes(6);
  return Array.from(bytes)
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .toUpperCase()
    .slice(0, 8);
}

const conn = await mysql.createConnection(DATABASE_URL);

try {
  // Check if username already exists
  const [existing] = await conn.execute(
    "SELECT id, username, role FROM users WHERE username = ?",
    [USERNAME]
  );

  if (existing.length > 0) {
    const acct = existing[0];
    console.log(`Account with username "${USERNAME}" already exists (id=${acct.id}, role=${acct.role}).`);

    // Update password and ensure admin role
    const passwordHash = await bcrypt.hash(PASSWORD, 12);
    await conn.execute(
      "UPDATE users SET passwordHash = ?, role = 'admin', emailVerified = 1 WHERE id = ?",
      [passwordHash, acct.id]
    );
    console.log(`✅ Updated password and confirmed role=admin for "${USERNAME}" (id=${acct.id}).`);
  } else {
    const passwordHash = await bcrypt.hash(PASSWORD, 12);
    const referralCode = generateReferralCode();

    const [result] = await conn.execute(
      `INSERT INTO users
         (email, username, passwordHash, displayName, name, role, authProvider, emailVerified, referralCode, lastSignedIn, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, 'admin', 'email', 1, ?, NOW(), NOW(), NOW())`,
      [EMAIL, USERNAME, passwordHash, DISPLAY_NAME, DISPLAY_NAME, referralCode]
    );

    console.log(`✅ Created admin account:`);
    console.log(`   id:       ${result.insertId}`);
    console.log(`   username: ${USERNAME}`);
    console.log(`   role:     admin`);
    console.log(`   email:    ${EMAIL}`);
  }
} finally {
  await conn.end();
}

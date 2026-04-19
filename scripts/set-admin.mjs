/**
 * One-time script: ensure jenny_sacay_herbert@outlook.com has role=admin.
 * Creates the account if it doesn't exist yet.
 * Run with: node scripts/set-admin.mjs
 */
import mysql from "mysql2/promise";
import crypto from "crypto";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const JENNY_EMAIL = "jenny_sacay_herbert@outlook.com";
const JENNY_DISPLAY_NAME = "Jenny";

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
  // Check if Jenny already exists
  const [rows] = await conn.execute(
    "SELECT id, email, displayName, role FROM users WHERE email = ?",
    [JENNY_EMAIL]
  );

  if (rows.length > 0) {
    const jenny = rows[0];
    console.log(`Found existing account: id=${jenny.id}, role=${jenny.role}`);

    if (jenny.role === "admin") {
      console.log("✅ Jenny is already an admin. No changes needed.");
    } else {
      await conn.execute("UPDATE users SET role = 'admin', emailVerified = 1 WHERE id = ?", [jenny.id]);
      console.log(`✅ Updated Jenny (id=${jenny.id}) to role=admin and emailVerified=true.`);
    }
  } else {
    // Account doesn't exist yet — pre-create it with admin role.
    // No password set (null) so she must sign in via Google or use password reset.
    const referralCode = generateReferralCode();
    const [result] = await conn.execute(
      `INSERT INTO users (email, displayName, name, role, authProvider, emailVerified, referralCode, lastSignedIn, createdAt, updatedAt)
       VALUES (?, ?, ?, 'admin', 'email', 1, ?, NOW(), NOW(), NOW())`,
      [JENNY_EMAIL, JENNY_DISPLAY_NAME, JENNY_DISPLAY_NAME, referralCode]
    );
    const newId = result.insertId;
    console.log(`✅ Created admin account for Jenny (id=${newId}, email=${JENNY_EMAIL}).`);
    console.log(`   She can set her password via the "Forgot password?" flow on the login page.`);
  }
} finally {
  await conn.end();
}

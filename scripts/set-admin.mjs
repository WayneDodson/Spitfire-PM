/**
 * set-admin.mjs
 * ─────────────────────────────────────────────────────────────────
 * One-time script to restore admin role for protected admin users.
 * Run this after any deployment that may have wiped admin roles.
 *
 * Usage (from project root):
 *   PROTECTED_ADMIN_EMAILS="wayne_dodson@hotmail.com,jenny_sacay_herbert@outlook.com" \
 *   DATABASE_URL="your-db-url" node scripts/set-admin.mjs
 *
 * Or if your .env file is present, just run:
 *   node scripts/set-admin.mjs
 * ─────────────────────────────────────────────────────────────────
 */

import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const PROTECTED_EMAILS_RAW = process.env.PROTECTED_ADMIN_EMAILS ?? "";

if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set.");
  process.exit(1);
}

const emails = PROTECTED_EMAILS_RAW
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

if (emails.length === 0) {
  console.error("❌  PROTECTED_ADMIN_EMAILS is not set.");
  console.error('    Example: PROTECTED_ADMIN_EMAILS="a@example.com,b@example.com"');
  process.exit(1);
}

console.log(`\n🔧  Connecting to database...`);
console.log(`📋  Emails to promote: ${emails.join(", ")}\n`);

let connection;
try {
  connection = await createConnection(DATABASE_URL);
  let promoted = 0;
  let alreadyAdmin = 0;
  let notFound = 0;

  for (const email of emails) {
    const [rows] = await connection.execute(
      "SELECT id, email, role FROM users WHERE LOWER(email) = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      console.warn(`⚠️   Not found: ${email} — sign in once first, then re-run.`);
      notFound++;
      continue;
    }

    const user = rows[0];
    if (user.role === "admin") {
      console.log(`✅  Already admin: ${user.email}`);
      alreadyAdmin++;
      continue;
    }

    await connection.execute(
      "UPDATE users SET role = 'admin' WHERE id = ?",
      [user.id]
    );
    console.log(`🎉  Promoted to admin: ${user.email}`);
    promoted++;
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`  Promoted:      ${promoted}`);
  console.log(`  Already admin: ${alreadyAdmin}`);
  console.log(`  Not found:     ${notFound}`);
  console.log(`─────────────────────────────────────`);

  if (promoted > 0) {
    console.log("\n✅  Done. Sign in again at spitfire-pm.com to activate admin access.");
  }

} catch (err) {
  console.error("❌  Database error:", err.message);
  process.exit(1);
} finally {
  if (connection) await connection.end();
}

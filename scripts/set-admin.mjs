/**
 * set-admin.mjs
 * One-time script to restore admin role for the site owner.
 *
 * Usage (run from project root):
 *   OWNER_EMAIL="your@email.com" node scripts/set-admin.mjs
 */

import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const OWNER_EMAIL = process.env.OWNER_EMAIL;

if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set.");
  process.exit(1);
}
if (!OWNER_EMAIL) {
  console.error("❌  OWNER_EMAIL is not set.");
  console.error("    Usage: OWNER_EMAIL=your@email.com node scripts/set-admin.mjs");
  process.exit(1);
}

let connection;
try {
  console.log("🔧  Connecting to database...");
  connection = await createConnection(DATABASE_URL);

  const [rows] = await connection.execute(
    "SELECT id, email, role FROM users WHERE email = ? LIMIT 1",
    [OWNER_EMAIL]
  );

  if (rows.length === 0) {
    console.error(`❌  No user found with email: ${OWNER_EMAIL}`);
    console.error("    Sign in at least once before running this script.");
    process.exit(1);
  }

  const user = rows[0];
  console.log(`✅  Found user: ${user.email} (current role: ${user.role})`);

  if (user.role === "admin") {
    console.log("ℹ️   Already an admin — no changes needed.");
    process.exit(0);
  }

  await connection.execute("UPDATE users SET role = 'admin' WHERE email = ?", [OWNER_EMAIL]);
  console.log(`🎉  Done! ${user.email} is now admin.`);
  console.log("    Sign in again at spitfire-pm.com to activate admin access.");
} catch (err) {
  console.error("❌  Error:", err.message);
  process.exit(1);
} finally {
  if (connection) await connection.end();
}

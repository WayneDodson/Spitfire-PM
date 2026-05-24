/**
 * update-user-account.mjs
 * Updates the 'user' account: sets password to Abuyog79 and role to admin.
 */

import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const conn = await createConnection(process.env.DATABASE_URL);

const newPassword = 'Abuyog79';
const hash = await bcrypt.hash(newPassword, 12);

const [result] = await conn.execute(
  "UPDATE users SET passwordHash = ?, role = 'admin' WHERE username = 'user'",
  [hash]
);

console.log(`Rows updated: ${result.affectedRows}`);

// Verify
const [rows] = await conn.query(
  "SELECT id, username, email, role FROM users WHERE username = 'user'"
);
console.log('Updated account:', rows[0]);

await conn.end();
console.log('Done.');

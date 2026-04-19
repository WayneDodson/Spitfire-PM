/**
 * fix-lesson-newlines.mjs
 *
 * Replaces literal \n (two-char backslash-n) sequences in lesson content
 * with real newline characters so markdown renders correctly.
 *
 * Also handles \t (tab) sequences while we're at it.
 */

import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const conn = await createConnection(process.env.DATABASE_URL);

// Count how many lessons have literal \n
const [countRows] = await conn.query(
  "SELECT COUNT(*) as cnt FROM lessons WHERE content LIKE '%\\\\n%'"
);
console.log(`Lessons with literal \\n sequences: ${countRows[0].cnt}`);

// Use MySQL REPLACE() to swap literal \n -> real newline
// MySQL string literal for a real newline is CHAR(10)
const [result] = await conn.execute(
  "UPDATE lessons SET content = REPLACE(content, '\\\\n', CHAR(10))"
);
console.log(`Rows updated: ${result.affectedRows}`);

// Also fix literal \t -> real tab (in case any exist)
const [result2] = await conn.execute(
  "UPDATE lessons SET content = REPLACE(content, '\\\\t', CHAR(9))"
);
console.log(`Rows updated for \\t: ${result2.affectedRows}`);

// Verify: sample lesson 3 (the one shown in the screenshot)
const [sample] = await conn.query(
  'SELECT id, title, SUBSTRING(content, 1, 200) as snippet FROM lessons WHERE id = 3'
);
console.log('\n--- Sample after fix (lesson 3, first 200 chars) ---');
console.log(JSON.stringify(sample[0].snippet));
console.log('\nRendered preview:');
console.log(sample[0].snippet);

await conn.end();
console.log('\nDone.');

/**
 * merge-split-results.mjs
 * Merges the two parallel processing result files and checks coverage
 * against actual lesson IDs in the database.
 */
import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Load both result files
const batch1 = JSON.parse(fs.readFileSync('/home/ubuntu/split_lessons.json', 'utf8'));
const batch2 = JSON.parse(fs.readFileSync('/home/ubuntu/split_lessons_retry.json', 'utf8'));

// Collect all successful results
const allResults = [];
for (const r of [...batch1.results, ...batch2.results]) {
  if (r.output && r.output.part_a_title && r.output.original_lesson_id) {
    allResults.push(r.output);
  }
}

console.log('Total successful splits:', allResults.length);

// Check against DB
const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [dbLessons] = await conn.execute('SELECT id FROM lessons ORDER BY id');
const dbIds = new Set(dbLessons.map(r => r.id));
const splitIds = new Set(allResults.map(r => r.original_lesson_id));

console.log('DB lesson IDs count:', dbIds.size);
console.log('Split result IDs count:', splitIds.size);

const missing = [...dbIds].filter(id => !splitIds.has(id));
const extra = [...splitIds].filter(id => !dbIds.has(id));

console.log('Missing from splits (DB lessons not split):', missing);
console.log('Extra in splits (not in DB):', extra);

// Save merged results
fs.writeFileSync('/home/ubuntu/split_lessons_merged.json', JSON.stringify(allResults, null, 2));
console.log('\nMerged results saved to /home/ubuntu/split_lessons_merged.json');

await conn.end();

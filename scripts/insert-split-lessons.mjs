/**
 * insert-split-lessons.mjs
 *
 * Replaces all 84 original lessons with 168 micro-lessons (Part A + Part B).
 * Strategy:
 *  1. Load all split results (batch1 for IDs 1-6, missing batch for IDs 7+)
 *  2. For each original lesson, UPDATE it in-place to become Part A (preserving its ID)
 *  3. INSERT a new row for Part B (gets a new auto-increment ID)
 *  4. Renumber lessonNumber 1-24 per level (Part A = odd, Part B = even)
 *  5. Update estimatedMinutes to the AI-generated values
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ── Load results ──────────────────────────────────────────────────────────────
const batch1 = JSON.parse(fs.readFileSync('/home/ubuntu/split_lessons.json', 'utf8'));
const batchMissing = JSON.parse(fs.readFileSync('/home/ubuntu/split_lessons_missing.json', 'utf8'));

// Collect all successful splits, keyed by originalLessonId
const splitMap = new Map();

for (const r of [...batch1.results, ...batchMissing.results]) {
  if (!r.output || !r.output.part_a_title || !r.output.original_lesson_id) continue;
  const o = r.output;
  splitMap.set(o.original_lesson_id, o);
}

console.log(`Loaded ${splitMap.size} split results`);

// ── Get all original lessons from DB ─────────────────────────────────────────
const [dbLessons] = await conn.execute(
  'SELECT id, levelId, lessonNumber FROM lessons ORDER BY levelId, lessonNumber'
);

console.log(`Found ${dbLessons.length} lessons in DB`);

// ── Group by level to calculate new lessonNumbers ────────────────────────────
const byLevel = {};
for (const lesson of dbLessons) {
  if (!byLevel[lesson.levelId]) byLevel[lesson.levelId] = [];
  byLevel[lesson.levelId].push(lesson);
}

let updatedCount = 0;
let insertedCount = 0;
let skippedCount = 0;

for (const [levelId, levelLessons] of Object.entries(byLevel)) {
  // Sort by original lesson number
  levelLessons.sort((a, b) => a.lessonNumber - b.lessonNumber);

  let newLessonNum = 1;

  for (const lesson of levelLessons) {
    const split = splitMap.get(lesson.id);

    if (!split) {
      console.warn(`  No split found for lesson ID ${lesson.id} (level ${levelId}, lesson ${lesson.lessonNumber}) — skipping`);
      skippedCount++;
      continue;
    }

    const partANum = newLessonNum;
    const partBNum = newLessonNum + 1;
    newLessonNum += 2;

    // UPDATE original row → Part A
    await conn.execute(
      `UPDATE lessons SET
        lessonNumber = ?,
        title = ?,
        content = ?,
        estimatedMinutes = ?,
        parentLessonId = ?,
        partNumber = 1,
        updatedAt = NOW()
       WHERE id = ?`,
      [
        partANum,
        split.part_a_title,
        split.part_a_content,
        split.part_a_minutes || 10,
        lesson.id, // parentLessonId points to itself (it IS the original)
        lesson.id,
      ]
    );
    updatedCount++;

    // INSERT new row → Part B
    await conn.execute(
      `INSERT INTO lessons (levelId, lessonNumber, title, content, estimatedMinutes, parentLessonId, partNumber, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, 2, NOW(), NOW())`,
      [
        lesson.levelId,
        partBNum,
        split.part_b_title,
        split.part_b_content,
        split.part_b_minutes || 10,
        lesson.id, // parentLessonId references the Part A row
      ]
    );
    insertedCount++;
  }

  console.log(`Level ${levelId}: ${levelLessons.length} originals → ${levelLessons.length * 2} micro-lessons`);
}

console.log(`\n✓ Updated ${updatedCount} Part A lessons`);
console.log(`✓ Inserted ${insertedCount} Part B lessons`);
console.log(`⚠ Skipped ${skippedCount} lessons (no split data)`);

// Verify final count
const [finalCount] = await conn.execute('SELECT levelId, COUNT(*) as count FROM lessons GROUP BY levelId ORDER BY levelId');
console.log('\nFinal lesson counts per level:');
console.table(finalCount);

await conn.end();

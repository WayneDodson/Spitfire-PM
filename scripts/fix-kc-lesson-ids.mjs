/**
 * Fix knowledge check lessonId mapping.
 *
 * The confidence checks were inserted with sequential lessonIds 1-168,
 * but the actual lesson IDs in the DB are non-sequential (1, 120001, 2, 120002, ...).
 *
 * This script:
 * 1. Fetches all lessons ordered by levelId, lessonNumber → gives us the correct ordered list
 * 2. Fetches all confidence checks ordered by id → they were inserted in lesson order
 * 3. Updates each check's lessonId to the correct actual lesson ID
 */

import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// 1. Get all lessons in correct order (levelId ASC, lessonNumber ASC)
const [lessons] = await conn.execute(
  'SELECT id, levelId, lessonNumber FROM lessons ORDER BY levelId ASC, lessonNumber ASC'
);
console.log(`Total lessons: ${lessons.length}`);

// 2. Get all confidence checks (non-assessment) ordered by id
const [checks] = await conn.execute(
  'SELECT id, lessonId, levelId FROM knowledgeChecks WHERE isLevelAssessment = 0 ORDER BY id ASC'
);
console.log(`Total confidence checks: ${checks.length}`);

if (lessons.length !== checks.length) {
  console.warn(`WARNING: lesson count (${lessons.length}) != check count (${checks.length})`);
}

// 3. Build the mapping: check[i] should map to lessons[i]
let updated = 0;
let errors = 0;

for (let i = 0; i < checks.length; i++) {
  const check = checks[i];
  const lesson = lessons[i];
  
  if (!lesson) {
    console.error(`No lesson for check index ${i} (checkId=${check.id})`);
    errors++;
    continue;
  }
  
  if (check.lessonId === lesson.id && check.levelId === lesson.levelId) {
    // Already correct
    continue;
  }
  
  try {
    await conn.execute(
      'UPDATE knowledgeChecks SET lessonId = ?, levelId = ? WHERE id = ?',
      [lesson.id, lesson.levelId, check.id]
    );
    updated++;
    
    if (i < 30 || updated % 20 === 0) {
      console.log(`  Updated check ${check.id}: lessonId ${check.lessonId} → ${lesson.id} (level ${lesson.levelId}, lesson #${lesson.lessonNumber})`);
    }
  } catch (err) {
    console.error(`Error updating check ${check.id}:`, err.message);
    errors++;
  }
}

console.log(`\nDone. Updated: ${updated}, Errors: ${errors}`);

// Verify Level 1 mapping
const [level1Lessons] = await conn.execute(
  'SELECT id, lessonNumber FROM lessons WHERE levelId = 1 ORDER BY lessonNumber LIMIT 5'
);
console.log('\nLevel 1 lessons (first 5):', level1Lessons.map(l => `#${l.lessonNumber}→id:${l.id}`).join(', '));

const [level1Checks] = await conn.execute(
  'SELECT id, lessonId FROM knowledgeChecks WHERE levelId = 1 AND isLevelAssessment = 0 ORDER BY id LIMIT 5'
);
console.log('Level 1 checks (first 5):', level1Checks.map(c => `checkId:${c.id}→lessonId:${c.lessonId}`).join(', '));

await conn.end();

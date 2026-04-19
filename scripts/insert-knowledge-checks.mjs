/**
 * insert-knowledge-checks.mjs
 *
 * Inserts:
 *  1. 168 per-lesson confidence check questions (isLevelAssessment = false)
 *  2. 35 end-of-level assessment questions (isLevelAssessment = true, afterLessonNumber = 25)
 *
 * Clears existing knowledgeChecks first to avoid duplicates.
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ── Clear existing knowledge checks ──────────────────────────────────────────
const [delResult] = await conn.execute('DELETE FROM knowledgeChecks');
console.log(`Cleared ${delResult.affectedRows} existing knowledge checks`);

// ── 1. Insert per-lesson confidence checks ───────────────────────────────────
const ccData = JSON.parse(fs.readFileSync('/home/ubuntu/generate_confidence_checks.json', 'utf8'));
let ccInserted = 0;
let ccSkipped = 0;

for (const r of ccData.results) {
  if (!r.output || !r.output.lesson_id) { ccSkipped++; continue; }
  const o = r.output;

  // Parse options — might be a string or already an array
  let options;
  try {
    options = typeof o.options === 'string' ? JSON.parse(o.options) : o.options;
    if (!Array.isArray(options) || options.length !== 4) throw new Error('bad options');
  } catch {
    console.warn(`  Skipping lesson ${o.lesson_id}: invalid options format`);
    ccSkipped++;
    continue;
  }

  await conn.execute(
    `INSERT INTO knowledgeChecks
      (levelId, afterLessonNumber, lessonId, question, options, correctAnswerIndex, explanation, reinforcementMessage, isLevelAssessment, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, false, NOW())`,
    [
      o.level_id,
      o.lesson_number,
      o.lesson_id,
      o.question,
      JSON.stringify(options),
      parseInt(o.correct_answer_index, 10),
      o.explanation,
      o.reinforcement_message || 'Great work — you\'ve got this!',
    ]
  );
  ccInserted++;
}

console.log(`✓ Inserted ${ccInserted} confidence check questions (skipped ${ccSkipped})`);

// ── 2. Insert end-of-level assessment questions ───────────────────────────────
const assessData = JSON.parse(fs.readFileSync('/home/ubuntu/generate_level_assessments.json', 'utf8'));
let assessInserted = 0;

for (const r of assessData.results) {
  if (!r.output || !r.output.level_id) continue;
  const o = r.output;

  for (let i = 1; i <= 5; i++) {
    const question = o[`q${i}_question`];
    const optionsRaw = o[`q${i}_options`];
    const correct = o[`q${i}_correct`];
    const explanation = o[`q${i}_explanation`];

    if (!question) continue;

    let options;
    try {
      options = typeof optionsRaw === 'string' ? JSON.parse(optionsRaw) : optionsRaw;
      if (!Array.isArray(options) || options.length !== 4) throw new Error('bad options');
    } catch {
      console.warn(`  Skipping level ${o.level_id} Q${i}: invalid options`);
      continue;
    }

    // afterLessonNumber = 25 signals "after all 24 lessons" (end-of-level)
    await conn.execute(
      `INSERT INTO knowledgeChecks
        (levelId, afterLessonNumber, lessonId, question, options, correctAnswerIndex, explanation, reinforcementMessage, isLevelAssessment, createdAt)
       VALUES (?, 25, NULL, ?, ?, ?, ?, ?, true, NOW())`,
      [
        o.level_id,
        question,
        JSON.stringify(options),
        parseInt(correct, 10),
        explanation,
        'Excellent — you\'re thinking like a PM!',
      ]
    );
    assessInserted++;
  }
}

console.log(`✓ Inserted ${assessInserted} end-of-level assessment questions`);

// ── Verify ────────────────────────────────────────────────────────────────────
const [summary] = await conn.execute(
  'SELECT levelId, isLevelAssessment, COUNT(*) as count FROM knowledgeChecks GROUP BY levelId, isLevelAssessment ORDER BY levelId, isLevelAssessment'
);
console.log('\nKnowledge check summary:');
console.table(summary);

await conn.end();

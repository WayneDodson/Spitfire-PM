/**
 * fix-level7-q2.mjs
 * Inserts the missing Level 7 Q2 end-of-level assessment question.
 * Level 7 = Advanced PM & Certification Prep
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

await conn.execute(
  `INSERT INTO knowledgeChecks
    (levelId, afterLessonNumber, lessonId, question, options, correctAnswerIndex, explanation, reinforcementMessage, isLevelAssessment, createdAt)
   VALUES (7, 25, NULL, ?, ?, 2, ?, ?, true, NOW())`,
  [
    'A project manager is preparing for the PMP exam and needs to demonstrate understanding of the PMI Code of Ethics. A team member asks you to approve a timesheet that includes hours not actually worked, saying "everyone does it." What is the most appropriate response?',
    JSON.stringify([
      'Approve the timesheet to maintain team morale and avoid conflict',
      'Report the team member to HR immediately without discussing it with them first',
      'Decline to approve the timesheet and explain that falsifying records violates professional ethics and company policy',
      'Approve the timesheet this once but document it as a warning'
    ]),
    'The PMI Code of Ethics requires project managers to act with honesty and integrity. Approving falsified timesheets — even under social pressure — violates this code and exposes both you and the organisation to legal and reputational risk. The correct action is to decline and explain why, giving the team member the opportunity to correct the record.',
    'Excellent — you\'re thinking like a PM!'
  ]
);

console.log('✓ Inserted Level 7 Q2 assessment question');

const [check] = await conn.execute(
  'SELECT COUNT(*) as count FROM knowledgeChecks WHERE levelId = 7 AND isLevelAssessment = true'
);
console.log('Level 7 assessment questions:', check[0].count);

await conn.end();

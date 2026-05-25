/**
 * shuffle_assessment.mjs
 * Checks the option-A bias in level assessment questions and shuffles them.
 */
import mysql from "mysql2/promise";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function run() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  // Check current distribution
  const [dist] = await conn.query(
    "SELECT correctAnswerIndex, COUNT(*) as count FROM knowledgeChecks WHERE isLevelAssessment = 1 GROUP BY correctAnswerIndex ORDER BY correctAnswerIndex"
  );
  console.log("Current level assessment answer distribution:");
  dist.forEach((r) => console.log(`  Index ${r.correctAnswerIndex}: ${r.count} questions`));

  const [total] = await conn.query(
    "SELECT COUNT(*) as total FROM knowledgeChecks WHERE isLevelAssessment = 1"
  );
  console.log(`Total level assessment questions: ${total[0].total}`);

  // Fetch all assessment questions
  const [rows] = await conn.query(
    "SELECT id, options, correctAnswerIndex FROM knowledgeChecks WHERE isLevelAssessment = 1"
  );

  console.log(`\nShuffling ${rows.length} questions...`);
  let updated = 0;

  for (const row of rows) {
    let opts;
    try {
      opts = typeof row.options === "string" ? JSON.parse(row.options) : row.options;
    } catch {
      console.warn(`  Skipping id=${row.id}: cannot parse options`);
      continue;
    }
    if (!Array.isArray(opts) || opts.length < 2) continue;

    const correctText = opts[row.correctAnswerIndex];
    if (correctText === undefined) continue;

    // Two-pass shuffle for better distribution
    let shuffled = shuffle(opts);
    // If still at same index, shuffle again
    if (shuffled.indexOf(correctText) === row.correctAnswerIndex) {
      shuffled = shuffle(opts);
    }
    const newCorrectIndex = shuffled.indexOf(correctText);

    await conn.query(
      "UPDATE knowledgeChecks SET options = ?, correctAnswerIndex = ? WHERE id = ?",
      [JSON.stringify(shuffled), newCorrectIndex, row.id]
    );
    updated++;
  }

  console.log(`Updated: ${updated}`);

  // Verify new distribution
  const [newDist] = await conn.query(
    "SELECT correctAnswerIndex, COUNT(*) as count FROM knowledgeChecks WHERE isLevelAssessment = 1 GROUP BY correctAnswerIndex ORDER BY correctAnswerIndex"
  );
  console.log("\nNew level assessment answer distribution:");
  newDist.forEach((r) => console.log(`  Index ${r.correctAnswerIndex}: ${r.count} questions`));

  await conn.end();
}

run().catch((err) => { console.error(err); process.exit(1); });

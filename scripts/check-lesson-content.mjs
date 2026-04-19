import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Check lesson 6B (lessonNumber 12 in Level 1 — the 12th of 24 micro-lessons)
const [rows] = await conn.execute(
  `SELECT id, title, lessonNumber, LEFT(content, 500) as content_preview FROM lessons WHERE levelId = 1 ORDER BY lessonNumber LIMIT 24`
);

console.log('\n=== Level 1 Lessons — Content Preview ===\n');
for (const row of rows) {
  const hasHashes = row.content_preview?.includes('#');
  const hasAsterisks = row.content_preview?.includes('**') || row.content_preview?.includes('*');
  const flag = (hasHashes || hasAsterisks) ? ' ⚠️  MARKDOWN' : ' ✅ clean';
  console.log(`Lesson ${row.lessonNumber} (ID ${row.id}): ${row.title}${flag}`);
  if (hasHashes || hasAsterisks) {
    console.log(`  Preview: ${row.content_preview?.substring(0, 150)}`);
  }
}

// Also sample a few lessons from other levels
const [otherRows] = await conn.execute(
  `SELECT id, title, lessonNumber, levelId, LEFT(content, 300) as content_preview FROM lessons WHERE levelId != 1 ORDER BY levelId, lessonNumber LIMIT 30`
);

console.log('\n=== Other Levels — Markdown Check ===\n');
for (const row of otherRows) {
  const hasHashes = row.content_preview?.includes('#');
  const hasAsterisks = row.content_preview?.includes('**') || row.content_preview?.includes('*');
  if (hasHashes || hasAsterisks) {
    console.log(`Level ${row.levelId} Lesson ${row.lessonNumber} (ID ${row.id}): ${row.title} ⚠️  MARKDOWN`);
    console.log(`  Preview: ${row.content_preview?.substring(0, 150)}`);
  }
}

await conn.end();

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute(
  'SELECT id, levelId, lessonNumber, title, content FROM lessons ORDER BY levelId, lessonNumber'
);

fs.mkdirSync('/home/ubuntu/micro_lessons', { recursive: true });
for (const lesson of rows) {
  fs.writeFileSync(
    `/home/ubuntu/micro_lessons/lesson_${lesson.id}.json`,
    JSON.stringify(lesson, null, 2)
  );
}

console.log(`Exported ${rows.length} micro-lessons`);
console.log('Level counts:');
const byCounts = {};
for (const r of rows) byCounts[r.levelId] = (byCounts[r.levelId] || 0) + 1;
console.table(byCounts);

await conn.end();

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get all lessons with IDs that weren't covered (30001+, 60001+, 90001+, and 7, 13)
const [rows] = await conn.execute(
  'SELECT id, levelId, lessonNumber, title, content FROM lessons WHERE id >= 7 ORDER BY levelId, lessonNumber'
);

fs.mkdirSync('/home/ubuntu/lessons_missing', { recursive: true });

let count = 0;
for (const lesson of rows) {
  const path = `/home/ubuntu/lessons_missing/lesson_${lesson.id}.json`;
  fs.writeFileSync(path, JSON.stringify(lesson, null, 2));
  count++;
}

console.log(`Exported ${count} lessons to /home/ubuntu/lessons_missing/`);
console.log('IDs:', rows.map(r => r.id).join(', '));

await conn.end();

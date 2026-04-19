import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [levels] = await conn.execute('SELECT id, title, description FROM levels ORDER BY id');

fs.mkdirSync('/home/ubuntu/level_summaries', { recursive: true });

for (const level of levels) {
  const [lessons] = await conn.execute(
    'SELECT lessonNumber, title FROM lessons WHERE levelId = ? ORDER BY lessonNumber',
    [level.id]
  );
  const summary = {
    levelId: level.id,
    levelTitle: level.title,
    levelDescription: level.description,
    lessons: lessons.map(l => ({ lessonNumber: l.lessonNumber, title: l.title }))
  };
  fs.writeFileSync(`/home/ubuntu/level_summaries/level_${level.id}.json`, JSON.stringify(summary, null, 2));
  console.log(`Level ${level.id}: ${level.title} — ${lessons.length} lessons`);
}

await conn.end();

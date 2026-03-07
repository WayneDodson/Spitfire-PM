import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Check all lesson counts
console.log('=== LESSON COUNTS ===');
for (let levelId = 1; levelId <= 7; levelId++) {
  const [result] = await connection.query('SELECT COUNT(*) as count FROM lessons WHERE levelId = ?', [levelId]);
  console.log(`Level ${levelId}: ${result[0].count} lessons`);
}

// Check knowledge checks
console.log('\n=== KNOWLEDGE CHECK COUNTS ===');
for (let levelId = 1; levelId <= 7; levelId++) {
  const [result] = await connection.query('SELECT COUNT(*) as count FROM knowledgeChecks WHERE levelId = ?', [levelId]);
  console.log(`Level ${levelId}: ${result[0].count} knowledge checks`);
}

// Check levels table
console.log('\n=== LEVELS TABLE ===');
const [levels] = await connection.query('SELECT id, title, accessType FROM levels ORDER BY id');
console.log(levels);

// Check achievements
console.log('\n=== ACHIEVEMENTS COUNT ===');
const [achCount] = await connection.query('SELECT COUNT(*) as count FROM achievements');
console.log(`Total achievements: ${achCount[0].count}`);

// Sample lesson content from Level 1, Lesson 1
console.log('\n=== SAMPLE LESSON CONTENT (L1, Lesson 1) ===');
const [lesson] = await connection.query('SELECT title, LEFT(content, 500) as content_preview FROM lessons WHERE levelId = 1 AND lessonNumber = 1');
if (lesson[0]) {
  console.log('Title:', lesson[0].title);
  console.log('Content preview:', lesson[0].content_preview);
}

await connection.end();

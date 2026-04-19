import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [levels] = await conn.execute("SELECT id, title, orderIndex FROM levels ORDER BY orderIndex");
const [lessons] = await conn.execute("SELECT levelId, COUNT(*) as count FROM lessons GROUP BY levelId ORDER BY levelId");
const [checks] = await conn.execute("SELECT levelId, COUNT(*) as count FROM knowledgeChecks GROUP BY levelId ORDER BY levelId");
const [sampleLessons] = await conn.execute("SELECT id, levelId, lessonNumber, title, estimatedMinutes FROM lessons WHERE levelId = 1 ORDER BY lessonNumber");

console.log("\n=== LEVELS ===");
console.table(levels);
console.log("\n=== LESSONS per level ===");
console.table(lessons);
console.log("\n=== KNOWLEDGE CHECKS per level ===");
console.table(checks);
console.log("\n=== Level 1 lessons ===");
console.table(sampleLessons);

await conn.end();

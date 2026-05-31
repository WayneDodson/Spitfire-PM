import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

const rows = await conn.execute('SELECT id, title, accessType FROM levels ORDER BY id');
console.log(JSON.stringify(rows[0], null, 2));
await conn.end();

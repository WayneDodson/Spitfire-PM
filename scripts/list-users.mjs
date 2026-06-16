import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

const [rows] = await conn.execute("SELECT id, name, email, role FROM users ORDER BY id");
console.table(rows);
await conn.end();

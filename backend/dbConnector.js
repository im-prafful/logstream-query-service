import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Client } = pg;

async function testConnection() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }//“Use SSL but trust ANY certificate blindly.”
  });

  try {
    console.log("⏳ Connecting to PostgreSQL...");
    await client.connect();
    console.log("✅ Connected!");

  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  } finally {
    await client.end();
    console.log("🔌 Connection closed.");
  }
}

testConnection();

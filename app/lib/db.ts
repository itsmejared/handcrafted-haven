import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 4,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 15000,
});

pool.once("connect", () => {
  console.log("🐘 Connection Pool is ready!");
});

pool.on("error", (err) => {
  console.error("CRITICAL: Unexpected error on idle PostgreSQL pool:", err);
});

export const getDb = (): Pool => pool;

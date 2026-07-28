import { Pool } from "pg";

// Connection pool is saved in global scope
let _pool: Pool | null = null;

export const initDb = () => {
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10, // Max simultaneous connections per function
      idleTimeoutMillis: 15000, // Close inactive connections
      connectionTimeoutMillis: 15000, // 15 seconds to allow for serverless/Neon database cold starts
    });
    console.log("🐘 Connection Pool is ready!");
  }
  return _pool;
};

export const getDb = () => {
  if (!_pool) {
    return initDb();
  }
  return _pool;
};

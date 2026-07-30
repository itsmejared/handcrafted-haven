import { Pool } from "pg";

// Save connection pool in global scope across hot reloads in Next.js development
declare global {
  var _postgresPool: Pool | undefined;
}

export const initDb = () => {
  if (!globalThis._postgresPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is missing.");
    }

    const pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 15000,
      connectionTimeoutMillis: 15000,
    });

    // Handle idle connection errors gracefully without crashing the Node process
    pool.on("error", (err) => {
      console.error("Unexpected error on idle PostgreSQL connection pool:", err);
      // Clear cached pool so subsequent requests recreate a fresh pool
      globalThis._postgresPool = undefined;
    });

    globalThis._postgresPool = pool;
    console.log("🐘 Connection Pool is ready!");
  }
  return globalThis._postgresPool;
};

export const getDb = () => {
  return initDb();
};

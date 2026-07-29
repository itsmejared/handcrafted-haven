const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "../.env");
let databaseUrl = "";

try {
  const envContent = fs.readFileSync(envPath, "utf8");
  const match = envContent.match(/^DATABASE_URL=(.+)$/m);
  if (match) {
    databaseUrl = match[1].trim();
  }
} catch (e) {
  console.error("Could not read .env file:", e);
}

if (!databaseUrl) {
  console.error("DATABASE_URL not found in .env");
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 30000,
});

async function main() {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT name, email FROM users WHERE role = 'seller' ORDER BY name`
    );
    console.log(`Found ${res.rows.length} seller(s) in the database:\n`);
    res.rows.forEach((row) => console.log(`- ${row.name} (${row.email})`));
  } catch (error) {
    console.error("Query failed:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

main();

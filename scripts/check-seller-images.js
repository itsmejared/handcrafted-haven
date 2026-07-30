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

const pool = new Pool({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 30000,
});

async function main() {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT name, profile_image_url FROM users WHERE role = 'seller' ORDER BY name`
    );
    res.rows.forEach((row) => {
      console.log(`${row.name} -> ${row.profile_image_url}`);
    });
  } catch (error) {
    console.error("Query failed:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

main();

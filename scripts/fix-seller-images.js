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

const corrections = [
  { email: "info@clayandco.com", correctImage: "/Catherine Lewis - Pottery artist.webp" },
  { email: "hello@knotteddreams.com", correctImage: "/McKenna Craig - Macrame artist.webp" },
  { email: "design@colorflow.com", correctImage: "/Heather Bradford - scarf artist.webp" },
  { email: "care@purebotanicals.com", correctImage: "/Jennifer Lyons - soap artist.webp" },
  { email: "gallery@artisanbrush.com", correctImage: "/Sean Johnson - painter.webp" },
  { email: "music@stringsthings.com", correctImage: "/Josh Sears - Guitar artist.webp" },
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const fix of corrections) {
      const res = await client.query(
        `UPDATE users SET profile_image_url = $1 WHERE email = $2 RETURNING name, profile_image_url`,
        [fix.correctImage, fix.email]
      );

      if (res.rows.length === 0) {
        console.log(`No seller found with email ${fix.email}`);
      } else {
        console.log(`Updated ${res.rows[0].name} -> ${res.rows[0].profile_image_url}`);
      }
    }

    await client.query("COMMIT");
    console.log("Done. All 6 profile images corrected.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

main();

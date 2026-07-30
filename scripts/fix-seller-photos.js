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

// Map each seeded business-name seller to their real portrait photo
const photoUpdates = [
  { name: "Clay & Co", profile_image_url: "/Catherine Lewis - Pottery artist.webp" },
  { name: "Knotted Dreams", profile_image_url: "/McKenna Craig - Macrame artist.webp" },
  { name: "Color Flow Studio", profile_image_url: "/Heather Bradford - scarf artist.webp" },
  { name: "Strings & Things", profile_image_url: "/Josh Sears - Guitar artist.webp" },
  { name: "Pure Botanicals", profile_image_url: "/Jennifer Lyons - soap artist.webp" },
  { name: "Artisan Brush Co", profile_image_url: "/Sean Johnson - painter.webp" },
];

async function main() {
  const client = await pool.connect();
  try {
    console.log("Connected to database.\n");

    // Update seller photos
    for (const seller of photoUpdates) {
      const res = await client.query(
        `UPDATE users SET profile_image_url = $1 WHERE name = $2 AND role = 'seller' RETURNING id, name`,
        [seller.profile_image_url, seller.name],
      );
      if (res.rows.length > 0) {
        console.log(`✅ Updated photo for: ${seller.name}`);
      } else {
        console.log(`⚠️  No matching seller found for: ${seller.name}`);
      }
    }

    console.log("\nLooking for test account 'practice name'...");
    const checkRes = await client.query(
      `SELECT id, email, name, role FROM users WHERE name = 'practice name'`,
    );

    if (checkRes.rows.length === 0) {
      console.log("No account found with name 'practice name'. Nothing to delete.");
    } else {
      console.log("Found:", checkRes.rows);
      const deleteRes = await client.query(
        `DELETE FROM users WHERE name = 'practice name' RETURNING id, name`,
      );
      console.log(`🗑️  Deleted ${deleteRes.rows.length} account(s) named 'practice name'.`);
    }

    console.log("\n🎉 Done!");
  } catch (error) {
    console.error("❌ Script failed:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

main();

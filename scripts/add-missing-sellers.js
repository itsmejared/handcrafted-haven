const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

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

const missingSellers = [
  {
    name: "Katrina Burrup — Silver Linings",
    email: "kb@nextmail.com",
    bio: "Katrina designs custom jewelry combining sterling silver with hand-fused glass accents, creating pieces that catch the light in unexpected ways. Each item is shaped and finished by hand, blending traditional silversmithing with a modern, artistic touch.",
    profile_image_url: "/Katrina Burrup - jewelry artist.webp",
  },
  {
    name: "Jilly Michaels — Edge Clothing",
    email: "hello@jillymichaels.com",
    bio: "Jilly designs one-of-a-kind clothing pieces, blending sustainable fabrics with bold, wearable silhouettes. Each garment is cut and sewn by hand, made to feel as good as it looks.",
    profile_image_url: "/Jilly Michaels - clothing designer.webp",
  },
  {
    name: "Nick Fuentas — Weathered and Wood",
    email: "hello@weatheredandwood.com",
    bio: "Nick handcrafts custom furniture from reclaimed and solid wood, built to be lived with and passed down. Alongside his furniture, he curates a rotating collection of vintage art and collectibles, sourced piece by piece for their character and story.",
    profile_image_url: "/Nick Fuentas - artisan.webp",
  },
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const seller of missingSellers) {
      const existing = await client.query(
        `SELECT id FROM users WHERE email = $1`,
        [seller.email]
      );

      if (existing.rows.length > 0) {
        console.log(`Skipping ${seller.name} — already exists (${seller.email})`);
        continue;
      }

      const passwordHash = crypto
        .createHash("sha256")
        .update("password123")
        .digest("hex");

      const res = await client.query(
        `INSERT INTO users (email, password_hash, role, name, bio, profile_image_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [seller.email, passwordHash, "seller", seller.name, seller.bio, seller.profile_image_url]
      );

      console.log(`Inserted seller: ${seller.name} (${res.rows[0].id})`);
    }

    await client.query("COMMIT");
    console.log("Done. Existing data was not touched.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

main();

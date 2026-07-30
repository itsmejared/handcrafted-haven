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
  {
    email: "info@clayandco.com",
    bio: "Catherine throws and glazes custom pottery bowls on her wheel, drawing inspiration from natural textures and colors. Each piece is functional art meant to be used and loved every day.",
  },
  {
    email: "hello@knotteddreams.com",
    bio: "McKenna designs and knots custom macrame wall art, combining classic technique with modern, minimalist shapes. Each piece is made to order and sized to fit any space.",
  },
  {
    email: "design@colorflow.com",
    bio: "Heather hand-dyes scarves using small-batch techniques that produce rich, one-of-a-kind color patterns. Every scarf is a wearable piece of art.",
  },
  {
    email: "care@purebotanicals.com",
    bio: "Jennifer creates custom lavender soap gift sets, bath bombs, and shower bombs using natural ingredients and small-batch methods. Her products are designed to turn everyday self-care into a little luxury.",
  },
  {
    email: "gallery@artisanbrush.com",
    bio: "Sean paints original watercolor pieces inspired by landscapes and quiet moments. His work captures light and movement with a loose, expressive style.",
  },
  {
    email: "music@stringsthings.com",
    bio: "Josh hand-builds custom electric and acoustic guitars, blending traditional woodworking techniques with a passion for tone and playability. Every instrument is one of a kind, built to match the player's style.",
  },
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const fix of corrections) {
      const res = await client.query(
        `UPDATE users SET bio = $1 WHERE email = $2 RETURNING name, bio`,
        [fix.bio, fix.email]
      );

      if (res.rows.length === 0) {
        console.log(`No seller found with email ${fix.email}`);
      } else {
        console.log(`Updated ${res.rows[0].name}`);
      }
    }

    await client.query("COMMIT");
    console.log("Done. All 6 bios restored.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

main();

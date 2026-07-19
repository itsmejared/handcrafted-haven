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
  connectionTimeoutMillis: 30000, // 30 seconds to allow for new DB cold starts
});

const sellers = [
  { name: "Clay & Co", email: "info@clayandco.com", bio: "Artisanal ceramics and functional pottery handmade with love.", profile_image_url: "/Ceramic Bowls.webp" },
  { name: "Knotted Dreams", email: "hello@knotteddreams.com", bio: "Beautiful modern macrame wall hangings and fiber art.", profile_image_url: "/Macrame Wall Art.webp" },
  { name: "Color Flow Studio", email: "design@colorflow.com", bio: "Vibrant hand-dyed scarves, clothing, and silk accessories.", profile_image_url: "/Hand died Scarf.webp" },
  { name: "Strings & Things", email: "music@stringsthings.com", bio: "Custom handcrafted musical instruments and guitars built to last.", profile_image_url: "/Custom Guitar.webp" },
  { name: "Pure Botanicals", email: "care@purebotanicals.com", bio: "Natural soaps, bath bombs, and organic skincare products.", profile_image_url: "/Lavendar soap set.webp" },
  { name: "Artisan Brush Co", email: "gallery@artisanbrush.com", bio: "Original landscape and abstract watercolor prints.", profile_image_url: "/Watercolor art.webp" },
];

const categories = [
  { name: "Jewelry", image_url: "/jewelry.webp", image_alt: "Colorful gemstone pendant necklaces displayed against a woven backdrop", description: "Handcrafted rings, necklaces, and bracelets" },
  { name: "Home Decor", image_url: "/home decor.webp", image_alt: "Cozy living room with a blue accent wall, sofa, and warm lighting", description: "Unique pieces to beautify your space" },
  { name: "Clothing", image_url: "/clothing.webp", image_alt: "Rack of blue clothing items hanging in a boutique", description: "One-of-a-kind wearable art" },
  { name: "Music & Instruments", image_url: "/musical instrument.webp", image_alt: "Close-up of a vintage sunburst electric guitar", description: "Custom handcrafted guitars, ukuleles, and more" },
  { name: "Bath & Beauty", image_url: "/Bath and Beauty.webp", image_alt: "Bundles of lavender beside handmade soap bars", description: "Handmade soaps, lotions, and natural skincare" },
  { name: "Art & Collectibles", image_url: "/Art and Collectables.webp", image_alt: "Shelves filled with vintage collectibles and framed art", description: "Original artwork and unique collectible pieces" },
];

const products = [
  { title: "Ceramic Bowl Set", price: 45.00, sellerName: "Clay & Co", image_url: "/Ceramic Bowls.webp", image_alt: "Colorful hand-painted ceramic bowls stacked together", categoryName: "Home Decor", description: "A gorgeous set of three nesting ceramic bowls, hand-glazed and painted with vibrant patterns." },
  { title: "Macrame Wall Art", price: 78.00, sellerName: "Knotted Dreams", image_url: "/Macrame Wall Art.webp", image_alt: "Macrame wall hanging with feather-shaped woven pieces on a wooden dowel", categoryName: "Home Decor", description: "This intricately hand-knotted macrame wall hanging brings a warm, cozy bohemian vibe to any room." },
  { title: "Hand-dyed Scarf", price: 52.00, sellerName: "Color Flow Studio", image_url: "/Hand died Scarf.webp", image_alt: "Woman wearing a flowing red hand-dyed scarf outdoors", categoryName: "Clothing", description: "A lightweight, luxurious silk scarf individually dyed by hand with rich natural pigments." },
  { title: "Custom Guitar", price: 299.00, sellerName: "Strings & Things", image_url: "/Custom Guitar.webp", image_alt: "Musician playing an acoustic guitar outdoors", categoryName: "Music & Instruments", description: "Meticulously crafted acoustic guitar made from fine tonewoods, offering rich tone and excellent playability." },
  { title: "Lavender Soap Set", price: 24.00, sellerName: "Pure Botanicals", image_url: "/Lavendar soap set.webp", image_alt: "Gift-wrapped handmade soap bars tied with ribbon and lavender sprigs", categoryName: "Bath & Beauty", description: "A set of four organic lavender essential oil soap bars, gentle on the skin and highly aromatic." },
  { title: "Watercolor Print", price: 65.00, sellerName: "Artisan Brush Co", image_url: "/Watercolor art.webp", image_alt: "Abstract blue and teal watercolor painting", categoryName: "Art & Collectibles", description: "High-quality giclee print of an original abstract watercolor exploration of deep ocean tones." },
];

async function main() {
  const client = await pool.connect();
  try {
    console.log("Connected to database. Setting up database schema...");

    // Begin transaction
    await client.query("BEGIN");

    // Clean up existing tables
    console.log("Dropping existing tables...");
    await client.query(`
      DROP TABLE IF EXISTS reviews CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    // Create Tables
    console.log("Creating tables...");
    
    // Users table
    await client.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('customer', 'seller')),
        name VARCHAR(255) NOT NULL,
        bio TEXT,
        profile_image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Categories table
    await client.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        image_url TEXT NOT NULL,
        image_alt TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Products table
    await client.query(`
      CREATE TABLE products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image_url TEXT NOT NULL,
        image_alt TEXT NOT NULL,
        seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Reviews table
    await client.query(`
      CREATE TABLE reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Schema created successfully! Seeding data...");

    // Insert Sellers
    const sellerIds = {};
    for (const seller of sellers) {
      const passwordHash = crypto.createHash("sha256").update("password123").digest("hex");
      const res = await client.query(
        `INSERT INTO users (email, password_hash, role, name, bio, profile_image_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [seller.email, passwordHash, "seller", seller.name, seller.bio, seller.profile_image_url]
      );
      sellerIds[seller.name] = res.rows[0].id;
      console.log(`Inserted seller: ${seller.name} (${res.rows[0].id})`);
    }

    // Insert Categories
    const categoryIds = {};
    for (const category of categories) {
      const res = await client.query(
        `INSERT INTO categories (name, image_url, image_alt, description)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [category.name, category.image_url, category.image_alt, category.description]
      );
      categoryIds[category.name] = res.rows[0].id;
      console.log(`Inserted category: ${category.name} (${res.rows[0].id})`);
    }

    // Insert Products
    for (const prod of products) {
      const sellerId = sellerIds[prod.sellerName];
      const categoryId = categoryIds[prod.categoryName];

      if (!sellerId) {
        throw new Error(`Seller ID not found for ${prod.sellerName}`);
      }
      if (!categoryId) {
        throw new Error(`Category ID not found for ${prod.categoryName}`);
      }

      await client.query(
        `INSERT INTO products (title, description, price, image_url, image_alt, seller_id, category_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [prod.title, prod.description, prod.price, prod.image_url, prod.image_alt, sellerId, categoryId]
      );
      console.log(`Inserted product: ${prod.title}`);
    }

    // Commit Transaction
    await client.query("COMMIT");
    console.log("🎉 Database seeding completed successfully!");

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Seeding failed:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

main();

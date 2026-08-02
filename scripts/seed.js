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

// Test customer account used for local dev / manual login testing.
// NOTE: plaintext password here is only ok because this is a seed script
// for local/dev data, never for production.
const customers = [
  { name: "Test User", email: "user@nextmail.com", password: "123456" },
];

const sellers = [
  { name: "Catherine Lewis — Clay & Co", email: "info@clayandco.com", bio: "Catherine throws and glazes custom pottery bowls on her wheel, drawing inspiration from natural textures and colors. Each piece is functional art meant to be used and loved every day.", profile_image_url: "/users/Catherine Lewis - Pottery artist.webp" },
  { name: "McKenna Craig — Knotted Dreams", email: "hello@knotteddreams.com", bio: "McKenna designs and knots custom macrame wall art, combining classic technique with modern, minimalist shapes. Each piece is made to order and sized to fit any space.", profile_image_url: "/users/McKenna Craig - Macrame artist.webp" },
  { name: "Heather Bradford — Color Flow Studio", email: "design@colorflow.com", bio: "Heather hand-dyes scarves using small-batch techniques that produce rich, one-of-a-kind color patterns. Every scarf is a wearable piece of art.", profile_image_url: "/users/Heather Bradford - scarf artist.webp" },
  { name: "Josh Sears — Strings & Things", email: "music@stringsthings.com", bio: "Josh hand-builds custom electric and acoustic guitars, blending traditional woodworking techniques with a passion for tone and playability. Every instrument is one of a kind, built to match the player's style.", profile_image_url: "/users/Josh Sears - Guitar artist.webp" },
  { name: "Jennifer Lyons — Pure Botanicals", email: "care@purebotanicals.com", bio: "Jennifer creates custom lavender soap gift sets, bath bombs, and shower bombs using natural ingredients and small-batch methods. Her products are designed to turn everyday self-care into a little luxury.", profile_image_url: "/users/Jennifer Lyons - soap artist.webp" },
  { name: "Sean Johnson — Artisan Brush Co", email: "gallery@artisanbrush.com", bio: "Sean paints original watercolor pieces inspired by landscapes and quiet moments. His work captures light and movement with a loose, expressive style.", profile_image_url: "/users/Sean Johnson - painter.webp" },
  { name: "Katrina Burrup — Silver Linings", email: "kb@nextmail.com", bio: "Katrina designs custom jewelry combining sterling silver with hand-fused glass accents, creating pieces that catch the light in unexpected ways. Each item is shaped and finished by hand, blending traditional silversmithing with a modern, artistic touch.", profile_image_url: "/users/Katrina Burrup - jewelry artist.webp" },
  { name: "Jilly Michaels — Edge Clothing", email: "hello@jillymichaels.com", bio: "Jilly designs one-of-a-kind clothing pieces, blending sustainable fabrics with bold, wearable silhouettes. Each garment is cut and sewn by hand, made to feel as good as it looks.", profile_image_url: "/users/Jilly Michaels - clothing designer.webp" },
  { name: "Nick Fuentas — Weathered and Wood", email: "hello@weatheredandwood.com", bio: "Nick handcrafts custom furniture from reclaimed and solid wood, built to be lived with and passed down. Alongside his furniture, he curates a rotating collection of vintage art and collectibles, sourced piece by piece for their character and story.", profile_image_url: "/users/Nick Fuentas - artisan.webp" },
];

const categories = [
  { name: "Jewelry", image_url: "/category-thumbnails/jewelry.webp", image_alt: "Colorful gemstone pendant necklaces displayed against a woven backdrop", description: "Handcrafted rings, necklaces, and bracelets" },
  { name: "Home Decor", image_url: "/category-thumbnails/home decor.webp", image_alt: "Cozy living room with a blue accent wall, sofa, and warm lighting", description: "Unique pieces to beautify your space" },
  { name: "Clothing", image_url: "/category-thumbnails/clothing.webp", image_alt: "Rack of blue clothing items hanging in a boutique", description: "One-of-a-kind wearable art" },
  { name: "Music & Instruments", image_url: "/category-thumbnails/musical instrument.webp", image_alt: "Close-up of a vintage sunburst electric guitar", description: "Custom handcrafted guitars, ukuleles, and more" },
  { name: "Bath & Beauty", image_url: "/category-thumbnails/Bath and Beauty.webp", image_alt: "Bundles of lavender beside handmade soap bars", description: "Handmade soaps, lotions, and natural skincare" },
  { name: "Art & Collectibles", image_url: "/category-thumbnails/Art and Collectables.webp", image_alt: "Shelves filled with vintage collectibles and framed art", description: "Original artwork and unique collectible pieces" },
];

const products = [
  { title: "Ceramic Bowl Set", price: 45.00, sellerName: "Catherine Lewis — Clay & Co", image_url: "/products/Ceramic Bowls.webp", image_alt: "Colorful hand-painted ceramic bowls stacked together", categoryName: "Home Decor", description: "A gorgeous set of three nesting ceramic bowls, hand-glazed and painted with vibrant patterns." },
  { title: "Macrame Wall Art", price: 78.00, sellerName: "McKenna Craig — Knotted Dreams", image_url: "/products/Macrame Wall Art.webp", image_alt: "Macrame wall hanging with feather-shaped woven pieces on a wooden dowel", categoryName: "Home Decor", description: "This intricately hand-knotted macrame wall hanging brings a warm, cozy bohemian vibe to any room." },
  { title: "Hand-dyed Scarf", price: 52.00, sellerName: "Heather Bradford — Color Flow Studio", image_url: "/products/Hand died Scarf.webp", image_alt: "Woman wearing a flowing red hand-dyed scarf outdoors", categoryName: "Clothing", description: "A lightweight, luxurious silk scarf individually dyed by hand with rich natural pigments." },
  { title: "Custom Guitar", price: 299.00, sellerName: "Josh Sears — Strings & Things", image_url: "/products/Custom Guitar.webp", image_alt: "Musician playing an acoustic guitar outdoors", categoryName: "Music & Instruments", description: "Meticulously crafted acoustic guitar made from fine tonewoods, offering rich tone and excellent playability." },
  { title: "Lavender Soap Set", price: 24.00, sellerName: "Jennifer Lyons — Pure Botanicals", image_url: "/products/Lavendar soap set.webp", image_alt: "Gift-wrapped handmade soap bars tied with ribbon and lavender sprigs", categoryName: "Bath & Beauty", description: "A set of four organic lavender essential oil soap bars, gentle on the skin and highly aromatic." },
  { title: "Watercolor Print", price: 65.00, sellerName: "Sean Johnson — Artisan Brush Co", image_url: "/products/Watercolor art.webp", image_alt: "Abstract blue and teal watercolor painting", categoryName: "Art & Collectibles", description: "High-quality giclee print of an original abstract watercolor exploration of deep ocean tones." },

  { title: "Abstract Heart Painting", price: 89.00, sellerName: "Sean Johnson — Artisan Brush Co", image_url: "/products/abstract-heart-painting.webp", image_alt: "Abstract painting of a heart in warm tones", categoryName: "Art & Collectibles", description: "A bold abstract acrylic piece exploring warmth and emotion through layered brushstrokes." },
  { title: "Flower Painting", price: 75.00, sellerName: "Sean Johnson — Artisan Brush Co", image_url: "/products/flower-painting.webp", image_alt: "Painting of flowers in bloom", categoryName: "Art & Collectibles", description: "A vibrant floral study capturing texture and color in every petal." },
  { title: "Ocean Painting", price: 95.00, sellerName: "Sean Johnson — Artisan Brush Co", image_url: "/products/ocean-painting.webp", image_alt: "Painting of ocean waves", categoryName: "Art & Collectibles", description: "A sweeping seascape rendered in cool blues and whitecaps." },
  { title: "Pond Painting", price: 80.00, sellerName: "Sean Johnson — Artisan Brush Co", image_url: "/products/pond-painting.webp", image_alt: "Painting of a still pond", categoryName: "Art & Collectibles", description: "A quiet, reflective pond scene in soft natural tones." },
  { title: "Tropical Painting", price: 85.00, sellerName: "Sean Johnson — Artisan Brush Co", image_url: "/products/tropical-painting.webp", image_alt: "Tropical landscape painting", categoryName: "Art & Collectibles", description: "A lush tropical scene bursting with color and light." },

  { title: "Artisan Candle Holder", price: 28.00, sellerName: "Nick Fuentas — Weathered and Wood", image_url: "/products/artisan-candle.webp", image_alt: "Handmade wooden candle holder", categoryName: "Home Decor", description: "A hand-finished wooden candle holder, each piece uniquely grained." },
  { title: "Cutting Board", price: 42.00, sellerName: "Nick Fuentas — Weathered and Wood", image_url: "/products/cutting-board.webp", image_alt: "Handmade wooden cutting board", categoryName: "Home Decor", description: "A durable, food-safe hardwood cutting board, hand-sanded and oiled." },
  { title: "Leather Wallet", price: 55.00, sellerName: "Nick Fuentas — Weathered and Wood", image_url: "/products/leather-wallet.webp", image_alt: "Handmade leather wallet", categoryName: "Home Decor", description: "A slim, hand-stitched leather wallet built to age beautifully." },
  { title: "Woven Basket", price: 48.00, sellerName: "Nick Fuentas — Weathered and Wood", image_url: "/products/woven-basket.webp", image_alt: "Handwoven storage basket", categoryName: "Home Decor", description: "A sturdy handwoven basket, perfect for storage or display." },
  { title: "Wool Blanket", price: 68.00, sellerName: "Nick Fuentas — Weathered and Wood", image_url: "/products/wool-blanket.webp", image_alt: "Handwoven wool blanket", categoryName: "Home Decor", description: "A warm, thick wool blanket, handwoven for durability and comfort." },
  { title: "Accent Chair", price: 220.00, sellerName: "Nick Fuentas — Weathered and Wood", image_url: "/products/accent-chair.webp", image_alt: "Handcrafted wooden accent chair", categoryName: "Home Decor", description: "A solid wood accent chair, built by hand with clean, simple lines." },
  { title: "Handcrafted Cabinet", price: 340.00, sellerName: "Nick Fuentas — Weathered and Wood", image_url: "/products/cabinet.webp", image_alt: "Handmade wooden cabinet", categoryName: "Home Decor", description: "A custom wooden cabinet, hand-built and finished with care." },
  { title: "Coffee Table", price: 260.00, sellerName: "Nick Fuentas — Weathered and Wood", image_url: "/products/coffee-table.webp", image_alt: "Handmade wooden coffee table", categoryName: "Home Decor", description: "A sturdy handmade coffee table with a natural wood finish." },
  { title: "Vanity Mirror Set", price: 150.00, sellerName: "Nick Fuentas — Weathered and Wood", image_url: "/products/vanity-mirror-set.webp", image_alt: "Handcrafted wooden vanity mirror set", categoryName: "Home Decor", description: "A framed vanity mirror set, hand-built with a warm wood finish." },

  { title: "Amber Pendant", price: 38.00, sellerName: "Katrina Burrup — Silver Linings", image_url: "/products/amber-pendant.webp", image_alt: "Silver pendant with amber stone", categoryName: "Jewelry", description: "A warm amber stone set in hand-finished sterling silver." },
  { title: "Beaded Necklace", price: 32.00, sellerName: "Katrina Burrup — Silver Linings", image_url: "/products/beaded-necklace.webp", image_alt: "Handmade beaded necklace", categoryName: "Jewelry", description: "A hand-strung beaded necklace with a mix of natural stone colors." },
  { title: "Flower Agate Pendant", price: 40.00, sellerName: "Katrina Burrup — Silver Linings", image_url: "/products/flower-agate-pendant.webp", image_alt: "Silver pendant with flower agate stone", categoryName: "Jewelry", description: "A one-of-a-kind flower agate stone in a hand-finished silver setting." },
  { title: "Fluorite Pendant", price: 36.00, sellerName: "Katrina Burrup — Silver Linings", image_url: "/products/fluorite-pendant.webp", image_alt: "Silver pendant with fluorite stone", categoryName: "Jewelry", description: "A soft purple fluorite stone set in sterling silver." },
  { title: "Orange Agate Pendant", price: 36.00, sellerName: "Katrina Burrup — Silver Linings", image_url: "/products/orange-agate-pendant.webp", image_alt: "Silver pendant with orange agate stone", categoryName: "Jewelry", description: "A vibrant orange agate stone in a hand-finished silver setting." },
  { title: "Red Jasper Pendant", price: 34.00, sellerName: "Katrina Burrup — Silver Linings", image_url: "/products/red-jasper-pendant.webp", image_alt: "Silver pendant with red jasper stone", categoryName: "Jewelry", description: "An earthy red jasper stone set in sterling silver." },
  { title: "Redstone Pendant", price: 34.00, sellerName: "Katrina Burrup — Silver Linings", image_url: "/products/redstone-pendant.webp", image_alt: "Silver pendant with red stone", categoryName: "Jewelry", description: "A rich red stone in a hand-finished silver setting." },
  { title: "Seraphinite Pendant", price: 42.00, sellerName: "Katrina Burrup — Silver Linings", image_url: "/products/seraphinite-pendant.webp", image_alt: "Silver pendant with seraphinite stone", categoryName: "Jewelry", description: "A striking green seraphinite stone set in sterling silver." },
  { title: "Sodalite Pendant", price: 36.00, sellerName: "Katrina Burrup — Silver Linings", image_url: "/products/sodalite-pendant.webp", image_alt: "Silver pendant with sodalite stone", categoryName: "Jewelry", description: "A deep blue sodalite stone in a hand-finished silver setting." },
  { title: "Tiger's Eye Pendant", price: 34.00, sellerName: "Katrina Burrup — Silver Linings", image_url: "/products/tigers-eye-pendant.webp", image_alt: "Silver pendant with tiger's eye stone", categoryName: "Jewelry", description: "A golden-brown tiger's eye stone set in sterling silver." },
  { title: "White Coral Pendant", price: 38.00, sellerName: "Katrina Burrup — Silver Linings", image_url: "/products/white-coral-pendant.webp", image_alt: "Silver pendant with white coral stone", categoryName: "Jewelry", description: "A textured white coral stone in a hand-finished silver setting." },

  { title: "Cotton Shirt", price: 45.00, sellerName: "Jilly Michaels — Edge Clothing", image_url: "/products/cotton-shirt.webp", image_alt: "Handmade cotton shirt", categoryName: "Clothing", description: "A breathable, hand-sewn cotton shirt with a relaxed fit. Contact the seller for available sizes." },
  { title: "Denim Shorts", price: 38.00, sellerName: "Jilly Michaels — Edge Clothing", image_url: "/products/denim-shorts.webp", image_alt: "Handmade denim shorts", categoryName: "Clothing", description: "Durable, hand-finished denim shorts with a classic cut. Contact the seller for available sizes." },
  { title: "Flowy Skirt", price: 52.00, sellerName: "Jilly Michaels — Edge Clothing", image_url: "/products/flowy-skirt.webp", image_alt: "Handmade flowy skirt", categoryName: "Clothing", description: "A lightweight, flowy skirt hand-sewn for movement and comfort. Contact the seller for available sizes." },
  { title: "Knit Sweater", price: 68.00, sellerName: "Jilly Michaels — Edge Clothing", image_url: "/products/knit-sweater.webp", image_alt: "Handmade knit sweater", categoryName: "Clothing", description: "A cozy hand-knit sweater made from soft, durable yarn. Contact the seller for available sizes." },
  { title: "Denim Jeans", price: 58.00, sellerName: "Jilly Michaels — Edge Clothing", image_url: "/products/linen-pants.webp", image_alt: "Handmade denim jeans", categoryName: "Clothing", description: "Durable, hand-sewn denim jeans with a relaxed, tailored fit. Contact the seller for available sizes." },
  { title: "Sundress", price: 62.00, sellerName: "Jilly Michaels — Edge Clothing", image_url: "/products/sundress.webp", image_alt: "Handmade sundress", categoryName: "Clothing", description: "A light, hand-sewn sundress perfect for warm weather. Contact the seller for available sizes." },

  { title: "Macrame Bracelet", price: 18.00, sellerName: "McKenna Craig — Knotted Dreams", image_url: "/products/macrame-bracelet.webp", image_alt: "Handmade macrame bracelet", categoryName: "Home Decor", description: "A hand-knotted macrame bracelet, adjustable and durable." },
  { title: "Macrame Plant Hanger", price: 32.00, sellerName: "McKenna Craig — Knotted Dreams", image_url: "/products/macrame-plant-hanger.webp", image_alt: "Handmade macrame plant hanger", categoryName: "Home Decor", description: "A hand-knotted plant hanger, perfect for indoor greenery." },
  { title: "Macrame Dream Catcher", price: 36.00, sellerName: "McKenna Craig — Knotted Dreams", image_url: "/products/dream-catcher.webp", image_alt: "Handmade macrame dream catcher", categoryName: "Home Decor", description: "A hand-knotted dream catcher combining classic and modern macrame technique." },
  { title: "Macrame Feathers Wall Hanging", price: 58.00, sellerName: "McKenna Craig — Knotted Dreams", image_url: "/products/feathers-wall-hanging.webp", image_alt: "Macrame wall hanging with feather shapes", categoryName: "Home Decor", description: "A hand-knotted wall hanging with feather-shaped macrame pieces." },
  { title: "Macrame Santa Ornament", price: 15.00, sellerName: "McKenna Craig — Knotted Dreams", image_url: "/products/santa-ornament.webp", image_alt: "Handmade macrame santa ornament", categoryName: "Home Decor", description: "A festive hand-knotted holiday ornament." },

  { title: "Pottery Vase", price: 55.00, sellerName: "Catherine Lewis — Clay & Co", image_url: "/products/pottery-vase.webp", image_alt: "Hand-thrown pottery vase", categoryName: "Home Decor", description: "A hand-thrown ceramic vase, glazed with a unique natural finish." },
  { title: "Painted Vases", price: 48.00, sellerName: "Catherine Lewis — Clay & Co", image_url: "/products/painted-vases.webp", image_alt: "Hand-painted ceramic vases", categoryName: "Home Decor", description: "A set of hand-painted ceramic vases with vibrant patterns." },
  { title: "Pottery Set", price: 65.00, sellerName: "Catherine Lewis — Clay & Co", image_url: "/products/pottery-set.webp", image_alt: "Hand-thrown pottery set", categoryName: "Home Decor", description: "A coordinated set of hand-thrown pottery pieces." },
  { title: "White Jug", price: 40.00, sellerName: "Catherine Lewis — Clay & Co", image_url: "/products/white-jug.webp", image_alt: "Hand-thrown white ceramic jug", categoryName: "Home Decor", description: "A simple, hand-thrown white ceramic jug with a smooth glaze." },
  { title: "White Porcelain Teapot", price: 58.00, sellerName: "Catherine Lewis — Clay & Co", image_url: "/products/white-porcelain-teapot.webp", image_alt: "Hand-thrown white porcelain teapot", categoryName: "Home Decor", description: "An elegant hand-thrown porcelain teapot with a clean white glaze." },

  { title: "Scarf Collection", price: 48.00, sellerName: "Heather Bradford — Color Flow Studio", image_url: "/products/scarf-collection.webp", image_alt: "Collection of hand-dyed scarves", categoryName: "Clothing", description: "A curated collection of hand-dyed scarves in flowing, vibrant patterns." },
  { title: "Black and Grey Silk Scarf", price: 46.00, sellerName: "Heather Bradford — Color Flow Studio", image_url: "/products/black-grey-silk-scarf.webp", image_alt: "Hand-dyed black and grey silk scarf", categoryName: "Clothing", description: "A moody, hand-dyed silk scarf blending black and grey tones." },
  { title: "Green Silk Scarf", price: 46.00, sellerName: "Heather Bradford — Color Flow Studio", image_url: "/products/green-silk-scarf.webp", image_alt: "Hand-dyed green silk scarf", categoryName: "Clothing", description: "A rich, hand-dyed silk scarf in deep green tones." },
  { title: "Navy Blue Scarf", price: 46.00, sellerName: "Heather Bradford — Color Flow Studio", image_url: "/products/navy-blue-scarf.webp", image_alt: "Hand-dyed navy blue scarf", categoryName: "Clothing", description: "A classic hand-dyed scarf in deep navy blue." },
  { title: "Red Plaid Scarf", price: 48.00, sellerName: "Heather Bradford — Color Flow Studio", image_url: "/products/red-plaid-scarf.webp", image_alt: "Hand-dyed red plaid scarf", categoryName: "Clothing", description: "A cozy hand-dyed scarf in a warm red plaid pattern." },
  { title: "Red Silk Scarf", price: 46.00, sellerName: "Heather Bradford — Color Flow Studio", image_url: "/products/red-silk-scarf.webp", image_alt: "Hand-dyed red silk scarf", categoryName: "Clothing", description: "A vibrant hand-dyed silk scarf in bold red." },
  { title: "White Silk Scarf", price: 46.00, sellerName: "Heather Bradford — Color Flow Studio", image_url: "/products/white-silk-scarf.webp", image_alt: "Hand-dyed white silk scarf", categoryName: "Clothing", description: "A soft, hand-dyed silk scarf in clean white." },

  { title: "Soap Collection", price: 22.00, sellerName: "Jennifer Lyons — Pure Botanicals", image_url: "/products/soap-collection.webp", image_alt: "Collection of handmade soap bars", categoryName: "Bath & Beauty", description: "A curated set of small-batch, natural-ingredient soap bars." },
  { title: "Lavender Soap", price: 12.00, sellerName: "Jennifer Lyons — Pure Botanicals", image_url: "/products/lavender-soap.webp", image_alt: "Handmade lavender soap bar", categoryName: "Bath & Beauty", description: "A gentle lavender essential oil soap bar, made in small batches." },
  { title: "Mint Soap", price: 12.00, sellerName: "Jennifer Lyons — Pure Botanicals", image_url: "/products/mint-soap.webp", image_alt: "Handmade mint soap bar", categoryName: "Bath & Beauty", description: "A refreshing mint essential oil soap bar, made with natural ingredients." },
  { title: "Honey Chocolate Soap", price: 14.00, sellerName: "Jennifer Lyons — Pure Botanicals", image_url: "/products/honey-chocolate-soap.webp", image_alt: "Handmade honey chocolate soap bar", categoryName: "Bath & Beauty", description: "A rich honey and chocolate scented soap bar, gentle on skin." },
  { title: "Fabiolaba Soap", price: 13.00, sellerName: "Jennifer Lyons — Pure Botanicals", image_url: "/products/fabiolaba-soap.webp", image_alt: "Handmade specialty soap bar", categoryName: "Bath & Beauty", description: "A small-batch specialty soap bar made with natural ingredients." },

  { title: "Acoustic Guitar", price: 249.00, sellerName: "Josh Sears — Strings & Things", image_url: "/products/acoustic-guitar.webp", image_alt: "Handcrafted acoustic guitar", categoryName: "Music & Instruments", description: "A hand-built acoustic guitar with warm, balanced tone. Contact the seller for available colors." },
  { title: "Child-Size Guitar", price: 149.00, sellerName: "Josh Sears — Strings & Things", image_url: "/products/child-guitar.webp", image_alt: "Handcrafted child-size guitar", categoryName: "Music & Instruments", description: "A smaller-scale, hand-built guitar perfect for young beginners. Contact the seller for available colors." },
  { title: "Custom Electric Guitar", price: 329.00, sellerName: "Josh Sears — Strings & Things", image_url: "/products/custom-electric-guitar.webp", image_alt: "Handcrafted custom electric guitar", categoryName: "Music & Instruments", description: "A hand-built electric guitar with custom finish options. Contact the seller to choose your color." },
  { title: "Orange Electric Guitar", price: 299.00, sellerName: "Josh Sears — Strings & Things", image_url: "/products/orange-electric-guitar.webp", image_alt: "Handcrafted orange electric guitar", categoryName: "Music & Instruments", description: "A hand-built electric guitar finished in vibrant orange. Contact the seller for other color options." },
  { title: "White Electric Guitar", price: 299.00, sellerName: "Josh Sears — Strings & Things", image_url: "/products/white-electric-guitar.webp", image_alt: "Handcrafted white electric guitar", categoryName: "Music & Instruments", description: "A hand-built electric guitar finished in clean white. Contact the seller for other color options." },
];

async function main() {
  if (!process.argv.includes("--force")) {
    console.log("⚠️  SAFETY CHECK: This script will DROP ALL TABLES and delete");
    console.log("    every user, product, category, and review currently in the database.");
    console.log("    This includes any real accounts registered since the last seed.");
    console.log("");
    console.log("    If you're sure you want to do this, run:");
    console.log("    node scripts/seed.js --force");
    process.exit(0);
  }

  const client = await pool.connect();
  try {
    console.log("Connected to database. Setting up database schema...");

    await client.query("BEGIN");

    console.log("Dropping existing tables...");
    await client.query(`
      DROP TABLE IF EXISTS reviews CASCADE;
      DROP TABLE IF EXISTS product_images CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    console.log("Creating tables...");

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

    await client.query(`
      CREATE TABLE product_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        image_alt TEXT NOT NULL,
        display_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

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

    for (const customer of customers) {
      const passwordHash = crypto.createHash("sha256").update(customer.password).digest("hex");
      const res = await client.query(
        `INSERT INTO users (email, password_hash, role, name)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [customer.email, passwordHash, "customer", customer.name]
      );
      console.log(`Inserted customer: ${customer.email} (${res.rows[0].id})`);
    }

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

    for (const prod of products) {
      const sellerId = sellerIds[prod.sellerName];
      const categoryId = categoryIds[prod.categoryName];

      if (!sellerId) {
        throw new Error(`Seller ID not found for ${prod.sellerName}`);
      }
      if (!categoryId) {
        throw new Error(`Category ID not found for ${prod.categoryName}`);
      }

      const productRes = await client.query(
        `INSERT INTO products (title, description, price, image_url, image_alt, seller_id, category_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [prod.title, prod.description, prod.price, prod.image_url, prod.image_alt, sellerId, categoryId]
      );
      console.log(`Inserted product: ${prod.title}`);

      await client.query(
        `INSERT INTO product_images (product_id, image_url, image_alt, display_order)
         VALUES ($1, $2, $3, $4)`,
        [productRes.rows[0].id, prod.image_url, prod.image_alt, 0]
      );
    }

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
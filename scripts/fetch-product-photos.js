const fs = require("fs");
const path = require("path");
const https = require("https");

const envPath = path.join(__dirname, "../.env");
const envContent = fs.readFileSync(envPath, "utf8");
const match = envContent.match(/^PEXELS_API_KEY=(.+)$/m);
if (!match) {
  console.error("PEXELS_API_KEY not found in .env");
  process.exit(1);
}
const PEXELS_API_KEY = match[1].trim();

const searches = [
  { query: "handmade leather wallet", filename: "leather-wallet.jpg" },
  { query: "wooden cutting board handmade", filename: "cutting-board.jpg" },
  { query: "knitted wool blanket", filename: "wool-blanket.jpg" },
  { query: "hand thrown pottery vase", filename: "pottery-vase.jpg" },
  { query: "artisan candle handmade", filename: "artisan-candle.jpg" },
  { query: "beaded necklace handmade", filename: "beaded-necklace.jpg" },
  { query: "boho scarf collection", filename: "scarf-collection.jpg" },
  { query: "handmade soap bars collection", filename: "soap-collection.jpg" },
  { query: "woven basket home decor", filename: "woven-basket.jpg" },
  { query: "macrame wall hanging boho decor", filename: "macrame-wall-hanging.jpg" },
  { query: "macrame plant hanger indoor", filename: "macrame-plant-hanger.jpg" },
  { query: "macrame bracelet handmade jewelry", filename: "macrame-bracelet.jpg" },
  { query: "linen pants clothing flat lay", filename: "linen-pants.jpg" },
  { query: "handmade cotton shirt clothing", filename: "cotton-shirt.jpg" },
  { query: "flowy skirt clothing boutique", filename: "flowy-skirt.jpg" },
  { query: "denim shorts clothing flat lay", filename: "denim-shorts.jpg" },
  { query: "sundress clothing boutique", filename: "sundress.jpg" },
  { query: "original oil painting artwork", filename: "oil-painting.jpg" },
  { query: "abstract acrylic painting canvas", filename: "abstract-painting.jpg" },
  { query: "handmade leather belt", filename: "leather-belt.jpg" },
  { query: "handmade leather purse handbag", filename: "leather-purse.jpg" },
  { query: "silver gemstone ring jewelry", filename: "silver-gemstone-ring.jpg" },
  { query: "silver stone pendant necklace", filename: "silver-stone-pendant.jpg" },
  { query: "handmade acoustic guitar wood", filename: "acoustic-guitar-new.jpg" },
  { query: "wooden ukulele instrument", filename: "ukulele.jpg" },
  { query: "handmade violin instrument", filename: "violin.jpg" },
];

const outputDir = path.join(__dirname, "../public/products-new");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function searchPexels(query) {
  return new Promise((resolve, reject) => {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`;
    https.get(url, { headers: { Authorization: PEXELS_API_KEY } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        resolve();
      });
    }).on("error", reject);
  });
}

async function main() {
  const results = [];

  for (const item of searches) {
    console.log(`Searching: "${item.query}"...`);
    try {
      const data = await searchPexels(item.query);
      if (!data.photos || data.photos.length === 0) {
        console.log(`  No results found for "${item.query}"`);
        continue;
      }
      const photo = data.photos[0];
      const destPath = path.join(outputDir, item.filename);
      await downloadImage(photo.src.large, destPath);
      console.log(`  ✅ Saved: public/products-new/${item.filename}`);
      results.push({
        filename: item.filename,
        photographer: photo.photographer,
        pexelsUrl: photo.url,
      });
    } catch (err) {
      console.error(`  ❌ Failed for "${item.query}":`, err.message);
    }
  }

  console.log("\n--- Summary (photo credits, keep for attribution) ---");
  results.forEach((r) => {
    console.log(`${r.filename} — Photo by ${r.photographer} on Pexels (${r.pexelsUrl})`);
  });
}

main();

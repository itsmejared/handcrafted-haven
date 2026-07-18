import express from "express";
import cors from "cors";
import "dotenv/config";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Resolve paths for local JSON data files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, "data");

const PATH_PRODUCTS = join(DATA_DIR, "products.json");
const PATH_ARTISANS = join(DATA_DIR, "artisans.json");
const PATH_CATEGORIES = join(DATA_DIR, "categories.json");
const PATH_ORDERS = join(DATA_DIR, "orders.json");

// Helper to read JSON data
async function readJsonFile(filePath, defaultValue = []) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return defaultValue;
  }
}

// Helper to write JSON data
async function writeJsonFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error.message);
    return false;
  }
}

// --- Endpoints ---

// 1. Root health-check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Welcome to the Handcrafted Haven API server",
    endpoints: {
      products: "GET /api/products, GET /api/products/:id, POST /api/products",
      artisans: "GET /api/artisans, GET /api/artisans/:id",
      categories: "GET /api/categories",
      orders: "POST /api/orders, GET /api/orders",
    },
  });
});

// 2. Categories Endpoint
app.get("/api/categories", async (req, res) => {
  const categories = await readJsonFile(PATH_CATEGORIES);
  res.json(categories);
});

// 3. Artisans / Sellers Endpoints
app.get("/api/artisans", async (req, res) => {
  const artisans = await readJsonFile(PATH_ARTISANS);
  res.json(artisans);
});

app.get("/api/artisans/:id", async (req, res) => {
  const artisans = await readJsonFile(PATH_ARTISANS);
  const artisan = artisans.find((a) => a.id === req.params.id);
  if (!artisan) {
    return res.status(404).json({ error: "Artisan not found" });
  }
  res.json(artisan);
});

// 4. Products Endpoints
app.get("/api/products", async (req, res) => {
  const products = await readJsonFile(PATH_PRODUCTS);
  let filteredProducts = [...products];

  // Filtering by Category
  const { category, search, artisan, minPrice, maxPrice, sort } = req.query;

  if (category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.categoryId === category,
    );
  }

  // Filtering by Artisan
  if (artisan) {
    filteredProducts = filteredProducts.filter((p) => p.artisanId === artisan);
  }

  // Text search (name, description, artisanName)
  if (search) {
    const query = search.toString().toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.artisanName.toLowerCase().includes(query),
    );
  }

  // Price filtering
  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= parseFloat(minPrice.toString()),
    );
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= parseFloat(maxPrice.toString()),
    );
  }

  // Sorting
  if (sort) {
    if (sort === "price-low") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    } else if (sort === "reviews") {
      filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }

  res.json(filteredProducts);
});

app.get("/api/products/:id", async (req, res) => {
  const products = await readJsonFile(PATH_PRODUCTS);
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

app.post("/api/products", async (req, res) => {
  const { name, price, artisanId, categoryId, emoji, description, stock } =
    req.body;

  if (
    !name ||
    price === undefined ||
    !artisanId ||
    !categoryId ||
    !description
  ) {
    return res.status(400).json({ error: "Missing required product fields" });
  }

  // Find the artisan to fetch their name automatically
  const artisans = await readJsonFile(PATH_ARTISANS);
  const artisan = artisans.find((a) => a.id === artisanId);
  if (!artisan) {
    return res.status(400).json({ error: "Invalid artisanId" });
  }

  const products = await readJsonFile(PATH_PRODUCTS);
  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    price: parseFloat(price),
    artisanId,
    artisanName: artisan.name,
    categoryId,
    emoji: emoji || "🎁",
    description,
    stock: stock !== undefined ? parseInt(stock) : 10,
    rating: 5.0, // Default rating for new product
    reviewCount: 0,
    images: [],
  };

  products.push(newProduct);
  const success = await writeJsonFile(PATH_PRODUCTS, products);

  if (!success) {
    return res.status(500).json({ error: "Failed to write product data" });
  }

  res.status(201).json(newProduct);
});

// 5. Orders Endpoints
app.post("/api/orders", async (req, res) => {
  const { items, customerName, customerEmail, shippingAddress, total } =
    req.body;

  if (
    !items ||
    !Array.isArray(items) ||
    items.length === 0 ||
    !customerName ||
    !customerEmail ||
    total === undefined
  ) {
    return res.status(400).json({ error: "Missing required order details" });
  }

  const orders = await readJsonFile(PATH_ORDERS);
  const newOrder = {
    id: `ord-${Date.now()}`,
    customerName,
    customerEmail,
    shippingAddress: shippingAddress || "Digital / Guest checkout",
    items,
    total: parseFloat(total),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  const success = await writeJsonFile(PATH_ORDERS, orders);

  if (!success) {
    return res.status(500).json({ error: "Failed to save order details" });
  }

  res.status(201).json(newOrder);
});

app.get("/api/orders", async (req, res) => {
  const orders = await readJsonFile(PATH_ORDERS);
  res.json(orders);
});

// Start server
app.listen(PORT, () => {
  console.log(
    `🚀 Handcrafted Haven server running at http://localhost:${PORT}`,
  );
});

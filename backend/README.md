# Handcrafted Haven API Server

This is a simple Node.js Express server that mocks the backend APIs for Handcrafted Haven. It reads and writes from local JSON files located in the `data/` directory, acting as a lightweight persistent mockup database.

## Prerequisites

- Node.js (v18+)
- pnpm (or npm)

## Getting Started

To install dependencies and start the server:

1. **Install Dependencies:**
   From the project root:

   ```bash
   pnpm install
   ```

   Or inside the `server/` directory:

   ```bash
   pnpm install
   ```

2. **Run in Development Mode:**
   From the project root:
   ```bash
   pnpm server
   ```
   Or inside the `server/` directory:
   ```bash
   pnpm dev
   ```

The server will start on [http://localhost:5001](http://localhost:5001).

## API Endpoints

### Categories

- `GET /api/categories` - Returns all categories.

### Artisans / Sellers

- `GET /api/artisans` - Returns all artisans.
- `GET /api/artisans/:id` - Returns details for a specific artisan.

### Products

- `GET /api/products` - Returns all products. Supports query parameters:
  - `category` (e.g. `?category=jewelry`)
  - `artisan` (e.g. `?artisan=clay-and-co`)
  - `search` (e.g. `?search=ceramic`) - searches name, description, and artisan name.
  - `minPrice` / `maxPrice` (e.g. `?minPrice=20&maxPrice=100`)
  - `sort` (values: `price-low`, `price-high`, `rating`, `reviews`)
- `GET /api/products/:id` - Returns a single product.
- `POST /api/products` - Creates a new product and appends it to `data/products.json`.
  - Body: `{ name, price, artisanId, categoryId, emoji, description, stock }`

### Orders / Checkout

- `POST /api/orders` - Creates a new order (guest checkout) and appends it to `data/orders.json`.
  - Body: `{ customerName, customerEmail, shippingAddress, items, total }`
- `GET /api/orders` - Returns list of submitted orders.

## Mock Databases

All data files are stored as plain JSON in `data/`:

- `data/categories.json` - Product categories.
- `data/artisans.json` - Seller/artisan details.
- `data/products.json` - Shop products.
- `data/orders.json` - Customer orders placed.

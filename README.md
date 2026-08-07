# Handcrafted Haven 🛍️✨

Handcrafted Haven is an innovative web application designed to connect artisans and crafters with customers who appreciate unique, handmade items. It operates as a virtual marketplace that promotes sustainable consumption, supports local artisans, and offers a smooth, secure shopping experience.

---

## 👥 Team Members & Roles

- Jared Huayta — Product Catalog, Cart & Orders Lead
- Immanuel — Database Architecture & Backend Services
- Isaac — Authentication & User Management
- Rex Jonathan Kapoloma — Ratings & Product Reviews Lead
- Kristin Lind — Frontend Integration & UI/UX Lead

---

## 🛠️ Tech Stack

- Framework: Next.js (App Router, React 19, TypeScript)
- Styling: Tailwind CSS, Lucide React Icons
- Database: Neon (PostgreSQL)
- Authentication: NextAuth.js v5 (Auth.js) / Server Actions
- State & Caching: React Context, Server Actions & revalidatePath
- Package Manager: pnpm
- Deployment: Vercel

---

## 🚀 Key Features

- Product Catalog & Filtering: Browse handcrafted products with pagination, category filters, price range, and instant search.
- Order & Shopping Cart System (orders-feature): Full e-commerce flow allowing users to manage cart items, place orders, and review transaction history.
- Product Reviews & Ratings: Customers can submit feedback and star ratings powered by Next.js Server Actions and real-time cache revalidation.
- Role-Based Profiles: Seamless navigation and view toggling tailored specifically for Customers and Sellers (Artisans).
- Artisan Showcase: Dedicated seller pages displaying bios, profiles, and listed products.

---

## 🔑 Test Accounts (Demo Credentials)

Use any of the accounts below to test role-based features (all accounts share the same password for convenience):

Password for all demo accounts: password123

### 🛒 Customer Account

- Email: customer@handcrafted.com
- Role: Customer (Browsing, Shopping, Placing Orders, Writing Reviews)

### 🎨 Seller / Artisan Accounts

- Catherine Lewis (Clay & Co): info@clayandco.com
- McKenna Craig (Knotted Dreams): hello@knotteddreams.com
- Heather Bradford (Color Flow Studio): design@colorflow.com
- Josh Sears (Strings & Things): music@stringsthings.com
- Jennifer Lyons (Pure Botanicals): care@purebotanicals.com
- Sean Johnson (Artisan Brush Co): gallery@artisanbrush.com
- Katrina Burrup (Silver Linings): kb@nextmail.com
- Jilly Michaels (Edge Clothing): hello@jillymichaels.com
- Nick Fuentas (Weathered and Wood): hello@weatheredandwood.com

---

## 📋 Prerequisites

Ensure you have the following installed locally:

- Node.js: v18.17 or higher
- pnpm: (Recommended)
  npm install -g pnpm

---

## 💻 Local Setup & Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/itsmejared/handcrafted-haven.git
   cd handcrafted-haven
   ```

2. Switch to the orders feature branch:

   ```bash
   git checkout orders-feature
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Environment Variables Configuration:
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL=postgresql://user:password@server.tech/_db_?sslmode=require
   AUTH_SECRET=your_nextauth_secret_here
   ```

5. Start the development server:

   ```bash
   pnpm run dev
   ```

6. View the application:
   Open http://localhost:3000 in your browser.

---

## 📜 Available Scripts

In the project directory, you can run:

- pnpm run dev — Starts the development server.
- pnpm run build — Builds the application for production.
- pnpm run start — Runs the compiled production build.
- pnpm run lint — Runs ESLint to check for code quality and syntax issues.

---

## 🗺️ Directory Structure

```text
handcrafted-haven/
├── app/                  # Next.js App Router (Pages, Layouts, Server Actions)
│   ├── (auth)/           # Authentication views (Login, Register)
│   ├── cart/             # Shopping cart page
│   ├── orders/           # Order management & order history
│   ├── products/         # Catalog & Product detail views
│   ├── reviews/          # Customer reviews management
│   ├── sellers/          # Artisan profiles and catalog
│   ├── services/         # Database services (SQL queries via 'pg')
│   ├── layout.tsx        # Global app layout
│   └── page.tsx          # Landing / Home page
├── components/           # Shared React UI components
├── lib/                  # Utilities, DB singleton, Zod validations
├── public/               # Static assets (product & category images)
└── types/                # Global TypeScript definitions
```

---

## Collaboration & Deployment Guidelines

- **Pull Requests:** Never push directly to the `main` branch.
- **Task Branches:** Create dedicated feature/task branches (e.g., `review-feature`) stemming from the GitHub Project Board issues.

---

## 🎓 Course Info

Developed as part of the WDD430 Web Development Capstone Project.

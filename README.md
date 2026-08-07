# Handcrafted Haven

An innovative web application that provides a platform for artisans and crafters to showcase and sell their unique handcrafted items. It serves as a virtual marketplace, connecting talented creators with potential customers who appreciate the beauty and quality of handmade products.

## Team Members

- Eduardo Jared Huayta (`itsmejared`)
- Kristin Lind (`KristinLind`)
- Isaac Miti (`ikayz`)
- Immanuel Chinenye Njibie (`immanuel4partner`)
- Rex Jonathan Kapoloma (`Rex407`)

---

## Project Overview & Features

The application focuses on fostering a sense of community, supporting local artisans, and promoting sustainable consumption.

- **Seller Profiles:** Authenticated sellers have dedicated profiles to showcase their craftsmanship and share their stories.
- **Product Listings:** Artisans can list items for sale with descriptions, pricing, and images. Users can browse the catalog and filter by category or price range.
- **Interactive Reviews & Ratings (`/reviews`):** Authenticated users can leave ratings (1–5 stars) and optional written testimonials for products.
- **Accessibility & Design:** Complies with Web Content Accessibility Guidelines (WCAG) 2.1, Level AA. Features responsive design principles across desktop, tablet, and mobile devices.

---

## Tech Stack

This project is built as a unified Full-Stack application using the modern Next.js framework, eliminating the need for separate frontend and backend directories.

- **Frontend:** React, Next.js (App Router), Tailwind CSS, Lucide Icons.
- **Backend:** Next.js Inline Server Actions.
- **Database:** PostgreSQL hosted on Neon (Serverless Postgres).
- **Validation:** Zod schemas for request payload validation.
- **Project Management & Deployment:** Git, GitHub Projects, and Vercel.

---

## Project Structure

handcrafted-haven/
├── app/
│ ├── api/ # Serverless Backend API Routes
│ │ ├── auth/ # Registration & Login endpoints
│ │ ├── categories/ # Category data fetching
│ │ ├── products/ # Product catalog & filtering
│ │ └── sellers/ # Artisan profile data
│ ├── lib/ # Shared logic, validations, and configurations
│ │ ├── validations/ # Zod schemas (e.g., review.ts)
│ │ ├── db.ts # PostgreSQL Lazy Singleton connection
│ │ └── types.ts # TypeScript interfaces & Data Models
│ ├── reviews/ # Interactive Reviews Module
│ │ ├── loading.tsx # Next.js Streaming Skeleton UI
│ │ └── page.tsx # Server Component with Inline Server Actions & Modals
│ ├── services/ # Server-side Database Queries
│ │ ├── products.ts # Product SQL services
│ │ └── reviews.ts # Review UPSERT/DELETE SQL operations & Cache Invalidations
│ ├── ui/ # Reusable UI components (Header, Footer)
│ ├── layout.tsx # Global Root Layout
│ └── page.tsx # Dynamic Landing Page (Server Component)
├── public/ # Static assets and optimized images
├── .env.local # Environment variables (Git Ignored!)
├── .gitignore # Version control exclusions
└── package.json # Unified dependencies

---

## Getting Started

### 1. Clone the repository

git clone https://github.com/itsmejared/handcrafted-haven.git
cd handcrafted-haven

### 2. Configure Environment Variables

Create a `.env.local` file directly in the root directory of the project:

DATABASE_URL=postgresql://your_user:your_password@your_neon_host/neondb?sslmode=require&uselibpqcompat=true
AUTH_SECRET=YOUR_AUTH_SECRET

> **Note:** Never commit the `.env.local` file to GitHub. Ensure it is listed in your `.gitignore`.

### 3. Install Dependencies

Install the packages using `pnpm` from the root directory:

pnpm install

### 4. Run the Development Server

Start the unified frontend and backend environment:

pnpm dev

Open your browser and navigate to `http://localhost:3000`.  
To test the database connection, navigate to `http://localhost:3000/api/categories`.

---

## Collaboration & Deployment Guidelines

- **Pull Requests:** Never push directly to the `main` branch.
- **Task Branches:** Create dedicated feature/task branches (e.g., `review-feature`) stemming from the GitHub Project Board issues.

## Test Accounts (for grading/demo purposes)

The following seller accounts exist in the database and are ready to use (all share the same password for convenience):

| Seller                               | Email                      | Password    |
| ------------------------------------ | -------------------------- | ----------- |
| Catherine Lewis — Clay & Co          | info@clayandco.com         | password123 |
| McKenna Craig — Knotted Dreams       | hello@knotteddreams.com    | password123 |
| Heather Bradford — Color Flow Studio | design@colorflow.com       | password123 |
| Josh Sears — Strings & Things        | music@stringsthings.com    | password123 |
| Jennifer Lyons — Pure Botanicals     | care@purebotanicals.com    | password123 |
| Sean Johnson — Artisan Brush Co      | gallery@artisanbrush.com   | password123 |
| Katrina Burrup — Silver Linings      | kb@nextmail.com            | password123 |
| Jilly Michaels — Edge Clothing       | hello@jillymichaels.com    | password123 |
| Nick Fuentas — Weathered and Wood    | hello@weatheredandwood.com | password123 |

You can log in as any of the above at `/login` to test seller features (editing profile, viewing "My Profile"). To test the customer experience, feel free to register a new account at `/register` and select "Customer" as the role.

====================================================================
ARCHIVO 1: README.md
====================================================================

# Handcrafted Haven

An innovative web application that provides a platform for artisans and crafters to showcase and sell their unique handcrafted items. It serves as a virtual marketplace, connecting talented creators with potential customers who appreciate the beauty and quality of handmade products.

## Team Members

- Eduardo Jared Huayta (itsmejared)
- Kristin Lind (KristinLind)
- Isaac Miti (ikayz)
- Immanuel Chinenye Njibie (immanuel4partner)
- Rex Jonathan Kapoloma (Rex407)
- Laston James Sichali

---

## Project Overview & Features

The application focuses on fostering a sense of community, supporting local artisans, and promoting sustainable consumption.

- **Seller Profiles:** Authenticated sellers have dedicated profiles to showcase their craftsmanship and share their stories.
- **Product Listings:** Artisans can list items for sale with descriptions, pricing, and images. Users can browse the catalog and filter by category or price range.
- **Reviews and Ratings:** Any registered user can leave a rating (1-5 stars) and a written review for a product.
- **Accessibility & Design:** The application complies with Web Content Accessibility Guidelines (WCAG) 2.1, Level AA. It features responsive web design principles for a seamless experience across desktop, tablet, and mobile devices.

---

## Tech Stack

This project is built as a unified Full-Stack application using the modern Next.js framework, eliminating the need for separate frontend and backend directories.

- **Frontend:** React, Next.js (App Router), Tailwind CSS.
- **Backend:** Node.js Serverless Functions via Next.js API Routes (`app/api/`).
- **Database:** PostgreSQL hosted on Neon (Serverless Postgres).
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
│ ├── lib/ # Shared logic and configurations
│ │ ├── db.ts # PostgreSQL Lazy Singleton connection
│ │ └── types.ts # TypeScript interfaces & Data Models
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

Create a .env.local file directly in the root directory of the project:

# NEON POSTGRESQL CONNECTION STRING (DEVELOPMENT BRANCH)

DATABASE_URL=postgresql://your_user:your_password@your_neon_host/neondb?sslmode=require&uselibpqcompat=true

# SECRET STRING FOR JWT SIGNING

JWT_SECRET=your_super_secret_jwt_string_here

> Note: Never commit the .env.local file to GitHub. Ensure it is listed in your .gitignore.

### 3. Install Dependencies

Install the packages using pnpm from the root directory:
pnpm install

### 4. Run the Development Server

Start the unified frontend and backend environment:
pnpm dev

Open your browser and navigate to http://localhost:3000.
To test the database connection, navigate to http://localhost:3000/api/categories.

---

## Collaboration & Deployment Guidelines

- **Pull Requests:** Never push directly to the main branch. Create dedicated task branches stemming from the GitHub Project Board issues.

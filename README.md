# Handcrafted Haven

A virtual marketplace connecting artisans and crafters with customers who appreciate unique handmade products.

## Team Members

- Eduardo Jared Huayta (itsmejared)
- Kristin Lind (KristinLind)
- Isaac Miti (ikayz)
- Immanuel Chinenye Njibie (immanuel4partner)
- Rex Jonathan Kapoloma (Rex407)
- Laston James Sichali

---

## Project Description

Handcrafted Haven is a full-stack web application that connects artisans with customers looking for unique handmade products.

The project is organized into two independent applications:

- **Frontend** – Built with Next.js, React, and Tailwind CSS.
- **Backend** – REST API built with Node.js and Express.

---

## Project Structure

```
handcrafted-haven/
│
├── backend/          # Node.js + Express API
│   ├── data/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── frontend/         # Next.js application
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

## Tech Stack

### Frontend

- Next.js
- React
- Tailwind CSS

### Backend

- Node.js
- Express
- PostgreSQL

### Tools

- GitHub
- GitHub Projects
- Vercel (Frontend)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd handcrafted-haven
```

---

## Running the Backend

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
pnpm install
```

Start the server:

```bash
pnpm dev
```

By default the backend runs on:

```
http://localhost:5001/
```

---

## Running the Frontend

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open:

```
http://localhost:3000
```

---

## Notes

The frontend and backend are independent applications and must be installed and started separately.

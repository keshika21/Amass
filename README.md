# Amass — Personal Finance Tracker

Amass is a full-stack web app that helps university students track income and expenses, visualize spending habits, set budgets, and work toward savings goals — built as a portfolio project demonstrating end-to-end software development practices.

## Problem

Many students and young professionals don't keep proper records of income and expenses, leading to overspending and difficulty hitting savings goals. Existing finance apps are often cluttered with ads, paywalled features, or too complex for quick day-to-day logging. Amass focuses on fast, low-friction transaction entry and clear at-a-glance summaries.

## Features

- Secure registration and login (JWT authentication, bcrypt password hashing)
- Add, edit, and delete income/expense transactions
- Dashboard with income/expense/balance summary and a spending-by-category pie chart
- Monthly budgets per category, with live spend-vs-limit tracking
- Savings goals with progress tracking
- Monthly financial reports
- Predefined categories for fast entry (no typing required)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios, Recharts |
| Backend | Node.js, Express |
| Database | MySQL |
| Auth | JWT, bcrypt |

**Architecture:** 3-tier — React (client) → Express (REST API) → MySQL (database). The frontend never accesses the database directly; all requests go through the authenticated API layer.

## Screenshots

*(Add screenshots here — Dashboard, Transactions, Budgets, Goals pages. Drag image files into this section on GitHub, or reference `docs/screenshots/filename.png`.)*

## Project Structure
Amass/
├── backend/ # Express REST API
│ ├── routes/ # auth, transactions, dashboard, budgets, goals, reports
│ ├── middleware/ # JWT auth middleware
│ ├── db.js # MySQL connection pool
│ └── server.js
├── frontend/ # React (Vite) app
│ └── src/
│ ├── api/ # Axios instance
│ ├── context/ # Auth context
│ ├── components/ # Navbar, ProtectedRoute
│ └── pages/ # Login, Register, Dashboard, Transactions, Budgets, Goals, Reports
├── docs/ # Planning docs, requirements, architecture, API reference
└── diagrams/ # ER diagram


## Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server

### 1. Clone the repo
```bash
git clone https://github.com/keshika21/Amass.git
cd Amass
```

### 2. Set up the database
Open MySQL Workbench (or any MySQL client) and run the schema in `docs/database-design.md` (or `diagrams/er-diagram.md`) to create the `amass` database and its tables, then seed the predefined categories.

### 3. Set up the backend
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=amass
PORT=5000
JWT_SECRET=your_random_secret_string
Run the server:
```bash
npm run dev
```
API available at `http://localhost:5000`.

### 4. Set up the frontend
```bash
cd ../frontend
npm install
npm run dev
```
App available at `http://localhost:5173`.

## API Documentation

Full endpoint reference: [`docs/api-endpoints.md`](docs/api-endpoints.md)

## Documentation

This project followed a structured planning process before any code was written:
- [Problem Statement, Target Users, Competitor Analysis, Feature List, User Stories](docs/project-planning.md)
- [Functional & Non-Functional Requirements](docs/requirements.md)
- [Database Design & ER Diagram](docs/database-design.md)
- [System Architecture](docs/architecture.md)
- [API Endpoints](docs/api-endpoints.md)

## Author

Built by Keshika as a full-stack portfolio project.

## License

MIT
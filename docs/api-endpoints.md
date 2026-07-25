# Amass - API Endpoints

## Auth
- POST /api/auth/register - Create new user account
- POST /api/auth/login - Log in, return auth token
- POST /api/auth/logout - Log out

## Transactions
- GET /api/transactions - Get all transactions for logged-in user
- POST /api/transactions - Add new income or expense
- PUT /api/transactions/:id - Edit a transaction
- DELETE /api/transactions/:id - Delete a transaction

## Dashboard
- GET /api/dashboard - Summary: total income, expenses, balance
- GET /api/dashboard/chart - Expense breakdown by category

## Categories
- GET /api/categories - Get predefined category list

## Budgets
- GET /api/budgets - Get user's budgets with usage %
- POST /api/budgets - Set a monthly category budget
- PUT /api/budgets/:id - Update a budget limit

## Savings Goals
- GET /api/goals - Get user's goals with progress
- POST /api/goals - Create a new goal
- PUT /api/goals/:id - Update a goal
- DELETE /api/goals/:id - Delete a goal

## Reports
- GET /api/reports/monthly?month=&year= - Generate monthly report

## Notes
All routes except /api/auth/register and /api/auth/login require authentication middleware to verify the logged-in user, enforcing NFR2 (users can only access their own data).
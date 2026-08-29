const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const [summary] = await db.query(
      `SELECT 
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
       FROM transactions WHERE user_id = ?`,
      [req.user.user_id]
    );
    const totalIncome = summary[0].total_income || 0;
    const totalExpense = summary[0].total_expense || 0;

    res.json({
      total_income: totalIncome,
      total_expense: totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// GET /api/dashboard/chart
router.get('/chart', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.name AS category, CAST(SUM(t.amount) AS DECIMAL(12,2)) + 0 AS total
       FROM transactions t
       JOIN categories c ON t.category_id = c.category_id
       WHERE t.user_id = ? AND t.type = 'expense'
       GROUP BY c.name`,
      [req.user.user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load chart data' });
  }
});

module.exports = router;
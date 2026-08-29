const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// GET /api/reports/monthly?month=8&year=2026
router.get('/monthly', async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ error: 'month and year query parameters are required' });
    }

    const [summary] = await db.query(
      `SELECT 
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
       FROM transactions 
       WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?`,
      [req.user.user_id, month, year]
    );

    const [byCategory] = await db.query(
      `SELECT c.name AS category, SUM(t.amount) AS total
       FROM transactions t
       JOIN categories c ON t.category_id = c.category_id
       WHERE t.user_id = ? AND t.type = 'expense' AND MONTH(t.date) = ? AND YEAR(t.date) = ?
       GROUP BY c.name`,
      [req.user.user_id, month, year]
    );

    res.json({
      total_income: summary[0].total_income || 0,
      total_expense: summary[0].total_expense || 0,
      by_category: byCategory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

module.exports = router;
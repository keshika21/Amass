const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// GET /api/budgets - returns budgets with usage calculated
router.get('/', async (req, res) => {
  try {
    const [budgets] = await db.query(
      `SELECT b.*, c.name AS category_name,
         COALESCE((
           SELECT SUM(t.amount) FROM transactions t
           WHERE t.user_id = b.user_id AND t.category_id = b.category_id
           AND t.type = 'expense' AND MONTH(t.date) = b.month AND YEAR(t.date) = b.year
         ), 0) AS spent
       FROM budgets b
       JOIN categories c ON b.category_id = c.category_id
       WHERE b.user_id = ?`,
      [req.user.user_id]
    );
    res.json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// POST /api/budgets
router.post('/', async (req, res) => {
  try {
    const { category_id, month, year, limit_amount } = req.body;

    if (!category_id || !month || !year || !limit_amount) {
      return res.status(400).json({ error: 'category_id, month, year, and limit_amount are required' });
    }

    const [result] = await db.query(
      'INSERT INTO budgets (user_id, category_id, month, year, limit_amount) VALUES (?, ?, ?, ?, ?)',
      [req.user.user_id, category_id, month, year, limit_amount]
    );

    res.status(201).json({ budget_id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Budget already exists for this category and month' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

// PUT /api/budgets/:id
router.put('/:id', async (req, res) => {
  try {
    const { limit_amount } = req.body;

    const [existing] = await db.query(
      'SELECT * FROM budgets WHERE budget_id = ? AND user_id = ?',
      [req.params.id, req.user.user_id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await db.query('UPDATE budgets SET limit_amount = ? WHERE budget_id = ?', [limit_amount, req.params.id]);
    res.json({ message: 'Budget updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

module.exports = router;
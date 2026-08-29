const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// GET /api/transactions
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT t.*, c.name AS category_name 
       FROM transactions t 
       JOIN categories c ON t.category_id = c.category_id 
       WHERE t.user_id = ? 
       ORDER BY t.date DESC`,
      [req.user.user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const { category_id, type, amount, date, note } = req.body;

    if (!category_id || !type || !amount || !date) {
      return res.status(400).json({ error: 'category_id, type, amount, and date are required' });
    }
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'type must be income or expense' });
    }

    const [result] = await db.query(
      'INSERT INTO transactions (user_id, category_id, type, amount, date, note) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.user_id, category_id, type, amount, date, note || null]
    );

    res.status(201).json({ transaction_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res) => {
  try {
    const { category_id, type, amount, date, note } = req.body;

    const [existing] = await db.query(
      'SELECT * FROM transactions WHERE transaction_id = ? AND user_id = ?',
      [req.params.id, req.user.user_id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await db.query(
      'UPDATE transactions SET category_id = ?, type = ?, amount = ?, date = ?, note = ? WHERE transaction_id = ?',
      [category_id, type, amount, date, note || null, req.params.id]
    );

    res.json({ message: 'Transaction updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM transactions WHERE transaction_id = ? AND user_id = ?',
      [req.params.id, req.user.user_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

module.exports = router;
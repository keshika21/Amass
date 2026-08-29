const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// GET /api/goals
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM savings_goals WHERE user_id = ?', [req.user.user_id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// POST /api/goals
router.post('/', async (req, res) => {
  try {
    const { name, target_amount, target_date } = req.body;

    if (!name || !target_amount || !target_date) {
      return res.status(400).json({ error: 'name, target_amount, and target_date are required' });
    }

    const [result] = await db.query(
      'INSERT INTO savings_goals (user_id, name, target_amount, target_date) VALUES (?, ?, ?, ?)',
      [req.user.user_id, name, target_amount, target_date]
    );

    res.status(201).json({ goal_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// PUT /api/goals/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, target_amount, target_date, current_amount } = req.body;

    const [existing] = await db.query(
      'SELECT * FROM savings_goals WHERE goal_id = ? AND user_id = ?',
      [req.params.id, req.user.user_id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await db.query(
      'UPDATE savings_goals SET name = ?, target_amount = ?, target_date = ?, current_amount = ? WHERE goal_id = ?',
      [name, target_amount, target_date, current_amount, req.params.id]
    );

    res.json({ message: 'Goal updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// DELETE /api/goals/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM savings_goals WHERE goal_id = ? AND user_id = ?', [req.params.id, req.user.user_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

module.exports = router;
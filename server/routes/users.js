const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { log } = require('../utils/audit');

router.post('/', async (req, res) => {
  const { username, email, full_name, role } = req.body;
  if (!username || !email) return res.status(400).json({ error: 'username and email are required' });

  try {
    const result = await db.query(
      'INSERT INTO users (username, email, full_name, role) VALUES ($1,$2,$3,$4) RETURNING *',
      [username, email, full_name || null, role || 'player']
    );
    await log({ entity_type: 'user', entity_id: result.rows[0].id, action: 'create_user', operator_id: null, details: result.rows[0] });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  if (result.rowCount === 0) return res.status(404).json({ error: 'user not found' });
  res.json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, full_name, role, stripe_customer_id } = req.body;

  try {
    const result = await db.query(
      `UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email), full_name = COALESCE($3, full_name), role = COALESCE($4, role), stripe_customer_id = COALESCE($5, stripe_customer_id), updated_at = NOW() WHERE id = $6 RETURNING *`,
      [username, email, full_name, role, stripe_customer_id, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'user not found' });
    await log({ entity_type: 'user', entity_id: id, action: 'update_user', details: result.rows[0] });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  if (result.rowCount === 0) return res.status(404).json({ error: 'user not found' });
  await log({ entity_type: 'user', entity_id: id, action: 'delete_user', details: result.rows[0] });
  res.json({ success: true });
});

module.exports = router;

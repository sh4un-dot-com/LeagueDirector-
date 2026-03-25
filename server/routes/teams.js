const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { log } = require('../utils/audit');

router.post('/', async (req, res) => {
  const { league_id, owner_id, name, balance } = req.body;
  if (!league_id || !owner_id || !name) return res.status(400).json({ error: 'league_id, owner_id, name required' });

  try {
    const result = await db.query(
      'INSERT INTO teams (league_id, owner_id, name, balance) VALUES ($1,$2,$3,$4) RETURNING *',
      [league_id, owner_id, name, balance || 0]
    );
    await log({ entity_type: 'team', entity_id: result.rows[0].id, action: 'create_team', details: result.rows[0] });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create team', details: error.message });
  }
});

router.get('/league/:leagueId', async (req, res) => {
  const { leagueId } = req.params;
  const result = await db.query('SELECT * FROM teams WHERE league_id = $1', [leagueId]);
  res.json(result.rows);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, balance } = req.body;
  const result = await db.query(
    `UPDATE teams SET name = COALESCE($1, name), balance = COALESCE($2, balance), updated_at = NOW() WHERE id = $3 RETURNING *`,
    [name, balance, id]
  );
  if (result.rowCount === 0) return res.status(404).json({ error: 'team not found' });
  await log({ entity_type: 'team', entity_id: id, action: 'update_team', details: result.rows[0] });
  res.json(result.rows[0]);
});

module.exports = router;

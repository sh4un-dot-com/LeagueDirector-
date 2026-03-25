const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { log } = require('../utils/audit');

router.post('/pick', async (req, res) => {
  const { league_id, team_id, entity_id, pick_number } = req.body;
  if (!league_id || !team_id || !entity_id || !Number.isInteger(pick_number)) {
    return res.status(400).json({ error: 'league_id, team_id, entity_id, pick_number required' });
  }

  try {
    const result = await db.query(
      `INSERT INTO draft_picks (league_id, team_id, entity_id, pick_number) VALUES ($1,$2,$3,$4) RETURNING *`,
      [league_id, team_id, entity_id, pick_number]
    );
    await log({ entity_type: 'draft_pick', entity_id: result.rows[0].id, action: 'create_pick', details: result.rows[0] });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create draft pick', details: error.message });
  }
});

router.get('/league/:leagueId', async (req, res) => {
  const { leagueId } = req.params;
  const result = await db.query('SELECT * FROM draft_picks WHERE league_id = $1 ORDER BY pick_number ASC', [leagueId]);
  res.json(result.rows);
});

router.put('/pick/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await db.query(
    'UPDATE draft_picks SET status = COALESCE($1, status), updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, id]
  );
  if (result.rowCount === 0) return res.status(404).json({ error: 'pick not found' });
  await log({ entity_type: 'draft_pick', entity_id: id, action: 'update_pick', details: result.rows[0] });
  res.json(result.rows[0]);
});

module.exports = router;

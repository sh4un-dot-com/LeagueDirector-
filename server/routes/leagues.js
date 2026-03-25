const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/:id/rules', async (req, res) => {
  const leagueId = req.params.id;
  const { action_key, point_value, condition } = req.body;

  if (!action_key || point_value === undefined) {
    return res.status(400).json({ error: 'action_key and point_value are required' });
  }

  try {
    const result = await db.query(
      `INSERT INTO scoring_rules (league_id, action_key, point_value, condition) VALUES ($1, $2, $3, $4) RETURNING *`,
      [leagueId, action_key, point_value, condition ? condition : null]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to add scoring rule', details: err.message });
  }
});

module.exports = router;

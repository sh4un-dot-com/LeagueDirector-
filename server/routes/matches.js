const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/:id/results', async (req, res) => {
  const matchId = req.params.id;
  const { entity_id, sport_id, raw_stats } = req.body;

  if (!entity_id || !sport_id || !raw_stats) {
    return res.status(400).json({ error: 'entity_id, sport_id, and raw_stats are required' });
  }

  try {
    const insertQuery = `
      INSERT INTO match_data (match_id, entity_id, sport_id, raw_stats)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (match_id, entity_id) DO UPDATE
      SET raw_stats = EXCLUDED.raw_stats, updated_at = NOW()
      RETURNING *;
    `;

    const result = await db.query(insertQuery, [matchId, entity_id, sport_id, raw_stats]);
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save match result', details: err.message });
  }
});

module.exports = router;

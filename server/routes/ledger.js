const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { calculateLeagueScores } = require('../services/scoringService');

router.post('/payouts', async (req, res) => {
  const { league_id, results, platform_fee = 0.02 } = req.body;
  if (!league_id || !Array.isArray(results) || results.length === 0) {
    return res.status(400).json({ error: 'league_id and results are required' });
  }

  try {
    const leagueResult = await db.query('SELECT * FROM leagues WHERE id = $1', [league_id]);
    if (leagueResult.rowCount === 0) return res.status(404).json({ error: 'League not found' });

    const league = leagueResult.rows[0];
    const totalPool = league.buy_in * results.length;
    const feeAmount = totalPool * platform_fee;
    const poolRemaining = totalPool - feeAmount;

    const payoutRules = league.payout_rules || { first: 0.6, second: 0.3, third: 0.1 };

    const ordered = results.sort((a, b) => b.score - a.score);

    const payouts = ordered.map((entry, index) => {
      const position = index + 1;
      let portion = 0;
      if (position === 1) portion = payoutRules.first || 0;
      if (position === 2) portion = payoutRules.second || 0;
      if (position === 3) portion = payoutRules.third || 0;
      return { ...entry, payout: Number((poolRemaining * portion).toFixed(2)) };
    });

    const persist = await Promise.all(
      payouts.map((p) => db.query(
        `INSERT INTO payouts (league_id, recipient_id, amount, status, metadata)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [league_id, p.entity_id || null, p.payout, 'pending', JSON.stringify({ position: p.position ?? null, score: p.score })]
      ))
    );

    return res.status(200).json({ totalPool, feeAmount, payments: persist.map((p) => p.rows[0]) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to compute payouts', details: error.message });
  }
});

router.get('/payouts/:leagueId', async (req, res) => {
  const leagueId = req.params.leagueId;
  const result = await db.query('SELECT * FROM payouts WHERE league_id = $1 ORDER BY created_at DESC', [leagueId]);
  return res.json(result.rows);
});

router.get('/scores/:leagueId', async (req, res) => {
  try {
    const scoreData = await calculateLeagueScores(req.params.leagueId);
    return res.json(scoreData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to calculate scores', details: error.message });
  }
});

module.exports = router;

router.post('/stripe/create-account', async (req, res) => {
  // Placeholder for Stripe Connect account creation
  // Implement serverless Stripe flow here
  return res.status(200).json({ message: 'Stubbed Stripe account endpoint' });
});

router.post('/stripe/transfer', async (req, res) => {
  // Placeholder for Stripe transfer handling
  return res.status(200).json({ message: 'Stubbed Stripe transfer endpoint' });
});

const db = require('../db/db');
const { calculateLeagueScores } = require('../services/scoringService');

let queue = [];

const enqueue = (item) => {
  queue.push(item);
};

const processLiveQueue = async () => {
  setInterval(async () => {
    if (!queue.length) return;
    const batch = queue.splice(0, queue.length);
    for (const item of batch) {
      const { matchId, entityId, sportId, raw_stats } = item;
      await db.query(
        `INSERT INTO match_data (match_id, entity_id, sport_id, raw_stats) VALUES ($1,$2,$3,$4)
         ON CONFLICT (match_id, entity_id) DO UPDATE SET raw_stats = EXCLUDED.raw_stats, updated_at = NOW()`,
        [matchId, entityId, sportId, raw_stats]
      );
    }
    // this would be where you trigger league score recompute + notifications
    console.log(`[LiveIngestion] Processed ${batch.length} items`);
  }, 4000);
};

module.exports = { enqueue, processLiveQueue };

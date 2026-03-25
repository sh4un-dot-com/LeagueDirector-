const db = require('../db/db');

const evaluateRule = (rule, rawStats = {}) => {
  const base = Number(rawStats[rule.action_key] ?? 0);
  if (Number.isNaN(base) || base === 0) return 0;

  const pointValue = Number(rule.point_value);
  if (Number.isNaN(pointValue)) return 0;

  let score = base * pointValue;

  if (rule.condition) {
    const cond = rule.condition;
    if (cond.if && !rawStats[cond.if]) return 0;

    if (cond.multiplier) score = score * Number(cond.multiplier);
    if (cond.per && Number(cond.per) > 0) score = (base / Number(cond.per)) * pointValue;
    if (cond.flat) score += Number(cond.flat);
  }

  return Number(score.toFixed(4));
};

const calculateEntityScore = (matchData, rules) => {
  if (!Array.isArray(rules)) return 0;
  return rules.reduce((acc, rule) => acc + evaluateRule(rule, matchData.raw_stats), 0);
};

const calculateLeagueScores = async (leagueId) => {
  const leagueRulesResult = await db.query('SELECT * FROM scoring_rules WHERE league_id = $1', [leagueId]);
  const rules = leagueRulesResult.rows;

  const matchesResult = await db.query(
    `SELECT m.id, m.entity_id, m.raw_stats, e.name AS entity_name
     FROM match_data m
     JOIN entities e ON e.id = m.entity_id
     WHERE m.sport_id IN (SELECT sport_id FROM leagues WHERE id = $1)`,
    [leagueId]
  );

  const byEntity = {};
  for (const match of matchesResult.rows) {
    const score = calculateEntityScore(match, rules);
    byEntity[match.entity_id] = {
      name: match.entity_name,
      score: Number(((byEntity[match.entity_id]?.score || 0) + score).toFixed(4)),
    };
  }

  return byEntity;
};

module.exports = { evaluateRule, calculateEntityScore, calculateLeagueScores };

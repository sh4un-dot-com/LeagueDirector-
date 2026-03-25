const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { log } = require('../utils/audit');

router.post('/', async (req, res) => {
  const { name, sport, description, rules, created_by } = req.body;
  if (!name || !sport || !Array.isArray(rules)) return res.status(400).json({ error: 'name, sport, rules required' });

  try {
    const result = await db.query(
      'INSERT INTO rule_templates (name, sport, description, rules, created_by) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, sport, description || null, JSON.stringify(rules), created_by || null]
    );
    await log({ entity_type: 'rule_template', entity_id: result.rows[0].id, action: 'create_rule_template', details: result.rows[0] });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create rule template', details: error.message });
  }
});

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM rule_templates ORDER BY created_at DESC');
  res.json(result.rows);
});

module.exports = router;

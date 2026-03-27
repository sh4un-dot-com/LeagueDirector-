const db = require('../db/db');

const log = async ({ entity_type, entity_id = null, action, operator_id = null, details = {} }) => {
  try {
    await db.query(
      `INSERT INTO audit_logs (entity_type, entity_id, action, operator_id, details) VALUES ($1, $2, $3, $4, $5)`,
      [entity_type, entity_id, action, operator_id, JSON.stringify(details)]
    );
  } catch (error) {
    console.error('Could not write audit log', error);
  }
};

module.exports = { log };

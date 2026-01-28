const { getDatabase } = require('../database/db');

class Metric {
  /**
   * Get all metrics for a startup
   */
  static getByStartupId(startupId) {
    const db = getDatabase();
    const stmt = db.prepare(
      'SELECT * FROM metrics WHERE startup_id = ? ORDER BY metric_date DESC'
    );
    return stmt.all(startupId);
  }

  /**
   * Get a single metric by ID
   */
  static getById(id) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM metrics WHERE id = ?');
    return stmt.get(id);
  }

  /**
   * Create a new metric record
   */
  static create(data) {
    const db = getDatabase();
    
    const stmt = db.prepare(`
      INSERT INTO metrics (startup_id, metric_date, monthly_users, monthly_revenue, burn_rate, runway_months, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      data.startup_id,
      data.metric_date,
      data.monthly_users,
      data.monthly_revenue,
      data.burn_rate,
      data.runway_months,
      data.notes
    );

    return this.getById(info.lastInsertRowid);
  }

  /**
   * Update a metric record
   */
  static update(id, data) {
    const db = getDatabase();
    
    const fields = [];
    const values = [];

    Object.keys(data).forEach(key => {
      if (key !== 'id' && data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);

    const stmt = db.prepare(`
      UPDATE metrics SET ${fields.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);
    return this.getById(id);
  }

  /**
   * Delete a metric record
   */
  static delete(id) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM metrics WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
}

module.exports = Metric;

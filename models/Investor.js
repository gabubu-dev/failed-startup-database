const { getDatabase } = require('../database/db');

class Investor {
  /**
   * Get all investors for a startup
   */
  static getByStartupId(startupId) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM investors WHERE startup_id = ?');
    return stmt.all(startupId);
  }

  /**
   * Get a single investor by ID
   */
  static getById(id) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM investors WHERE id = ?');
    return stmt.get(id);
  }

  /**
   * Create a new investor record
   */
  static create(data) {
    const db = getDatabase();
    
    const stmt = db.prepare(`
      INSERT INTO investors (startup_id, investor_name, investment_amount, investment_round, investment_date)
      VALUES (?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      data.startup_id,
      data.investor_name,
      data.investment_amount,
      data.investment_round,
      data.investment_date
    );

    return this.getById(info.lastInsertRowid);
  }

  /**
   * Update an investor record
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
      UPDATE investors SET ${fields.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);
    return this.getById(id);
  }

  /**
   * Delete an investor record
   */
  static delete(id) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM investors WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
}

module.exports = Investor;

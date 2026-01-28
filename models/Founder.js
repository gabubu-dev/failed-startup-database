const { getDatabase } = require('../database/db');

class Founder {
  /**
   * Get all founders for a startup
   */
  static getByStartupId(startupId) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM founders WHERE startup_id = ?');
    return stmt.all(startupId);
  }

  /**
   * Get a single founder by ID
   */
  static getById(id) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM founders WHERE id = ?');
    return stmt.get(id);
  }

  /**
   * Create a new founder
   */
  static create(data) {
    const db = getDatabase();
    
    const stmt = db.prepare(`
      INSERT INTO founders (startup_id, name, role, background, linkedin_url)
      VALUES (?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      data.startup_id,
      data.name,
      data.role,
      data.background,
      data.linkedin_url
    );

    return this.getById(info.lastInsertRowid);
  }

  /**
   * Update a founder
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
      UPDATE founders SET ${fields.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);
    return this.getById(id);
  }

  /**
   * Delete a founder
   */
  static delete(id) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM founders WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
}

module.exports = Founder;

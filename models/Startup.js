const { getDatabase } = require('../database/db');

class Startup {
  /**
   * Get all startups with optional filtering and pagination
   */
  static getAll(filters = {}) {
    const db = getDatabase();
    let query = 'SELECT * FROM startups WHERE 1=1';
    const params = [];

    if (filters.industry) {
      query += ' AND industry = ?';
      params.push(filters.industry);
    }

    if (filters.closed_year) {
      query += ' AND closed_year = ?';
      params.push(filters.closed_year);
    }

    if (filters.min_funding) {
      query += ' AND funding_raised >= ?';
      params.push(filters.min_funding);
    }

    query += ' ORDER BY closed_year DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(parseInt(filters.offset));
    }

    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Get a single startup by ID with all related data
   */
  static getById(id) {
    const db = getDatabase();
    
    const startup = db.prepare('SELECT * FROM startups WHERE id = ?').get(id);
    
    if (!startup) {
      return null;
    }

    // Get related founders
    startup.founders = db.prepare(
      'SELECT * FROM founders WHERE startup_id = ?'
    ).all(id);

    // Get related investors
    startup.investors = db.prepare(
      'SELECT * FROM investors WHERE startup_id = ?'
    ).all(id);

    // Get related metrics
    startup.metrics = db.prepare(
      'SELECT * FROM metrics WHERE startup_id = ? ORDER BY metric_date DESC'
    ).all(id);

    return startup;
  }

  /**
   * Create a new startup
   */
  static create(data) {
    const db = getDatabase();
    
    const stmt = db.prepare(`
      INSERT INTO startups (
        name, founded_year, closed_year, industry, funding_raised,
        valuation_peak, employee_count, headquarters, website,
        description, failure_reason, lessons_learned
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      data.name,
      data.founded_year,
      data.closed_year,
      data.industry,
      data.funding_raised || 0,
      data.valuation_peak,
      data.employee_count,
      data.headquarters,
      data.website,
      data.description,
      data.failure_reason,
      data.lessons_learned
    );

    return this.getById(info.lastInsertRowid);
  }

  /**
   * Update a startup
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

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`
      UPDATE startups SET ${fields.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);
    return this.getById(id);
  }

  /**
   * Delete a startup
   */
  static delete(id) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM startups WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }

  /**
   * Get statistics
   */
  static getStats() {
    const db = getDatabase();
    
    return {
      total_startups: db.prepare('SELECT COUNT(*) as count FROM startups').get().count,
      total_funding_lost: db.prepare('SELECT SUM(funding_raised) as total FROM startups').get().total || 0,
      industries: db.prepare(`
        SELECT industry, COUNT(*) as count 
        FROM startups 
        GROUP BY industry 
        ORDER BY count DESC
      `).all(),
      by_year: db.prepare(`
        SELECT closed_year, COUNT(*) as count 
        FROM startups 
        WHERE closed_year IS NOT NULL
        GROUP BY closed_year 
        ORDER BY closed_year DESC
      `).all()
    };
  }
}

module.exports = Startup;

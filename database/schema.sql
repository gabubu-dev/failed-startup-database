-- Failed Startup Database Schema

CREATE TABLE IF NOT EXISTS startups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    founded_year INTEGER,
    closed_year INTEGER,
    industry TEXT NOT NULL,
    funding_raised REAL DEFAULT 0,
    valuation_peak REAL,
    employee_count INTEGER,
    headquarters TEXT,
    website TEXT,
    description TEXT,
    failure_reason TEXT NOT NULL,
    lessons_learned TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS founders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startup_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    role TEXT,
    background TEXT,
    linkedin_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS investors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startup_id INTEGER NOT NULL,
    investor_name TEXT NOT NULL,
    investment_amount REAL,
    investment_round TEXT,
    investment_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startup_id INTEGER NOT NULL,
    metric_date TEXT NOT NULL,
    monthly_users INTEGER,
    monthly_revenue REAL,
    burn_rate REAL,
    runway_months INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_startups_industry ON startups(industry);
CREATE INDEX IF NOT EXISTS idx_startups_closed_year ON startups(closed_year);
CREATE INDEX IF NOT EXISTS idx_founders_startup_id ON founders(startup_id);
CREATE INDEX IF NOT EXISTS idx_investors_startup_id ON investors(startup_id);
CREATE INDEX IF NOT EXISTS idx_metrics_startup_id ON metrics(startup_id);

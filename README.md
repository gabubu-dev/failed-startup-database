# 💀 Failed Startup Database

A comprehensive database and REST API documenting failed startups, their founders, investors, and the lessons learned from their failures. Learn from others' mistakes!

## 🎯 Purpose

This project aims to create a valuable resource for entrepreneurs, investors, and researchers by cataloging high-profile startup failures with detailed information about:
- What went wrong
- How much money was lost
- Key metrics during their decline
- Lessons learned for future founders

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd failed-startup-database

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Initialize and seed the database
npm run seed

# Start the server
npm start
```

The API will be available at `http://localhost:3000`

## 📊 Database Schema

### Startups
The main table containing information about failed startups:
- `id` - Unique identifier
- `name` - Company name
- `founded_year` - Year the company was founded
- `closed_year` - Year the company shut down
- `industry` - Business sector (e.g., E-commerce, Healthcare)
- `funding_raised` - Total funding raised in USD
- `valuation_peak` - Peak valuation in USD
- `employee_count` - Maximum number of employees
- `headquarters` - Location of headquarters
- `website` - Company website (archived)
- `description` - Brief description of the business
- `failure_reason` - What went wrong
- `lessons_learned` - Key takeaways for future entrepreneurs

### Founders
Information about startup founders:
- `id` - Unique identifier
- `startup_id` - Foreign key to startups table
- `name` - Founder's name
- `role` - Position in the company
- `background` - Previous experience
- `linkedin_url` - LinkedIn profile

### Investors
Investment records:
- `id` - Unique identifier
- `startup_id` - Foreign key to startups table
- `investor_name` - Name of investor or firm
- `investment_amount` - Amount invested in USD
- `investment_round` - Funding round (Seed, Series A, etc.)
- `investment_date` - Date of investment

### Metrics
Historical performance metrics:
- `id` - Unique identifier
- `startup_id` - Foreign key to startups table
- `metric_date` - Date of measurement
- `monthly_users` - Number of active users
- `monthly_revenue` - Revenue for the month in USD
- `burn_rate` - Monthly cash burn in USD
- `runway_months` - Remaining months of runway
- `notes` - Additional context

## 🔌 API Endpoints

### Root
```
GET /
Returns API information and available endpoints
```

### Health Check
```
GET /health
Returns server health status
```

### Startups

#### Get All Startups
```
GET /api/startups
Query Parameters:
  - industry: Filter by industry
  - closed_year: Filter by year of closure
  - min_funding: Minimum funding raised
  - limit: Number of results (pagination)
  - offset: Skip results (pagination)

Response:
{
  "success": true,
  "count": 8,
  "data": [...]
}
```

#### Get Startup by ID
```
GET /api/startups/:id
Returns detailed information including founders, investors, and metrics

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Juicero",
    ...
    "founders": [...],
    "investors": [...],
    "metrics": [...]
  }
}
```

#### Create Startup
```
POST /api/startups
Body (required fields):
{
  "name": "string",
  "industry": "string",
  "failure_reason": "string"
}

Optional fields: founded_year, closed_year, funding_raised, valuation_peak, 
employee_count, headquarters, website, description, lessons_learned
```

#### Update Startup
```
PUT /api/startups/:id
Body: Any startup fields to update
```

#### Delete Startup
```
DELETE /api/startups/:id
Deletes startup and all related data (founders, investors, metrics)
```

#### Get Statistics
```
GET /api/startups/stats
Returns aggregated statistics about all startups

Response:
{
  "success": true,
  "data": {
    "total_startups": 8,
    "total_funding_lost": 12345678900,
    "industries": [...],
    "by_year": [...]
  }
}
```

### Founders

#### Get Founder by ID
```
GET /api/founders/:id
```

#### Create Founder
```
POST /api/founders
Body (required):
{
  "startup_id": integer,
  "name": "string"
}

Optional: role, background, linkedin_url
```

#### Update Founder
```
PUT /api/founders/:id
Body: Any founder fields to update
```

#### Delete Founder
```
DELETE /api/founders/:id
```

### Investors

#### Get Investor by ID
```
GET /api/investors/:id
```

#### Create Investor
```
POST /api/investors
Body (required):
{
  "startup_id": integer,
  "investor_name": "string"
}

Optional: investment_amount, investment_round, investment_date
```

#### Update Investor
```
PUT /api/investors/:id
Body: Any investor fields to update
```

#### Delete Investor
```
DELETE /api/investors/:id
```

### Metrics

#### Get Metric by ID
```
GET /api/metrics/:id
```

#### Create Metric
```
POST /api/metrics
Body (required):
{
  "startup_id": integer,
  "metric_date": "YYYY-MM-DD"
}

Optional: monthly_users, monthly_revenue, burn_rate, runway_months, notes
```

#### Update Metric
```
PUT /api/metrics/:id
Body: Any metric fields to update
```

#### Delete Metric
```
DELETE /api/metrics/:id
```

## 📝 Example Usage

### Get all e-commerce failures
```bash
curl "http://localhost:3000/api/startups?industry=E-commerce"
```

### Get a specific startup with all details
```bash
curl "http://localhost:3000/api/startups/1"
```

### Create a new failed startup entry
```bash
curl -X POST http://localhost:3000/api/startups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MyFailedStartup",
    "industry": "Tech",
    "founded_year": 2020,
    "closed_year": 2023,
    "funding_raised": 5000000,
    "failure_reason": "Product-market fit issues",
    "lessons_learned": "Should have talked to more customers"
  }'
```

### Get statistics
```bash
curl "http://localhost:3000/api/startups/stats"
```

## 🔧 Development

### Run in Development Mode
```bash
npm run dev
```
Uses nodemon for auto-reloading on file changes.

### Reseed Database
```bash
npm run seed
```
Clears existing data and loads sample failed startups.

## 🗂️ Project Structure

```
failed-startup-database/
├── database/
│   ├── db.js              # Database connection and initialization
│   ├── schema.sql         # Database schema definition
│   └── startups.db        # SQLite database file (created on init)
├── models/
│   ├── Startup.js         # Startup model with CRUD operations
│   ├── Founder.js         # Founder model
│   ├── Investor.js        # Investor model
│   └── Metric.js          # Metric model
├── routes/
│   ├── startups.js        # Startup API endpoints
│   ├── founders.js        # Founder API endpoints
│   ├── investors.js       # Investor API endpoints
│   └── metrics.js         # Metric API endpoints
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies and scripts
├── server.js             # Express server setup
├── seed.js               # Database seeding script
└── README.md             # This file
```

## 🎓 Lessons Learned (Meta)

This database itself teaches valuable lessons by documenting others' failures:

1. **Product-Market Fit** - Build something people actually want (Juicero, Color Labs)
2. **Unit Economics** - Make sure your business model actually works (Pets.com, Webvan)
3. **Timing Matters** - Even good ideas can fail at the wrong time (Webvan vs. Instacart)
4. **Transparency & Ethics** - Fraud never ends well (Theranos)
5. **Sustainable Growth** - Don't grow faster than you can afford (WeWork, Webvan)
6. **Content is King** - Platform alone isn't enough (Quibi)
7. **Creator Economy** - Support your power users (Vine)

## 🤝 Contributing

Contributions are welcome! To add more failed startups:

1. Fork the repository
2. Add new entries to `seed.js`
3. Ensure data accuracy with credible sources
4. Submit a pull request

Please include:
- Company name and basic info
- Accurate funding and timeline data
- Clear failure reasons
- Actionable lessons learned
- Sources/references when possible

## 📚 Data Sources

Data in this database comes from:
- TechCrunch, The Verge, and other tech news outlets
- CB Insights failure post-mortems
- Crunchbase funding data
- Public SEC filings
- Founder interviews and retrospectives

## ⚖️ License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- All the founders who had the courage to try
- Investors who took risks on new ideas
- Reporters who documented these stories
- The startup community that learns from failure

---

**Remember**: Every successful entrepreneur has failed multiple times. This database exists not to shame, but to educate and prevent future failures.

*"Failure is simply the opportunity to begin again, this time more intelligently." - Henry Ford*

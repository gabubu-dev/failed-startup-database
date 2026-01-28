require('dotenv').config();
const { initDatabase, closeDatabase } = require('./database/db');
const Startup = require('./models/Startup');
const Founder = require('./models/Founder');
const Investor = require('./models/Investor');
const Metric = require('./models/Metric');

console.log('🌱 Starting database seeding...\n');

// Initialize database
initDatabase();

// Sample data for failed startups
const startupsData = [
  {
    name: 'Juicero',
    founded_year: 2013,
    closed_year: 2017,
    industry: 'Consumer Electronics',
    funding_raised: 120000000,
    valuation_peak: 120000000,
    employee_count: 120,
    headquarters: 'San Francisco, CA',
    website: 'https://www.juicero.com',
    description: 'A $400 WiFi-connected juicer that squeezed juice from proprietary packets.',
    failure_reason: 'Over-engineering and high price point. Reporters discovered you could squeeze the packets by hand, making the expensive machine unnecessary.',
    lessons_learned: 'Sometimes the simplest solution is the best. Don\'t over-engineer products. Understand your value proposition.'
  },
  {
    name: 'Theranos',
    founded_year: 2003,
    closed_year: 2018,
    industry: 'Healthcare',
    funding_raised: 700000000,
    valuation_peak: 9000000000,
    employee_count: 800,
    headquarters: 'Palo Alto, CA',
    website: 'https://www.theranos.com',
    description: 'Claimed to revolutionize blood testing with technology that could run hundreds of tests from a single drop of blood.',
    failure_reason: 'Fraudulent claims about technology capabilities. The technology never actually worked as advertised.',
    lessons_learned: 'Honesty and transparency are critical. You can\'t fake technology or science. Due diligence matters.'
  },
  {
    name: 'Quibi',
    founded_year: 2018,
    closed_year: 2020,
    industry: 'Entertainment',
    funding_raised: 1800000000,
    valuation_peak: 1800000000,
    employee_count: 200,
    headquarters: 'Los Angeles, CA',
    website: 'https://www.quibi.com',
    description: 'A short-form streaming service designed for mobile viewing with 10-minute episodes.',
    failure_reason: 'Poor timing (launched during COVID-19 when mobile viewing decreased), lack of compelling content, and no social sharing features.',
    lessons_learned: 'Product-market fit matters more than funding. Listen to what users actually want. Timing is everything.'
  },
  {
    name: 'WeWork',
    founded_year: 2010,
    closed_year: 2019,
    industry: 'Real Estate',
    funding_raised: 12800000000,
    valuation_peak: 47000000000,
    employee_count: 12500,
    headquarters: 'New York, NY',
    website: 'https://www.wework.com',
    description: 'Co-working space provider that positioned itself as a tech company rather than a real estate business.',
    failure_reason: 'Massive overvaluation, unsustainable business model, corporate governance issues, and questionable leadership decisions.',
    lessons_learned: 'Don\'t confuse a real estate business with a tech company. Unit economics must work. Corporate governance matters.'
  },
  {
    name: 'Pets.com',
    founded_year: 1998,
    closed_year: 2000,
    industry: 'E-commerce',
    funding_raised: 300000000,
    valuation_peak: 290000000,
    employee_count: 320,
    headquarters: 'San Francisco, CA',
    website: 'https://www.pets.com',
    description: 'Online pet supply retailer famous for its sock puppet mascot.',
    failure_reason: 'Spending heavily on marketing without a sustainable business model. Shipping costs exceeded product margins.',
    lessons_learned: 'Branding isn\'t enough. Unit economics must work. The dot-com bubble taught expensive lessons.'
  },
  {
    name: 'Vine',
    founded_year: 2012,
    closed_year: 2017,
    industry: 'Social Media',
    funding_raised: 30000000,
    valuation_peak: 30000000,
    employee_count: 50,
    headquarters: 'New York, NY',
    website: 'https://vine.co',
    description: '6-second looping video sharing app acquired by Twitter.',
    failure_reason: 'Failed to monetize creators, competition from Instagram and Snapchat, and neglect from parent company Twitter.',
    lessons_learned: 'Keep your creators happy. Innovate or die. Parent company support is crucial for acquired startups.'
  },
  {
    name: 'Webvan',
    founded_year: 1996,
    closed_year: 2001,
    industry: 'E-commerce',
    funding_raised: 800000000,
    valuation_peak: 1200000000,
    employee_count: 2000,
    headquarters: 'Foster City, CA',
    website: 'https://www.webvan.com',
    description: 'Online grocery delivery service that was ahead of its time.',
    failure_reason: 'Expanded too quickly, built expensive infrastructure before proving demand, and burned through cash.',
    lessons_learned: 'Prove your model before scaling. The right idea at the wrong time can still fail. Cash burn matters.'
  },
  {
    name: 'Color Labs',
    founded_year: 2011,
    closed_year: 2015,
    industry: 'Social Media',
    funding_raised: 41000000,
    valuation_peak: 100000000,
    employee_count: 70,
    headquarters: 'Palo Alto, CA',
    website: 'https://www.color.com',
    description: 'Photo-sharing app that allowed you to see photos taken by people nearby.',
    failure_reason: 'Raised too much money before product-market fit, confusing user experience, and unclear value proposition.',
    lessons_learned: 'Don\'t raise too much too early. Make sure users understand your product. Privacy concerns matter.'
  }
];

try {
  // Clear existing data
  console.log('Clearing existing data...');
  const db = require('./database/db').getDatabase();
  db.exec('DELETE FROM metrics');
  db.exec('DELETE FROM investors');
  db.exec('DELETE FROM founders');
  db.exec('DELETE FROM startups');
  console.log('✓ Existing data cleared\n');

  // Seed startups
  console.log('Seeding startups...');
  const createdStartups = [];
  
  for (const startupData of startupsData) {
    const startup = Startup.create(startupData);
    createdStartups.push(startup);
    console.log(`  ✓ Created: ${startup.name}`);
  }

  console.log(`\n✓ Created ${createdStartups.length} startups\n`);

  // Seed founders
  console.log('Seeding founders...');
  const foundersData = [
    { startup_id: createdStartups[0].id, name: 'Doug Evans', role: 'CEO & Founder', background: 'Former organic juice company founder' },
    { startup_id: createdStartups[1].id, name: 'Elizabeth Holmes', role: 'CEO & Founder', background: 'Stanford dropout, youngest self-made female billionaire' },
    { startup_id: createdStartups[1].id, name: 'Ramesh Balwani', role: 'COO & President', background: 'Former Microsoft executive' },
    { startup_id: createdStartups[2].id, name: 'Jeffrey Katzenberg', role: 'Founder', background: 'Former Disney and DreamWorks executive' },
    { startup_id: createdStartups[2].id, name: 'Meg Whitman', role: 'CEO', background: 'Former eBay and HP CEO' },
    { startup_id: createdStartups[3].id, name: 'Adam Neumann', role: 'CEO & Co-Founder', background: 'Serial entrepreneur, controversial leadership style' },
    { startup_id: createdStartups[3].id, name: 'Miguel McKelvey', role: 'Co-Founder', background: 'Architect and designer' },
    { startup_id: createdStartups[4].id, name: 'Julie Wainwright', role: 'CEO', background: 'Experienced tech executive' },
    { startup_id: createdStartups[5].id, name: 'Dom Hofmann', role: 'Co-Founder', background: 'Software developer' },
    { startup_id: createdStartups[5].id, name: 'Rus Yusupov', role: 'Co-Founder', background: 'Designer and entrepreneur' },
    { startup_id: createdStartups[5].id, name: 'Colin Kroll', role: 'Co-Founder', background: 'Engineer' },
    { startup_id: createdStartups[6].id, name: 'Louis Borders', role: 'Founder', background: 'Borders Books co-founder' },
    { startup_id: createdStartups[7].id, name: 'Bill Nguyen', role: 'Founder & CEO', background: 'Serial entrepreneur (LaLa, Lala.com)' }
  ];

  for (const founderData of foundersData) {
    Founder.create(founderData);
  }
  console.log(`✓ Created ${foundersData.length} founders\n`);

  // Seed investors
  console.log('Seeding investors...');
  const investorsData = [
    { startup_id: createdStartups[0].id, investor_name: 'Kleiner Perkins', investment_amount: 70000000, investment_round: 'Series C', investment_date: '2016-03-01' },
    { startup_id: createdStartups[0].id, investor_name: 'Google Ventures', investment_amount: 50000000, investment_round: 'Series B', investment_date: '2015-06-01' },
    { startup_id: createdStartups[1].id, investor_name: 'Rupert Murdoch', investment_amount: 125000000, investment_round: 'Series C', investment_date: '2015-01-01' },
    { startup_id: createdStartups[1].id, investor_name: 'Larry Ellison', investment_amount: 100000000, investment_round: 'Series B', investment_date: '2014-01-01' },
    { startup_id: createdStartups[1].id, investor_name: 'Walgreens', investment_amount: 140000000, investment_round: 'Partnership', investment_date: '2013-09-01' },
    { startup_id: createdStartups[2].id, investor_name: 'Various Investors', investment_amount: 1800000000, investment_round: 'Pre-launch', investment_date: '2018-01-01' },
    { startup_id: createdStartups[3].id, investor_name: 'SoftBank Vision Fund', investment_amount: 4400000000, investment_round: 'Series G', investment_date: '2017-08-01' },
    { startup_id: createdStartups[3].id, investor_name: 'Benchmark', investment_amount: 150000000, investment_round: 'Series A', investment_date: '2012-12-01' },
    { startup_id: createdStartups[4].id, investor_name: 'Amazon', investment_amount: 50000000, investment_round: 'Strategic', investment_date: '1999-03-01' },
    { startup_id: createdStartups[5].id, investor_name: 'Twitter (acquisition)', investment_amount: 30000000, investment_round: 'Acquisition', investment_date: '2012-10-01' },
    { startup_id: createdStartups[6].id, investor_name: 'Sequoia Capital', investment_amount: 275000000, investment_round: 'Series B', investment_date: '1999-06-01' },
    { startup_id: createdStartups[7].id, investor_name: 'Sequoia Capital', investment_amount: 41000000, investment_round: 'Series A', investment_date: '2011-03-01' }
  ];

  for (const investorData of investorsData) {
    Investor.create(investorData);
  }
  console.log(`✓ Created ${investorsData.length} investors\n`);

  // Seed metrics for a few startups
  console.log('Seeding metrics...');
  const metricsData = [
    // Juicero metrics
    { startup_id: createdStartups[0].id, metric_date: '2016-03-01', monthly_users: 1000, monthly_revenue: 400000, burn_rate: 5000000, runway_months: 24 },
    { startup_id: createdStartups[0].id, metric_date: '2016-09-01', monthly_users: 3000, monthly_revenue: 1200000, burn_rate: 6000000, runway_months: 18 },
    { startup_id: createdStartups[0].id, metric_date: '2017-03-01', monthly_users: 5000, monthly_revenue: 2000000, burn_rate: 8000000, runway_months: 6, notes: 'Bad press about hand-squeezing' },
    
    // Quibi metrics
    { startup_id: createdStartups[2].id, metric_date: '2020-04-01', monthly_users: 1700000, monthly_revenue: 0, burn_rate: 100000000, runway_months: 12, notes: 'Launch month' },
    { startup_id: createdStartups[2].id, metric_date: '2020-06-01', monthly_users: 1500000, monthly_revenue: 500000, burn_rate: 100000000, runway_months: 10, notes: 'User retention poor' },
    { startup_id: createdStartups[2].id, metric_date: '2020-09-01', monthly_users: 700000, monthly_revenue: 300000, burn_rate: 90000000, runway_months: 6, notes: 'Considering shutdown' },
    
    // WeWork metrics
    { startup_id: createdStartups[3].id, metric_date: '2018-12-01', monthly_users: 400000, monthly_revenue: 150000000, burn_rate: 200000000, runway_months: 48 },
    { startup_id: createdStartups[3].id, metric_date: '2019-06-01', monthly_users: 500000, monthly_revenue: 200000000, burn_rate: 250000000, runway_months: 36, notes: 'Preparing for IPO' },
    { startup_id: createdStartups[3].id, metric_date: '2019-09-01', monthly_users: 520000, monthly_revenue: 210000000, burn_rate: 300000000, runway_months: 12, notes: 'IPO failed, CEO out' }
  ];

  for (const metricData of metricsData) {
    Metric.create(metricData);
  }
  console.log(`✓ Created ${metricsData.length} metrics\n`);

  // Display summary
  console.log('═══════════════════════════════════════');
  console.log('🎉 Seeding completed successfully!');
  console.log('═══════════════════════════════════════');
  console.log(`✓ ${createdStartups.length} startups`);
  console.log(`✓ ${foundersData.length} founders`);
  console.log(`✓ ${investorsData.length} investors`);
  console.log(`✓ ${metricsData.length} metrics`);
  console.log('═══════════════════════════════════════\n');

  // Display some stats
  const stats = Startup.getStats();
  console.log('📊 Database Statistics:');
  console.log(`   Total funding lost: $${(stats.total_funding_lost / 1000000000).toFixed(2)}B`);
  console.log(`   Industries represented: ${stats.industries.length}`);
  console.log(`   Years covered: ${stats.by_year.length}`);
  console.log('\n✨ Database is ready to use!\n');

} catch (error) {
  console.error('\n❌ Seeding failed:', error);
  process.exit(1);
} finally {
  closeDatabase();
}

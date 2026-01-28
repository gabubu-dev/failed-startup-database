const express = require('express');
const router = express.Router();
const Startup = require('../models/Startup');

/**
 * GET /api/startups
 * Get all startups with optional filters
 */
router.get('/', (req, res) => {
  try {
    const filters = {
      industry: req.query.industry,
      closed_year: req.query.closed_year,
      min_funding: req.query.min_funding,
      limit: req.query.limit,
      offset: req.query.offset
    };

    const startups = Startup.getAll(filters);
    res.json({
      success: true,
      count: startups.length,
      data: startups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/startups/stats
 * Get statistics about failed startups
 */
router.get('/stats', (req, res) => {
  try {
    const stats = Startup.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/startups/:id
 * Get a single startup by ID with all related data
 */
router.get('/:id', (req, res) => {
  try {
    const startup = Startup.getById(req.params.id);
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        error: 'Startup not found'
      });
    }

    res.json({
      success: true,
      data: startup
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/startups
 * Create a new startup
 */
router.post('/', (req, res) => {
  try {
    const requiredFields = ['name', 'industry', 'failure_reason'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const startup = Startup.create(req.body);
    res.status(201).json({
      success: true,
      data: startup
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/startups/:id
 * Update a startup
 */
router.put('/:id', (req, res) => {
  try {
    const startup = Startup.update(req.params.id, req.body);
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        error: 'Startup not found'
      });
    }

    res.json({
      success: true,
      data: startup
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/startups/:id
 * Delete a startup
 */
router.delete('/:id', (req, res) => {
  try {
    const deleted = Startup.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Startup not found'
      });
    }

    res.json({
      success: true,
      message: 'Startup deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

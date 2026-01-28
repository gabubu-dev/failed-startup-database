const express = require('express');
const router = express.Router();
const Investor = require('../models/Investor');

/**
 * GET /api/investors/:id
 * Get a single investor by ID
 */
router.get('/:id', (req, res) => {
  try {
    const investor = Investor.getById(req.params.id);
    
    if (!investor) {
      return res.status(404).json({
        success: false,
        error: 'Investor not found'
      });
    }

    res.json({
      success: true,
      data: investor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/investors
 * Create a new investor record
 */
router.post('/', (req, res) => {
  try {
    const requiredFields = ['startup_id', 'investor_name'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const investor = Investor.create(req.body);
    res.status(201).json({
      success: true,
      data: investor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/investors/:id
 * Update an investor record
 */
router.put('/:id', (req, res) => {
  try {
    const investor = Investor.update(req.params.id, req.body);
    
    if (!investor) {
      return res.status(404).json({
        success: false,
        error: 'Investor not found'
      });
    }

    res.json({
      success: true,
      data: investor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/investors/:id
 * Delete an investor record
 */
router.delete('/:id', (req, res) => {
  try {
    const deleted = Investor.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Investor not found'
      });
    }

    res.json({
      success: true,
      message: 'Investor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

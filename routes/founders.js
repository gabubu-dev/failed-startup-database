const express = require('express');
const router = express.Router();
const Founder = require('../models/Founder');

/**
 * GET /api/founders/:id
 * Get a single founder by ID
 */
router.get('/:id', (req, res) => {
  try {
    const founder = Founder.getById(req.params.id);
    
    if (!founder) {
      return res.status(404).json({
        success: false,
        error: 'Founder not found'
      });
    }

    res.json({
      success: true,
      data: founder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/founders
 * Create a new founder
 */
router.post('/', (req, res) => {
  try {
    const requiredFields = ['startup_id', 'name'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const founder = Founder.create(req.body);
    res.status(201).json({
      success: true,
      data: founder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/founders/:id
 * Update a founder
 */
router.put('/:id', (req, res) => {
  try {
    const founder = Founder.update(req.params.id, req.body);
    
    if (!founder) {
      return res.status(404).json({
        success: false,
        error: 'Founder not found'
      });
    }

    res.json({
      success: true,
      data: founder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/founders/:id
 * Delete a founder
 */
router.delete('/:id', (req, res) => {
  try {
    const deleted = Founder.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Founder not found'
      });
    }

    res.json({
      success: true,
      message: 'Founder deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

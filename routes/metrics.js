const express = require('express');
const router = express.Router();
const Metric = require('../models/Metric');

/**
 * GET /api/metrics/:id
 * Get a single metric by ID
 */
router.get('/:id', (req, res) => {
  try {
    const metric = Metric.getById(req.params.id);
    
    if (!metric) {
      return res.status(404).json({
        success: false,
        error: 'Metric not found'
      });
    }

    res.json({
      success: true,
      data: metric
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/metrics
 * Create a new metric record
 */
router.post('/', (req, res) => {
  try {
    const requiredFields = ['startup_id', 'metric_date'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const metric = Metric.create(req.body);
    res.status(201).json({
      success: true,
      data: metric
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/metrics/:id
 * Update a metric record
 */
router.put('/:id', (req, res) => {
  try {
    const metric = Metric.update(req.params.id, req.body);
    
    if (!metric) {
      return res.status(404).json({
        success: false,
        error: 'Metric not found'
      });
    }

    res.json({
      success: true,
      data: metric
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/metrics/:id
 * Delete a metric record
 */
router.delete('/:id', (req, res) => {
  try {
    const deleted = Metric.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Metric not found'
      });
    }

    res.json({
      success: true,
      message: 'Metric deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

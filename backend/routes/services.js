const express = require('express');
const { body, validationResult } = require('express-validator');
const Service = require('../models/Service');
const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const { category, active, search } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by active status
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const services = await Service.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: services.length,
      services
    });

  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch services'
    });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).lean();
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.json({
      success: true,
      service
    });

  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service'
    });
  }
});

// Create new service (Admin only)
router.post('/', [
  body('title').notEmpty().trim(),
  body('titleAr').notEmpty().trim(),
  body('description').notEmpty(),
  body('descriptionAr').notEmpty(),
  body('category').isIn(['travel', 'labor', 'documents', 'visas', 'government', 'processing'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const service = new Service(req.body);
    await service.save();

    res.status(201).json({
      success: true,
      service,
      message: 'Service created successfully'
    });

  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create service'
    });
  }
});

// Update service (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.json({
      success: true,
      service,
      message: 'Service updated successfully'
    });

  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update service'
    });
  }
});

// Delete service (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete service'
    });
  }
});

module.exports = router;
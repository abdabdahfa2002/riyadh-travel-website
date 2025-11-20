const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const whatsappService = require('../services/whatsapp');
const router = express.Router();

// Create new booking
router.post('/', [
  body('customerInfo.fullName').notEmpty().trim(),
  body('customerInfo.phoneNumber').isMobilePhone('any'),
  body('serviceDetails.serviceId').isMongoId(),
  body('paymentInfo.totalAmount').isNumeric().custom(value => value > 0)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Verify service exists
    const service = await Service.findById(req.body.serviceDetails.serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    // Create booking
    const bookingData = {
      ...req.body,
      serviceDetails: {
        ...req.body.serviceDetails,
        serviceTitle: service.title,
        serviceTitleAr: service.titleAr
      }
    };

    const booking = new Booking(bookingData);
    await booking.save();

    // Send WhatsApp notification
    const whatsappSent = await whatsappService.sendBookingNotification(booking);
    
    // Update communication status
    booking.communications.whatsappSent = whatsappSent;
    booking.communications.lastContact = new Date();
    await booking.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('new_booking', {
        bookingId: booking.bookingId,
        customerName: booking.customerInfo.fullName,
        serviceTitle: booking.serviceDetails.serviceTitleAr,
        timestamp: booking.createdAt
      });
    }

    res.status(201).json({
      success: true,
      booking,
      whatsappSent,
      message: 'Booking created successfully'
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking'
    });
  }
});

// Get all bookings (Admin)
router.get('/', async (req, res) => {
  try {
    const { status, phone, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.bookingStatus = status;
    }
    
    // Filter by phone number
    if (phone) {
      query['customerInfo.phoneNumber'] = { $regex: phone, $options: 'i' };
    }
    
    // Text search
    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { 'customerInfo.fullName': { $regex: search, $options: 'i' } },
        { 'serviceDetails.serviceTitleAr': { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(query)
      .populate('serviceDetails.serviceId', 'title titleAr category')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
});

// Get booking by ID
router.get('/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId })
      .populate('serviceDetails.serviceId')
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking'
    });
  }
});

// Update booking status (Admin)
router.patch('/:bookingId/status', [
  body('status').isIn(['pending', 'confirmed', 'processing', 'completed', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const booking = await Booking.findOne({ bookingId: req.params.bookingId });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Update status
    booking.bookingStatus = req.body.status;
    booking.updatedAt = Date.now();
    await booking.save();

    // Send status update via WhatsApp
    if (req.body.notifyCustomer !== false) {
      const statusMessages = {
        pending: 'تم استلام طلبك وهو قيد المراجعة ⏳',
        confirmed: 'تم تأكيد طلبك! ✅',
        processing: 'طلبك قيد التنفيذ 🔄',
        completed: 'تم إنجاز طلبك بنجاح! 🎉',
        cancelled: 'تم إلغاء طلبك ❌'
      };

      const message = `${statusMessages[req.body.status]}

رقم الطلب: ${booking.bookingId}
الخدمة: ${booking.serviceDetails.serviceTitleAr}

للمزيد من المعلومات تواصل معنا.`;

      await whatsappService.sendServiceUpdate(
        booking.customerInfo.phoneNumber,
        message
      );
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('booking_status_update', {
        bookingId: booking.bookingId,
        status: booking.bookingStatus,
        timestamp: booking.updatedAt
      });
    }

    res.json({
      success: true,
      booking,
      message: 'Booking status updated successfully'
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update booking status'
    });
  }
});

// Add note to booking (Admin)
router.patch('/:bookingId/notes', [
  body('note').isString().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const booking = await Booking.findOne({ bookingId: req.params.bookingId });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Add note
    if (req.body.adminNote) {
      booking.notes.admin = req.body.adminNote;
    }
    if (req.body.customerNote) {
      booking.notes.customer = req.body.customerNote;
    }
    
    booking.updatedAt = Date.now();
    await booking.save();

    res.json({
      success: true,
      booking,
      message: 'Note added successfully'
    });

  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add note'
    });
  }
});

module.exports = router;
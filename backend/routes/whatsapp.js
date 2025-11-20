const express = require('express');
const whatsappService = require('../services/whatsapp');
const router = express.Router();

// Get WhatsApp service status
router.get('/status', (req, res) => {
  try {
    const status = whatsappService.getStatus();
    
    res.json({
      success: true,
      whatsapp: {
        connected: status.connected,
        ready: status.isReady,
        hasQRCode: status.hasQRCode,
        status: status.connected ? 'connected' : 'disconnected',
        message: status.connected 
          ? 'WhatsApp service is running' 
          : 'WhatsApp service is offline'
      }
    });

  } catch (error) {
    console.error('Error getting WhatsApp status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get WhatsApp status'
    });
  }
});

// Get QR code for WhatsApp pairing (Admin)
router.get('/qr-code', (req, res) => {
  try {
    const status = whatsappService.getStatus();
    
    if (!status.hasQRCode) {
      return res.status(404).json({
        success: false,
        error: 'QR code not available. Service may need to be restarted.'
      });
    }

    // The QR code is generated and sent via WebSocket
    res.json({
      success: true,
      message: 'QR code will be sent via WebSocket',
      note: 'Please connect to WebSocket to receive the QR code'
    });

  } catch (error) {
    console.error('Error getting QR code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get QR code'
    });
  }
});

// Send manual WhatsApp message (Admin)
router.post('/send-message', async (req, res) => {
  try {
    const { phoneNumber, message, type = 'text' } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and message are required'
      });
    }

    const status = whatsappService.getStatus();
    if (!status.connected) {
      return res.status(503).json({
        success: false,
        error: 'WhatsApp service is not connected'
      });
    }

    let sent = false;
    try {
      if (type === 'text') {
        sent = await whatsappService.sendServiceUpdate(phoneNumber, message);
      } else {
        return res.status(400).json({
          success: false,
          error: 'Only text messages are currently supported'
        });
      }
    } catch (sendError) {
      console.error('Error sending WhatsApp message:', sendError);
    }

    res.json({
      success: sent,
      message: sent ? 'Message sent successfully' : 'Failed to send message',
      details: {
        phoneNumber,
        messageLength: message.length,
        type
      }
    });

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process WhatsApp message request'
    });
  }
});

// Send booking confirmation (for testing)
router.post('/test-booking', async (req, res) => {
  try {
    const testBooking = {
      bookingId: 'TEST' + Date.now(),
      customerInfo: {
        fullName: req.body.name || 'عميل تجريبي',
        phoneNumber: req.body.phone || '+966501234567'
      },
      serviceDetails: {
        serviceTitle: 'Test Service',
        serviceTitleAr: 'خدمة تجريبية'
      },
      paymentInfo: {
        totalAmount: 100,
        currency: 'SAR'
      }
    };

    const sent = await whatsappService.sendBookingNotification(testBooking);

    res.json({
      success: sent,
      message: sent ? 'Test booking notification sent' : 'Failed to send test notification',
      testBooking
    });

  } catch (error) {
    console.error('Error sending test booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test booking notification'
    });
  }
});

// Restart WhatsApp service (Admin)
router.post('/restart', async (req, res) => {
  try {
    // This would typically involve restarting the WhatsApp service
    // For security reasons, this should be implemented with proper authentication
    
    res.json({
      success: true,
      message: 'WhatsApp service restart initiated',
      note: 'This feature requires admin authentication in production'
    });

  } catch (error) {
    console.error('Error restarting WhatsApp service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restart WhatsApp service'
    });
  }
});

module.exports = router;
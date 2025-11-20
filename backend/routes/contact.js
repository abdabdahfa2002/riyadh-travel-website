const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const whatsappService = require('../services/whatsapp');
const router = express.Router();

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send contact form
router.post('/message', [
  body('name').notEmpty().trim().isLength({ min: 2, max: 100 }),
  body('phone').isMobilePhone('any'),
  body('email').optional().isEmail().normalizeEmail(),
  body('subject').optional().isLength({ max: 200 }),
  body('message').notEmpty().trim().isLength({ min: 10, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, phone, email, subject, message } = req.body;

    // Send email notification
    let emailSent = false;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.BUSINESS_EMAIL || process.env.EMAIL_USER,
          subject: `رسالة جديدة من الموقع: ${subject || 'استفسار عام'}`,
          html: `
            <h2>رسالة جديدة من موقع مكتب رياض القحطاني</h2>
            <p><strong>الاسم:</strong> ${name}</p>
            <p><strong>الهاتف:</strong> ${phone}</p>
            <p><strong>الإيميل:</strong> ${email || 'غير محدد'}</p>
            <p><strong>الموضوع:</strong> ${subject || 'غير محدد'}</p>
            <p><strong>الرسالة:</strong></p>
            <p>${message}</p>
            <hr>
            <p><small>تم إرسالها في: ${new Date().toLocaleString('ar-SA')}</small></p>
          `
        });
        emailSent = true;
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    // Send WhatsApp notification to business
    let whatsappSent = false;
    try {
      const whatsappMessage = `📬 رسالة جديدة من الموقع

👤 الاسم: ${name}
📱 الهاتف: ${phone}
📧 الإيميل: ${email || 'غير محدد'}
📋 الموضوع: ${subject || 'استفسار عام'}

💬 الرسالة:
${message}

---
من: موقع مكتب رياض القحطاني للسفريات`;

      whatsappSent = await whatsappService.sendServiceUpdate(
        process.env.BUSINESS_PHONE,
        whatsappMessage
      );
    } catch (whatsappError) {
      console.error('WhatsApp sending failed:', whatsappError);
    }

    // Auto-reply to customer via WhatsApp
    try {
      const autoReply = `مرحباً ${name}! 

شكراً لتواصلك معنا في مكتب رياض القحطاني للسفريات.

✅ تم استلام رسالتك وسنقوم بالرد عليك في أقرب وقت ممكن.

📞 للاستفسارات العاجلة:
${process.env.BUSINESS_PHONE}

🇸🇦 مكتب رياض القحطاني للسفريات والسياحة والأيدي العاملة`;

      await whatsappService.sendServiceUpdate(phone, autoReply);
    } catch (autoReplyError) {
      console.error('Auto-reply failed:', autoReplyError);
    }

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      details: {
        emailSent,
        whatsappSent,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

// Get contact information
router.get('/info', (req, res) => {
  res.json({
    success: true,
    contact: {
      phone: process.env.BUSINESS_PHONE || '+966501234567',
      email: process.env.BUSINESS_EMAIL || 'info@riyadh-travel.com',
      whatsapp: process.env.WHATSAPP_PHONE || '+966501234567',
      address: 'الرياض، المملكة العربية السعودية',
      workingHours: {
        sunday: '8:00 AM - 6:00 PM',
        monday: '8:00 AM - 6:00 PM',
        tuesday: '8:00 AM - 6:00 PM',
        wednesday: '8:00 AM - 6:00 PM',
        thursday: '8:00 AM - 6:00 PM',
        friday: 'Closed',
        saturday: '8:00 AM - 6:00 PM'
      },
      socialMedia: {
        twitter: 'https://twitter.com/riyadh_travel',
        instagram: 'https://instagram.com/riyadh_travel',
        facebook: 'https://facebook.com/riyadh.travel'
      }
    }
  });
});

// Newsletter subscription
router.post('/newsletter', [
  body('email').isEmail().normalizeEmail(),
  body('name').optional().trim().isLength({ max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Here you would typically save to a newsletter collection
    // For now, just send a confirmation email
    
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: req.body.email,
          subject: 'مرحباً بك في نشرتنا البريدية - مكتب رياض القحطاني',
          html: `
            <h2>مرحباً ${req.body.name || 'بك'}! 🎉</h2>
            <p>شكراً لانضمامك إلى نشرتنا البريدية.</p>
            <p>ستحصل على:</p>
            <ul>
              <li>آخر العروض والخدمات الجديدة</li>
              <li>نصائح السفر والسياحة</li>
              <li>تحديثات الأسعار والعروض الخاصة</li>
            </ul>
            <p>🇸🇦 مكتب رياض القحطاني للسفريات والسياحة والأيدي العاملة</p>
          `
        });
      } catch (emailError) {
        console.error('Newsletter confirmation email failed:', emailError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    console.error('Error processing newsletter subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process newsletter subscription'
    });
  }
});

module.exports = router;
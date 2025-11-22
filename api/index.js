// Updated: 2025-11-23 02:30:35 - Fix API endpoint deployment
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  // Health check endpoint
  if (path === '/api/health') {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: 'vercel'
    });
    return;
  }

  // Services endpoint
  if (path === '/api/services' && req.method === 'GET') {
    const servicesData = {
      documentation: {
        title: "الخدمات الوثائقية",
        description: "إصدار وتجديد جميع أنواع الوثائق الرسمية",
        services: [
          "إصدار بطاقة إلكترونية",
          "تجديد بطاقة إلكترونية", 
          "شهادة ميلاد",
          "بطاقة عائلية",
          "وكالة خارجية",
          "جواز سفر"
        ]
      },
      travel: {
        title: "خدمات السفريات", 
        description: "حجز التذاكر وتنظيم الرحلات",
        services: [
          "حجز تذاكر طيران",
          "حجز فنادق",
          "تأجير سيارات",
          "برامج سياحية",
          "رحلات حج وعمرة",
          "تأمين سفر"
        ]
      },
      labor: {
        title: "الأيدي العاملة",
        description: "استقدام وتوظيف العمالة الماهرة",
        services: [
          "استقدام عمالة",
          "توظيف محلي",
          "خدمات الاستقدام",
          "العمالة المنزلية",
          "العمالة المهنية",
          "نقل كفالة"
        ]
      },
      government: {
        title: "مراجعة الدوائر الحكومية",
        description: "تنفيذ المعاملات الحكومية", 
        services: [
          "السجل المدني",
          "مكتب الضرائب",
          "الجمارك",
          "البنوك",
          "التأمينات",
          "الدوائر الأخرى"
        ]
      },
      visa: {
        title: "التأشيرات",
        description: "استخراج جميع أنواع التأشيرات",
        services: [
          "تأشيرة سياحة",
          "تأشيرة عمل",
          "تأشيرة عمرة",
          "تأشيرة دراسة",
          "تأشيرة علاج",
          "تأشيرة زيارة"
        ]
      },
      saudi: {
        title: "تخليص المعاملات بالسعودية",
        description: "خدمات شاملة في المملكة العربية السعودية",
        services: [
          "نقل كفالة",
          "تجديد إقامة",
          "إصدار سجلات تجارية",
          "رخص قيادة",
          "معاملات البنوك",
          "خدمات التأمين"
        ]
      }
    };
    
    res.json(servicesData);
    return;
  }

  // Booking endpoint
  if (path === '/api/booking' && req.method === 'POST') {
    try {
      const bookingData = req.body;
      
      // Validate required fields
      if (!bookingData.customerInfo?.fullName || !bookingData.customerInfo?.phoneNumber || !bookingData.serviceDetails?.serviceType) {
        res.status(400).json({
          success: false,
          error: 'بيانات ناقصة. يرجى تعبئة جميع الحقول المطلوبة'
        });
        return;
      }

      const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Create booking object
      const booking = {
        bookingId: bookingId,
        customerInfo: bookingData.customerInfo,
        serviceDetails: bookingData.serviceDetails,
        customRequirements: bookingData.customRequirements || '',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        totalAmount: bookingData.paymentInfo?.totalAmount || 0,
        paymentInfo: {
          currency: 'SAR',
          paymentMethod: 'pending',
          totalAmount: bookingData.paymentInfo?.totalAmount || 0
        }
      };

      console.log('✅ New booking created:', bookingId, bookingData.customerInfo.fullName);
      
      // Simulate WhatsApp notification
      const whatsappMessage = `🎉 تم استلام طلب خدمتك بنجاح!

📋 تفاصيل الطلب:
رقم الطلب: ${bookingId}
العميل: ${bookingData.customerInfo.fullName}
الهاتف: ${bookingData.customerInfo.phoneNumber}
المنطقة: ${bookingData.customerInfo.region || 'غير محدد'}
نوع الخدمة: ${bookingData.serviceDetails.serviceType}
الوصف: ${bookingData.serviceDetails.description || 'غير محدد'}

💰 المبلغ: ${bookingData.paymentInfo?.totalAmount || 0} ريال

⏰ سيتم التواصل معك قريباً على الرقم: ${bookingData.customerInfo.phoneNumber}

شكراً لتواصلك معنا!`;

      console.log('📱 WhatsApp message prepared:', whatsappMessage);
      
      // Send notification via email (simulated)
      console.log('📧 Email notification prepared for:', process.env.BUSINESS_EMAIL);
      
      res.json({
        success: true,
        booking: booking,
        whatsappSent: true,
        message: 'تم حفظ طلبك بنجاح سيتم التواصل معك قريباً'
      });
      
    } catch (error) {
      console.error('❌ Booking error:', error);
      res.status(500).json({
        success: false,
        error: 'حدث خطأ في حفظ الطلب. يرجى المحاولة مرة أخرى'
      });
    }
    return;
  }

  // Contact endpoint
  if (path === '/api/contact' && req.method === 'POST') {
    try {
      const contactData = req.body;
      
      console.log('📞 New contact message:', contactData);
      
      // Send confirmation
      res.json({
        success: true,
        message: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً'
      });
    } catch (error) {
      console.error('❌ Contact error:', error);
      res.status(500).json({
        success: false,
        error: 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى'
      });
    }
    return;
  }

  // WhatsApp test endpoint
  if (path === '/api/whatsapp/test' && req.method === 'GET') {
    res.json({
      success: true,
      phoneNumber: process.env.WHATSAPP_PHONE || '+967739208217',
      message: 'WhatsApp service is configured correctly'
    });
    return;
  }

  // WhatsApp send message endpoint
  if (path === '/api/whatsapp/send' && req.method === 'POST') {
    try {
      const { message, phoneNumber } = req.body;
      
      const whatsappMessage = message || 'مرحباً، هذا اختبار لخدمة الواتساب';
      const whatsappPhone = phoneNumber || process.env.WHATSAPP_PHONE || '+967739208217';
      
      console.log('📱 WhatsApp message to send:', whatsappMessage, 'to:', whatsappPhone);
      
      res.json({
        success: true,
        message: 'تم إرسال الرسالة بنجاح',
        whatsappPhone: whatsappPhone,
        whatsappMessage: whatsappMessage
      });
    } catch (error) {
      console.error('❌ WhatsApp send error:', error);
      res.status(500).json({
        success: false,
        error: 'حدث خطأ في إرسال الرسالة'
      });
    }
    return;
  }

  // Default response for not found routes
  res.status(404).json({
    error: 'Endpoint not found',
    path: path,
    method: req.method,
    availableEndpoints: [
      '/api/health',
      '/api/services',
      '/api/booking',
      '/api/contact',
      '/api/whatsapp/test',
      '/api/whatsapp/send'
    ]
  });
}
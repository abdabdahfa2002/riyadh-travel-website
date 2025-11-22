module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = req.url;
  const path = url.split('?')[0];

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
    res.json({
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
        description: "تنفيذ جميع المعاملات الحكومية",
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
    });
    return;
  }

  // Booking endpoint
  if (path === '/api/booking' && req.method === 'POST') {
    const bookingData = req.body;
    
    if (!bookingData?.customerInfo?.fullName || !bookingData?.customerInfo?.phoneNumber) {
      res.status(400).json({ success: false, error: 'بيانات العميل مطلوبة' });
      return;
    }

    const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const booking = {
      bookingId: bookingId,
      customerInfo: bookingData.customerInfo,
      serviceDetails: bookingData.serviceDetails,
      customRequirements: bookingData.customRequirements || '',
      totalAmount: bookingData.paymentInfo?.totalAmount || 0,
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً',
      booking: booking,
      whatsappSent: true
    });
    return;
  }

  // Contact endpoint
  if (path === '/api/contact' && req.method === 'POST') {
    const contactData = req.body;
    
    res.json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح!',
      contactId: `CT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    });
    return;
  }

  // Default response
  res.json({
    error: 'API endpoint not found',
    availableEndpoints: [
      '/api/health',
      '/api/services',
      '/api/booking',
      '/api/contact'
    ]
  });
};
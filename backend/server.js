const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/riyadh-travel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Import routes
const servicesRoutes = require('./routes/services');
const bookingRoutes = require('./routes/booking');
const contactRoutes = require('./routes/contact');
const whatsappRoutes = require('./routes/whatsapp');

// API Routes
app.use('/api/services', servicesRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('booking_update', (data) => {
    io.emit('booking_notification', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// WhatsApp integration
const initializeWhatsApp = require('./services/whatsapp');
initializeWhatsApp(io);

// Vercel serverless function
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return false;
  }

  // Handle different routes
  if (req.url.startsWith('/api/health')) {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: 'vercel'
    });
    return false;
  }

  if (req.url.startsWith('/api/services')) {
    const servicesData = {
      documentation: {
        title: "الخدمات الوثائقية",
        description: "إصدار وتجديد جميع أنواع الوثائق الرسمية",
        services: ["إصدار بطاقة إلكترونية", "تجديد بطاقة إلكترونية", "شهادة ميلاد", "بطاقة عائلية", "وكالة خارجية", "جواز سفر"]
      },
      travel: {
        title: "خدمات السفريات", 
        description: "حجز التذاكر وتنظيم الرحلات",
        services: ["حجز تذاكر طيران", "حجز فنادق", "تأجير سيارات", "برامج سياحية", "رحلات حج وعمرة", "تأمين سفر"]
      },
      labor: {
        title: "الأيدي العاملة",
        description: "استقدام وتوظيف العمالة الماهرة",
        services: ["استقدام عمالة", "توظيف محلي", "خدمات الاستقدام", "العمالة المنزلية", "العمالة المهنية", "نقل كفالة"]
      },
      government: {
        title: "مراجعة الدوائر الحكومية",
        description: "تنفيذ المعاملات الحكومية", 
        services: ["السجل المدني", "مكتب الضرائب", "الجمارك", "البنوك", "التأمينات", "الدوائر الأخرى"]
      },
      visa: {
        title: "التأشيرات",
        description: "استخراج جميع أنواع التأشيرات",
        services: ["تأشيرة سياحة", "تأشيرة عمل", "تأشيرة عمرة", "تأشيرة دراسة", "تأشيرة علاج", "تأشيرة زيارة"]
      },
      saudi: {
        title: "تخليص المعاملات بالسعودية",
        description: "خدمات شاملة في المملكة العربية السعودية",
        services: ["نقل كفالة", "تجديد إقامة", "إصدار سجلات تجارية", "رخص قيادة", "معاملات البنوك", "خدمات التأمين"]
      }
    };
    
    res.json(servicesData);
    return false;
  }

  if (req.url.startsWith('/api/booking') && req.method === 'POST') {
    try {
      const bookingData = req.body;
      const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Simulate booking creation
      const booking = {
        bookingId: bookingId,
        customerInfo: bookingData.customerInfo,
        serviceDetails: bookingData.serviceDetails,
        customRequirements: bookingData.customRequirements,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        totalAmount: bookingData.paymentInfo?.totalAmount || 0
      };

      console.log('✅ New booking created:', bookingId, bookingData.customerInfo.fullName);
      
      // Simulate WhatsApp notification
      const whatsappMessage = `
🎉 تم استلام طلب خدمتك بنجاح!

📋 تفاصيل الطلب:
رقم الطلب: ${bookingId}
العميل: ${bookingData.customerInfo.fullName}
الهاتف: ${bookingData.customerInfo.phoneNumber}
المنطقة: ${bookingData.customerInfo.region}
نوع الخدمة: ${bookingData.serviceDetails.serviceType}

💰 المبلغ: ${bookingData.paymentInfo?.totalAmount || 0} ريال

⏰ سيتم التواصل معك قريباً
`;

      console.log('📱 WhatsApp message prepared:', whatsappMessage);
      
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
        error: 'حدث خطأ في حفظ الطلب'
      });
    }
    return false;
  }

  if (req.url.startsWith('/api/contact') && req.method === 'POST') {
    try {
      const contactData = req.body;
      console.log('📞 New contact message:', contactData);
      
      res.json({
        success: true,
        message: 'تم إرسال رسالتك بنجاح'
      });
    } catch (error) {
      console.error('❌ Contact error:', error);
      res.status(500).json({
        success: false,
        error: 'حدث خطأ في إرسال الرسالة'
      });
    }
    return false;
  }

  // Default response
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.url,
    method: req.method
  });
}
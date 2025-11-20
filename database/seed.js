// Database Seeding Script
// Run this script to populate initial services data

const mongoose = require('mongoose');
const Service = require('./models/Service');
require('dotenv').config();

// Sample services data
const sampleServices = [
  {
    title: "Documentary Services",
    titleAr: "الخدمات الوثائقية",
    description: "Complete documentation services including passports, certificates, and government documents processing",
    descriptionAr: "خدمات وثائقية شاملة تشمل جوازات السفر والشهادات ومعالجة الوثائق الحكومية",
    category: "documents",
    price: 50,
    duration: "2-5 أيام عمل",
    requirements: [
      "صورة من الهوية الوطنية",
      "صور شخصية",
      "أي وثائق إضافية مطلوبة"
    ],
    features: [
      "معالجة سريعة",
      "متابعة دورية",
      "ضمان الجودة",
      "خدمة عملاء متميزة"
    ],
    order: 1
  },
  {
    title: "Travel & Tourism Services",
    titleAr: "خدمات السفر والسياحة",
    description: "Flight bookings, hotel reservations, and comprehensive tourism services",
    descriptionAr: "حجز التذاكر وحجوزات الفنادق وخدمات سياحية شاملة",
    category: "travel",
    price: 100,
    duration: "حسب الطلب",
    requirements: [
      "جواز سفر صالح",
      "تأشيرة (إن لزم الأمر)",
      "وثائق السفر المطلوبة"
    ],
    features: [
      "أفضل الأسعار",
      "حجوزات مؤكدة",
      "دعم 24/7",
      "خطط سفر مخصصة"
    ],
    order: 2
  },
  {
    title: "Labor & Employment Services",
    titleAr: "خدمات الأيدي العاملة والتوظيف",
    description: "Employment placement, visa processing, and labor services for various sectors",
    descriptionAr: "تركيب الوظائف ومعالجة التأشيرات وخدمات الأيدي العاملة في مختلف القطاعات",
    category: "labor",
    price: 200,
    duration: "1-3 أسابيع",
    requirements: [
      "السيرة الذاتية",
      "الشهادات والمؤهلات",
      "الفحوصات الطبية",
      "وثائق أخرى حسب التخصص"
    ],
    features: [
      "فرص عمل متنوعة",
      "معالجة تأشيرات",
      "دعم ما بعد التوظيف",
      "متابعة مستمرة"
    ],
    order: 3
  },
  {
    title: "Visa Services",
    titleAr: "خدمات التأشيرات",
    description: "Tourist, work, and Umrah visa processing with complete documentation support",
    descriptionAr: "معالجة التأشيرات السياحية وعمل وعمرى مع دعم وثائقي كامل",
    category: "visas",
    price: 150,
    duration: "3-10 أيام عمل",
    requirements: [
      "جواز سفر ساري المفعول",
      "صور شخصية حديثة",
      "تأكيد حجوزات",
      "وثائق إضافية حسب نوع التأشيرة"
    ],
    features: [
      "معالجة سريعة",
      "استشارة مجانية",
      "متابعة الطلب",
      "دعم كامل"
    ],
    order: 4
  },
  {
    title: "Government Departments",
    titleAr: "المراجعات الحكومية",
    description: "Services related to various government departments and official procedures",
    descriptionAr: "خدمات مرتبطة بالمؤسسات الحكومية والإجراءات الرسمية المختلفة",
    category: "government",
    price: 75,
    duration: "حسب نوع المعاملة",
    requirements: [
      "الوثائق المطلوبة",
      "صورة من الهوية",
      "أية مستندات إضافية مطلوبة"
    ],
    features: [
      "خبرة في الإجراءات الحكومية",
      "توفير الوقت",
      "دقة في التنفيذ",
      "خدمة احترافية"
    ],
    order: 5
  },
  {
    title: "Transaction Processing",
    titleAr: "معاملات المملكة",
    description: "Complete transaction processing services in Saudi Arabia",
    descriptionAr: "خدمات معالجة المعاملات في المملكة العربية السعودية بشكل كامل",
    category: "processing",
    price: 100,
    duration: "حسب نوع المعاملة",
    requirements: [
      "رقم الهوية الوطنية",
      "الوثائق المطلوبة",
      "البيانات الشخصية الصحيحة"
    ],
    features: [
      "خبرة واسعة",
      "معرفة الإجراءات",
      "خدمة سريعة",
      "ضمان النجاح"
    ],
    order: 6
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/riyadh-travel', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');

    // Clear existing services
    console.log('🗑️ Clearing existing services...');
    await Service.deleteMany({});
    
    // Insert sample services
    console.log('📝 Inserting sample services...');
    await Service.insertMany(sampleServices);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Inserted ${sampleServices.length} services`);
    
    // Display inserted services
    const services = await Service.find({}).sort({ order: 1 });
    console.log('\n📋 Inserted Services:');
    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.titleAr} (${service.category}) - ${service.price} SAR`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run seeding if this script is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleServices };
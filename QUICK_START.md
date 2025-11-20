# 🚀 دليل التشغيل السريع
# مكتب رياض القحطاني للسفريات والسياحة والأيدي العاملة

## 🎯 البدء السريع

### 1. تشغيل النظام كاملاً
```bash
# تثبيت جميع التبعيات
npm run setup

# تشغيل Backend و Frontend معاً
npm run dev
```

### 2. إعداد قاعدة البيانات
```bash
# إضافة البيانات الأولية
npm run seed
```

### 3. فتح الموقع
- **Frontend**: افتح `frontend/index.html` في المتصفح
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`

## 🔧 ملفات مهمة

### Backend
- `backend/server.js` - الخادم الرئيسي
- `backend/.env` - إعدادات البيئة
- `backend/models/` - نماذج قاعدة البيانات
- `backend/routes/` - مسارات API

### Frontend
- `frontend/index.html` - الصفحة الرئيسية
- `frontend/api.js` - خدمة API

### Database
- `database/seed.js` - البيانات الأولية

## 🌐 النشر على Vercel

### خطوات النشر:
1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول بـ GitHub
3. اختر المستودع: `abdabdahfa2002/riyadh-travel-website`
4. اضغط "Deploy"

### Environment Variables في Vercel:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://asomh200222_db_user:xVsfkc7Oni3FAv0R@cluster0.hggnyao.mongodb.net/?appName=Cluster0
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
BUSINESS_EMAIL=info@riyadh-travel.com
BUSINESS_PHONE=+966501234567
WHATSAPP_PHONE=+966501234567
JWT_SECRET=riyadh-travel-super-secret-jwt-key-2024-abdabdahfa2002
```

## 📱 ربط واتساب

1. تشغيل الخادم: `cd backend && npm run dev`
2. متابعة الـ logs للـ QR code
3. مسح الكود بهاتفك لربط واتساب
4. اختبار الاتصال: `GET /api/whatsapp/status`

## 🔍 فحص النظام

### Health Check
```bash
curl http://localhost:5000/api/health
```

### WhatsApp Status
```bash
curl http://localhost:5000/api/whatsapp/status
```

### Services
```bash
curl http://localhost:5000/api/services
```

## ⚠️ ملاحظات مهمة

### للإيميل:
- استخدم Gmail مع App Password
- فعّل 2FA أولاً
- لا تستخدم كلمة المرور العادية

### لقاعدة البيانات:
- MongoDB Atlas محدودة بـ 512MB في الخطة المجانية
- احتفظ بنسخ احتياطية
- راجع usage شهرياً

### للواتساب:
- يجب إعادة ربط الجلسة إذا لم تستخدم لمدة طويلة
- الخادم يحتاج إنترنت مستمر
- تحقق من logs عند مشاكل الاتصال

## 📞 للحصول على المساعدة

- **Email**: support@riyadh-travel.com
- **Phone**: +966501234567
- **GitHub Issues**: https://github.com/abdabdahfa2002/riyadh-travel-website/issues

---

**✅ النظام جاهز للاستخدام!**
**🚀 استمتع بالموقع الجديد!**
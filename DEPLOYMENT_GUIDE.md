# دليل النشر والإعداد - موقع مكتب رياض القحطاني

## 📋 نظرة عامة
هذا الدليل يوضح كيفية نشر وإعداد الموقع الجديد لمكتب رياض القحطاني على مختلف المنصات.

## 🚀 الخيارات المتاحة للنشر

### 1. الاستضافة المجانية (مُوصى بها)

#### أ) GitHub Pages
1. إنشاء حساب على [GitHub.com](https://github.com)
2. إنشاء مستودع جديد باسم `riyad-alqahtani-office`
3. رفع ملفات الموقع:
   ```
   - index.html
   - animations.css
   - enhanced-features.js
   - README.md
   ```
4. تفعيل GitHub Pages من إعدادات المستودع
5. الموقع سيكون متاحاً على: `https://username.github.io/riyad-alqahtani-office`

#### ب) Netlify
1. زيارة [Netlify.com](https://netlify.com)
2. إنشاء حساب مجاني
3. سحب وإفلات مجلد الموقع
4. الحصول على رابط فوري
5. إمكانية ربط دومين مخصص

#### ج) Vercel
1. زيارة [Vercel.com](https://vercel.com)
2. التسجيل بالـ GitHub
3. استيراد المستودع
4. نشر تلقائي مع كل تحديث

### 2. الاستضافة المدفوعة

#### أ) Cloudflare Pages
- **المزايا**: CDN سريع، أمان عالي، دومين مجاني
- **التكلفة**: مجاني للاستخدام الشخصي
- **الاستخدام**: مناسب للمؤسسات

#### ب) AWS S3 + CloudFront
- **المزايا**: قابلية توسع عالية، أداء ممتاز
- **التكلفة**: حسب الاستخدام
- **الاستخدام**: مناسب للحركة العالية

#### ج) DigitalOcean App Platform
- **المزايا**: سهولة الإعداد، مراقبة متقدمة
- **التكلفة**: من 5$ شهرياً
- **الاستخدام**: للمشاريع التجارية

### 3. الاستضافة المحلية

#### أ) خادم ويب محلي
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

## ⚙️ إعدادات ما قبل النشر

### 1. التحقق من الملفات
تأكد من وجود الملفات التالية:
- ✅ `index.html` (الملف الرئيسي)
- ✅ `animations.css` (الرسوم المتحركة)
- ✅ `enhanced-features.js` (الميزات المتقدمة)
- ✅ `README.md` (التوثيق)

### 2. تحديث الروابط
في حالة تغيير الاستضافة، تأكد من تحديث:
- روابط الواتساب في الكود
- أي روابط خارجية
- عناوين البريد الإلكتروني

### 3. تحسين الصور
```bash
# ضغط الصور (اختياري)
imagemin images/* --out-dir=images-optimized
```

### 4. التحقق من الأداء
- اختبار سرعة التحميل
- التحقق من الاستجابة
- اختبار التوافقية

## 🔧 الإعدادات المتقدمة

### 1. ربط دومين مخصص

#### DNS Settings
```
类型: CNAME
名称: www
值: your-site.vercel.app

类型: A
名称: @
值: 76.76.19.61
```

#### HTTPS
معظم منصات النشر توفر HTTPS مجاناً:
- Let's Encrypt (مجاناً)
- Cloudflare SSL (مجاني)

### 2. تحسين الأداء

#### ضغط الملفات
```javascript
// في إعدادات البناء
const compression = require('compression');
app.use(compression());
```

#### تحليلات Google
```html
<!-- إضافة في <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. البحث والتحسين

#### Schema Markup
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "مكتب رياض القحطاني للسفريات والسياحة والأيدي العاملة",
  "telephone": "+967-730-555-588",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "YE"
  }
}
</script>
```

#### Meta Tags
```html
<meta name="description" content="مكتب رياض القحطاني للسفريات والسياحة والأيدي العاملة - خدمات شاملة للسفر والتوظيف والخدمات الحكومية">
<meta name="keywords" content="سفر, سفريات, سياحة, تأشيرات, عمالة, جوازات, يمن, سعودية">
<meta property="og:title" content="مكتب رياض القحطاني للسفريات">
<meta property="og:description" content="خدمات شاملة للسفر والتوظيف والخدمات الحكومية">
<meta property="og:image" content="https://files.catbox.moe/psvf7f.jpg">
```

## 🔐 الأمان والحماية

### 1. Headers الأمان
```nginx
# في إعدادات الخادم
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

### 2. حماية ضد البوتات
```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### 3. النسخ الاحتياطية
```bash
# نسخ احتياطية تلقائية
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf backup_$DATE.tar.gz /path/to/website/
```

## 📊 المراقبة والتحليلات

### 1. Google Analytics 4
```javascript
// إعداد GA4
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: 'مكتب رياض القحطاني',
  page_location: window.location.href
});
```

### 2. مراقبة الأداء
```javascript
// Core Web Vitals
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

function sendToAnalytics(metric) {
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 3. أخطاء التطبيق
```javascript
// Sentry Error Monitoring
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

## 🔄 التحديث والصيانة

### 1. تحديث المحتوى
```bash
# استخدام Git لإدارة الإصدارات
git add .
git commit -m "تحديث الخدمات - تاريخ"
git push origin main
```

### 2. اختبار التحديثات
```bash
# اختبار محلي
npm install -g live-server
live-server

# اختبار الاستجابة
npx @axe-core/cli http://localhost:8080
```

### 3. جدولة الصيانة
- **يومياً**: مراقبة الأخطاء
- **أسبوعياً**: نسخ احتياطية
- **شهرياً**: تحديث المحتوى
- **ربع سنوي**: مراجعة شاملة

## 📱 تحسين محركات البحث (SEO)

### 1. الكلمات المفتاحية
- سفر اليمن
- سفريات اليمن
- تأشيرات السعودية
- استقدام عمالة
- جوازات سفر
- خدمات حكومية

### 2. المحتوى المحلي
```html
<div itemscope itemtype="http://schema.org/TravelAgency">
  <h1 itemprop="name">مكتب رياض القحطاني</h1>
  <div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
    <span itemprop="addressCountry">اليمن</span>
  </div>
  <div itemprop="telephone">730555588</div>
</div>
```

### 3. خريطة الموقع
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

## 🆘 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. الموقع لا يحمل
```bash
# فحص أخطاء الشبكة
curl -I https://yourdomain.com

# فحص SSL
openssl s_client -connect yourdomain.com:443
```

#### 2. مشاكل الاستجابة
- فحص CSS media queries
- اختبار على أجهزة مختلفة
- مراجعة JavaScript للأخطاء

#### 3. بطء التحميل
```bash
# فحص حجم الملفات
du -sh *

# ضغط الصور
mogrify -resize 1920x1080 *.jpg
```

## 📞 الدعم والمساعدة

### معلومات التواصل للدعم التقني:
- **البريد الإلكتروني**: support@riyadalqahtani.com
- **الهاتف**: 730555588
- **واتساب**: 967730555588

### موارد إضافية:
- [دليل GitHub Pages](https://docs.github.com/en/pages)
- [دليل Netlify](https://docs.netlify.com)
- [Google Search Console](https://search.google.com/search-console)

## 📈 مؤشرات النجاح

### الأهداف المقترحة:
- **تحميل الصفحة**: أقل من 3 ثوان
- **معدل التحويل**: زيادة 40%
- **معدل الارتداد**: تقليل 30%
- **الظهور في البحث**: الصفحة الأولى

### أدوات القياس:
- Google Analytics
- Google Search Console
- PageSpeed Insights
- Core Web Vitals

---

**ملاحظة**: احتفظ بنسخة احتياطية من جميع الملفات قبل أي تحديث كبير.
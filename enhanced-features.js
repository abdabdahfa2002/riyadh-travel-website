// ملف الميزات المتقدمة للموقع

// === تهيئة الميزات المتقدمة ===
document.addEventListener('DOMContentLoaded', function() {
    initializeAdvancedFeatures();
});

// === الميزات المتقدمة ===
function initializeAdvancedFeatures() {
    // تفعيل التأثيرات المتقدمة
    setupScrollReveal();
    setupParallaxEffects();
    setupAdvancedAnimations();
    setupServiceQuiz();
    setupImageLazyLoading();
    setupPerformanceOptimizations();
    setupAccessibilityFeatures();
    setupErrorHandling();
}

// === تأثيرات الظهور عند التمرير ===
function setupScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // تأثير متدرج للعناصر الفرعية
                const children = entry.target.querySelectorAll('.scroll-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('revealed');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // مراقبة جميع العناصر التي تحتاج تأثير كشف
    document.querySelectorAll('.scroll-reveal, .service-card, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

// === تأثيرات المنظور ===
function setupParallaxEffects() {
    // تأثير الخلفية المتحركة في قسم البطل
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    });
}

// === الرسوم المتحركة المتقدمة ===
function setupAdvancedAnimations() {
    // تأثير الكتابة الآلية للعنوان الرئيسي
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        typewriterEffect(heroTitle);
    }

    // تأثير العد التدريجي للأرقام
    setupCounterAnimations();

    // تأثيرات الأزرار المتقدمة
    setupButtonEffects();
}

// === تأثير الكتابة الآلية ===
function typewriterEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid var(--accent-500)';
    
    let i = 0;
    const timer = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(timer);
            element.style.borderRight = 'none';
        }
    }, 50);
}

// === تأثيرات العد التدريجي ===
function setupCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // مللي ثانية
        const increment = target / (duration / 16); // 60 FPS
        
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            counter.textContent = Math.floor(current);
            
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    });
}

// === تأثيرات الأزرار المتقدمة ===
function setupButtonEffects() {
    document.querySelectorAll('.btn').forEach(btn => {
        // تأثير التموج عند الضغط
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // إضافة CSS للتموج
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        .btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// === نظام الاختبار التفاعلي للخدمات ===
function setupServiceQuiz() {
    const quizContainer = document.createElement('div');
    quizContainer.id = 'serviceQuiz';
    quizContainer.innerHTML = `
        <div class="quiz-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 2000; align-items: center; justify-content: center;">
            <div class="quiz-content" style="background: white; border-radius: 16px; padding: 32px; max-width: 500px; width: 90%;">
                <h3>اختر الخدمة المناسبة لك</h3>
                <div class="quiz-questions"></div>
                <div class="quiz-result" style="display: none;"></div>
            </div>
        </div>
    `;
    document.body.appendChild(quizContainer);

    // عرض الاختبار
    document.querySelectorAll('[data-quiz]').forEach(btn => {
        btn.addEventListener('click', () => {
            showServiceQuiz();
        });
    });
}

// === تحميل الصور بذكاء ===
function setupImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// === تحسينات الأداء ===
function setupPerformanceOptimizations() {
    // تأخير تحميل الموارد غير الضرورية
    setTimeout(() => {
        loadNonCriticalResources();
    }, 1000);

    // تنظيف الذاكرة
    setupMemoryCleanup();

    // تحسين حجم الصور
    optimizeImages();
}

// === تحميل الموارد غير الحرجة ===
function loadNonCriticalResources() {
    // تحميل خط احتياطي
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
}

// === تنظيف الذاكرة ===
function setupMemoryCleanup() {
    // إزالة الأحداث غير المستخدمة
    window.addEventListener('beforeunload', () => {
        // إلغاء جميع المؤقتات
        if (window.timers) {
            window.timers.forEach(timer => clearTimeout(timer));
        }
    });
}

// === تحسين الصور ===
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // إضافة أبعاد لمنع إعادة التدفق
        if (!img.width || !img.height) {
            img.addEventListener('load', () => {
                img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
            });
        }
    });
}

// === ميزات إمكانية الوصول ===
function setupAccessibilityFeatures() {
    // التنقل بلوحة المفاتيح
    setupKeyboardNavigation();

    // قارئ الشاشة
    setupScreenReaderSupport();

    // تقليل الحركة
    setupReducedMotion();
}

// === التنقل بلوحة المفاتيح ===
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // إغلاق النوافذ المنبثقة
            closeAllModals();
        }
    });

    // تحسين التركيز
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea');
    focusableElements.forEach(el => {
        el.addEventListener('focus', () => {
            el.classList.add('focus-visible');
        });
        el.addEventListener('blur', () => {
            el.classList.remove('focus-visible');
        });
    });
}

// === دعم قارئ الشاشة ===
function setupScreenReaderSupport() {
    // إضافة تسميات ARIA
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(btn => {
        if (!btn.textContent.trim()) {
            btn.setAttribute('aria-label', 'زر تفاعلي');
        }
    });

    // تحديث الصفحة ديناميكيًا
    const announcements = document.createElement('div');
    announcements.setAttribute('aria-live', 'polite');
    announcements.setAttribute('aria-atomic', 'true');
    announcements.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(announcements);
}

// === تقليل الحركة ===
function setupReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }
}

// === معالجة الأخطاء ===
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('خطأ في الموقع:', e.error);
        
        // إرسال تقرير الخطأ (يمكن تطويره لإرسال إلى خادم)
        logError(e.error);
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('خطأ غير معالج:', e.reason);
        logError(e.reason);
    });
}

// === تسجيل الأخطاء ===
function logError(error) {
    // يمكن تطوير هذه الدالة لإرسال الأخطاء إلى خدمة مراقبة
    const errorReport = {
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    console.log('تقرير الخطأ:', errorReport);
}

// === دوال مساعدة ===

// إغلاق جميع النوافذ المنبثقة
function closeAllModals() {
    const modals = document.querySelectorAll('.modal, .quiz-modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// عرض اختبار الخدمة
function showServiceQuiz() {
    const quizModal = document.querySelector('.quiz-modal');
    if (quizModal) {
        quizModal.style.display = 'flex';
    }
}

// === تحسينات إضافية ===

// تأثير تحريك النص عند التمرير
function setupTextParallax() {
    const textElements = document.querySelectorAll('.parallax-text');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        textElements.forEach(el => {
            const rate = scrolled * -0.3;
            el.style.transform = `translateY(${rate}px)`;
        });
    });
}

// تأثير الظلال المتقدمة
function setupAdvancedShadows() {
    document.querySelectorAll('.service-card, .contact-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.boxShadow = '0 8px 32px rgba(0, 83, 156, 0.15)';
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.boxShadow = 'var(--shadow-md)';
        });
    });
}

// تفعيل جميع الميزات المتقدمة
document.addEventListener('DOMContentLoaded', () => {
    setupTextParallax();
    setupAdvancedShadows();
});

// === تصدير الدوال للاستخدام الخارجي ===
window.WebsiteEnhancements = {
    typewriterEffect,
    setupCounterAnimations,
    showServiceQuiz,
    closeAllModals,
    logError
};
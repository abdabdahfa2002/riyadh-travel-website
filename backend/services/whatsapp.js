const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');

class WhatsAppService {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.qrCode = null;
    this.connected = false;
  }

  async initialize(io) {
    try {
      console.log('🔄 Initializing WhatsApp service...');
      
      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId: 'riyadh-travel-website'
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
          ]
        }
      });

      // QR Code generation
      this.client.on('qr', (qr) => {
        console.log('📱 WhatsApp QR Code generated');
        this.qrCode = qr;
        qrcode.toDataURL(qr, (err, url) => {
          if (!err) {
            io.emit('whatsapp_qr', { qr: url });
          }
        });
      });

      // Ready event
      this.client.on('ready', () => {
        console.log('✅ WhatsApp client is ready!');
        this.isReady = true;
        this.connected = true;
        io.emit('whatsapp_status', { connected: true, status: 'ready' });
      });

      // Auth failure
      this.client.on('auth_failure', msg => {
        console.error('❌ WhatsApp auth failure:', msg);
        this.isReady = false;
        this.connected = false;
        io.emit('whatsapp_status', { connected: false, status: 'auth_failed' });
      });

      // Disconnected
      this.client.on('disconnected', (reason) => {
        console.log('❌ WhatsApp disconnected:', reason);
        this.isReady = false;
        this.connected = false;
        io.emit('whatsapp_status', { connected: false, status: 'disconnected', reason });
      });

      // Message events
      this.client.on('message', async (message) => {
        console.log('📨 New WhatsApp message received:', message.body);
        
        // Auto-reply for common queries
        const replies = {
          'hello': 'مرحباً بك في مكتب رياض القحطاني للسفريات! كيف يمكنني مساعدتك؟',
          'السلام عليكم': 'وعليكم السلام ورحمة الله وبركاته، أهلاً وسهلاً بك!',
          'help': 'يمكنك التواصل معنا للحجز أو الاستفسار عن خدماتنا المختلفة.',
          'help_en': 'Hello! Welcome to Riyadh Al-Qahtani Travel Office. How can we help you?'
        };

        const userMessage = message.body.toLowerCase().trim();
        for (const [key, reply] of Object.entries(replies)) {
          if (userMessage.includes(key)) {
            await message.reply(reply);
            break;
          }
        }
      });

      // Initialize client
      await this.client.initialize();
      
    } catch (error) {
      console.error('❌ Failed to initialize WhatsApp:', error);
      this.isReady = false;
      this.connected = false;
    }
  }

  async sendBookingNotification(booking) {
    if (!this.isReady || !this.connected) {
      console.warn('⚠️ WhatsApp not ready for sending booking notification');
      return false;
    }

    try {
      const phoneNumber = this.formatPhoneNumber(booking.customerInfo.phoneNumber);
      const message = this.generateBookingMessage(booking);
      
      await this.client.sendMessage(phoneNumber, message);
      
      console.log(`✅ Booking notification sent to ${phoneNumber}`);
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send WhatsApp message:', error);
      return false;
    }
  }

  async sendServiceUpdate(phoneNumber, updateMessage) {
    if (!this.isReady || !this.connected) {
      return false;
    }

    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      await this.client.sendMessage(formattedPhone, updateMessage);
      return true;
    } catch (error) {
      console.error('❌ Failed to send service update:', error);
      return false;
    }
  }

  formatPhoneNumber(phone) {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    
    // Handle Saudi numbers
    if (cleaned.startsWith('966')) {
      cleaned = cleaned.substring(3);
    }
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    // Add country code
    if (!cleaned.startsWith('966')) {
      cleaned = '966' + cleaned;
    }
    
    return cleaned + '@c.us';
  }

  generateBookingMessage(booking) {
    const messages = {
      ar: `🎉 تم تأكيد حجزك بنجاح!

📋 رقم الحجز: ${booking.bookingId}
👤 الاسم: ${booking.customerInfo.fullName}
🛎️ الخدمة: ${booking.serviceDetails.serviceTitleAr}
💰 المبلغ: ${booking.paymentInfo.totalAmount} ${booking.paymentInfo.currency}

📞 للتواصل: ${process.env.BUSINESS_PHONE}
📧 Email: ${process.env.BUSINESS_EMAIL}

شكراً لثقتكم في مكتب رياض القحطاني للسفريات! 🇸🇦`,

      en: `🎉 Your booking has been confirmed successfully!

📋 Booking ID: ${booking.bookingId}
👤 Name: ${booking.customerInfo.fullName}
🛎️ Service: ${booking.serviceDetails.serviceTitle}
💰 Amount: ${booking.paymentInfo.totalAmount} ${booking.paymentInfo.currency}

📞 Contact: ${process.env.BUSINESS_PHONE}
📧 Email: ${process.env.BUSINESS_EMAIL}

Thank you for choosing Riyadh Al-Qahtani Travel Office! 🇸🇦`
    };

    return messages.ar; // Default to Arabic
  }

  getStatus() {
    return {
      isReady: this.isReady,
      connected: this.connected,
      hasQRCode: !!this.qrCode
    };
  }
}

// Export singleton instance
const whatsappService = new WhatsAppService();

module.exports = (io) => {
  whatsappService.initialize(io);
  return whatsappService;
};

module.exports.WhatsAppService = whatsappService;
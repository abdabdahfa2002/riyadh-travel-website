// Frontend API Configuration
const API_CONFIG = {
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-api-domain.vercel.app/api' 
    : 'http://localhost:5000/api',
  
  timeout: 30000,
  
  headers: {
    'Content-Type': 'application/json'
  }
};

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...API_CONFIG.headers,
      ...options.headers,
      ...(options.body && !options.headers?.['Content-Type'] && {
        'Content-Type': 'application/json'
      })
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: config,
        body: options.body && typeof options.body === 'object' 
          ? JSON.stringify(options.body) 
          : options.body
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Services API
  async getServices(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/services${queryString ? '?' + queryString : ''}`);
  }

  async getService(id) {
    return this.request(`/services/${id}`);
  }

  async createService(serviceData) {
    return this.request('/services', {
      method: 'POST',
      body: serviceData
    });
  }

  // Booking API
  async createBooking(bookingData) {
    return this.request('/booking', {
      method: 'POST',
      body: bookingData
    });
  }

  async getBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/booking${queryString ? '?' + queryString : ''}`);
  }

  async getBooking(bookingId) {
    return this.request(`/booking/${bookingId}`);
  }

  async updateBookingStatus(bookingId, status, notifyCustomer = true) {
    return this.request(`/booking/${bookingId}/status`, {
      method: 'PATCH',
      body: { status, notifyCustomer }
    });
  }

  async addBookingNote(bookingId, noteType, note) {
    return this.request(`/booking/${bookingId}/notes`, {
      method: 'PATCH',
      body: { 
        [`${noteType}Note`]: note 
      }
    });
  }

  // Contact API
  async sendMessage(messageData) {
    return this.request('/contact/message', {
      method: 'POST',
      body: messageData
    });
  }

  async getContactInfo() {
    return this.request('/contact/info');
  }

  async subscribeNewsletter(email, name) {
    return this.request('/contact/newsletter', {
      method: 'POST',
      body: { email, name }
    });
  }

  // WhatsApp API
  async getWhatsAppStatus() {
    return this.request('/whatsapp/status');
  }

  async sendWhatsAppMessage(phoneNumber, message, type = 'text') {
    return this.request('/whatsapp/send-message', {
      method: 'POST',
      body: { phoneNumber, message, type }
    });
  }

  async sendTestBooking(phone, name) {
    return this.request('/whatsapp/test-booking', {
      method: 'POST',
      body: { phone, name }
    });
  }

  // Health Check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export API service instance
const apiService = new ApiService();

// Socket.IO connection for real-time updates
class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect(token = null) {
    if (this.socket?.connected) return;

    this.socket = io(API_CONFIG.baseURL.replace('/api', ''), {
      auth: token ? { token } : {},
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to server');
      this.emit('connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      this.emit('disconnected');
    });

    this.socket.on('new_booking', (data) => {
      this.emit('new_booking', data);
    });

    this.socket.on('booking_status_update', (data) => {
      this.emit('booking_status_update', data);
    });

    this.socket.on('whatsapp_status', (data) => {
      this.emit('whatsapp_status', data);
    });

    this.socket.on('whatsapp_qr', (data) => {
      this.emit('whatsapp_qr', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  joinRoom(roomId) {
    if (this.socket) {
      this.socket.emit('join_room', roomId);
    }
  }
}

const socketService = new SocketService();

// Export services
export { apiService, socketService };
export default apiService;
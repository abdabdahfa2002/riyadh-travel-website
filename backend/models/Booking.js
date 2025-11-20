const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  customerInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    nationalId: {
      type: String,
      trim: true
    },
    nationality: {
      type: String,
      default: 'Saudi Arabia'
    }
  },
  serviceDetails: {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    serviceTitle: {
      type: String,
      required: true
    },
    serviceTitleAr: {
      type: String,
      required: true
    },
    customRequirements: {
      type: String,
      trim: true
    },
    preferredDate: {
      type: Date
    },
    urgent: {
      type: Boolean,
      default: false
    }
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentInfo: {
    totalAmount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'SAR'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'credit_card', 'pending'],
      default: 'pending'
    },
    paid: {
      type: Boolean,
      default: false
    },
    paymentDate: {
      type: Date
    }
  },
  communications: {
    whatsappSent: {
      type: Boolean,
      default: false
    },
    whatsappMessageId: {
      type: String
    },
    emailSent: {
      type: Boolean,
      default: false
    },
    lastContact: {
      type: Date
    }
  },
  notes: {
    admin: {
      type: String,
      trim: true
    },
    customer: {
      type: String,
      trim: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique booking ID
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.bookingId = `BK${timestamp.slice(-6)}${random}`;
  }
  next();
});

// Indexes for better query performance
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ 'customerInfo.phoneNumber': 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
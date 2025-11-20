const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleAr: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  descriptionAr: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['travel', 'labor', 'documents', 'visas', 'government', 'processing'],
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  duration: {
    type: String,
    default: 'غير محدد'
  },
  requirements: [{
    type: String
  }],
  features: [{
    type: String
  }],
  imageUrl: {
    type: String,
    default: '/images/default-service.jpg'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
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

// Index for better search performance
serviceSchema.index({ title: 'text', titleAr: 'text', description: 'text', descriptionAr: 'text' });
serviceSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Service', serviceSchema);
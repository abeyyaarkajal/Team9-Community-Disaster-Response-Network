const mongoose = require('mongoose');

const damageReportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  damageType: {
    type: String,
    enum: ['home', 'agriculture', 'business', 'infrastructure', 'other'],
    required: true
  },
  estimatedLoss: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  documents: [{
    type: String
  }],
  photos: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'verified', 'approved', 'compensated', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  compensationAmount: {
    type: Number
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

module.exports = mongoose.model('DamageReport', damageReportSchema);

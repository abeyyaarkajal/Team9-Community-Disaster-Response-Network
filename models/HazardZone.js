const mongoose = require('mongoose');

const hazardZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['flood_prone', 'landslide', 'cyclone_path', 'earthquake_zone', 'fire_prone'],
    required: true
  },
  coordinates: [{
    lat: Number,
    lng: Number
  }],
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  population: {
    type: Number
  },
  safetyMeasures: [{
    type: String
  }],
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HazardZone', hazardZoneSchema);

const HazardZone = require('../models/HazardZone');

/**
 * Create new hazard zone
 */
exports.createHazardZone = async (req, res) => {
  try {
    const { name, type, coordinates, riskLevel, population, safetyMeasures, description } = req.body;

    if (!name || !type || !riskLevel) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const hazardZone = new HazardZone({
      name,
      type,
      coordinates,
      riskLevel,
      population,
      safetyMeasures,
      description
    });

    await hazardZone.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Hazard zone created successfully', 
      hazardZone 
    });
  } catch (error) {
    console.error('Create hazard zone error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error creating hazard zone', 
      error: error.message 
    });
  }
};

/**
 * Get all hazard zones with filters
 */
exports.getAllHazardZones = async (req, res) => {
  try {
    const { type, riskLevel } = req.query;
    
    let filter = {};
    if (type) filter.type = type;
    if (riskLevel) filter.riskLevel = riskLevel;

    const hazardZones = await HazardZone.find(filter).sort({ riskLevel: -1 });

    res.json({
      success: true,
      count: hazardZones.length,
      hazardZones
    });
  } catch (error) {
    console.error('Get hazard zones error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching hazard zones', 
      error: error.message 
    });
  }
};

/**
 * Get single hazard zone by ID
 */
exports.getHazardZoneById = async (req, res) => {
  try {
    const hazardZone = await HazardZone.findById(req.params.id);

    if (!hazardZone) {
      return res.status(404).json({ message: 'Hazard zone not found' });
    }

    res.json({
      success: true,
      hazardZone
    });
  } catch (error) {
    console.error('Get hazard zone error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching hazard zone', 
      error: error.message 
    });
  }
};

/**
 * Update hazard zone
 */
exports.updateHazardZone = async (req, res) => {
  try {
    const hazardZone = await HazardZone.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!hazardZone) {
      return res.status(404).json({ message: 'Hazard zone not found' });
    }

    res.json({
      success: true,
      message: 'Hazard zone updated successfully',
      hazardZone
    });
  } catch (error) {
    console.error('Update hazard zone error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating hazard zone', 
      error: error.message 
    });
  }
};

/**
 * Delete hazard zone
 */
exports.deleteHazardZone = async (req, res) => {
  try {
    const hazardZone = await HazardZone.findByIdAndDelete(req.params.id);

    if (!hazardZone) {
      return res.status(404).json({ message: 'Hazard zone not found' });
    }

    res.json({
      success: true,
      message: 'Hazard zone deleted successfully'
    });
  } catch (error) {
    console.error('Delete hazard zone error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting hazard zone', 
      error: error.message 
    });
  }
};

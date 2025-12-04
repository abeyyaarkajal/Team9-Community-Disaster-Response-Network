const Alert = require('../models/Alert');

/**
 * Create new alert
 */
exports.createAlert = async (req, res) => {
  try {
    const { type, severity, title, message, affectedAreas, issuedBy, expiresAt } = req.body;

    // Validation
    if (!type || !severity || !title || !message || !issuedBy) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const alert = new Alert({
      type,
      severity,
      title,
      message,
      affectedAreas,
      issuedBy,
      expiresAt
    });

    await alert.save();
    await alert.populate('issuedBy', 'name role');
    
    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      alert
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error creating alert', 
      error: error.message 
    });
  }
};

/**
 * Get all active alerts
 */
exports.getActiveAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ 
      isActive: true,
      $or: [
        { expiresAt: { $gte: new Date() } },
        { expiresAt: null }
      ]
    })
    .populate('issuedBy', 'name role')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching alerts', 
      error: error.message 
    });
  }
};

/**
 * Get single alert by ID
 */
exports.getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate('issuedBy', 'name role');

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({
      success: true,
      alert
    });
  } catch (error) {
    console.error('Get alert error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching alert', 
      error: error.message 
    });
  }
};

/**
 * Deactivate alert
 */
exports.deactivateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({
      success: true,
      message: 'Alert deactivated',
      alert
    });
  } catch (error) {
    console.error('Deactivate alert error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deactivating alert', 
      error: error.message 
    });
  }
};

/**
 * Get alerts by severity
 */
exports.getAlertsBySeverity = async (req, res) => {
  try {
    const { severity } = req.params;

    const alerts = await Alert.find({ severity, isActive: true })
      .populate('issuedBy', 'name role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    console.error('Get alerts by severity error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching alerts', 
      error: error.message 
    });
  }
};

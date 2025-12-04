const DamageReport = require('../models/DamageReport');

/**
 * Submit new damage report
 */
exports.createDamageReport = async (req, res) => {
  try {
    const { reportedBy, damageType, estimatedLoss, description, location, documents, photos } = req.body;

    if (!reportedBy || !damageType || !estimatedLoss || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const damageReport = new DamageReport({
      reportedBy,
      damageType,
      estimatedLoss,
      description,
      location,
      documents,
      photos
    });

    await damageReport.save();
    await damageReport.populate('reportedBy', 'name phone email');
    
    res.status(201).json({ 
      success: true,
      message: 'Damage report submitted successfully', 
      damageReport 
    });
  } catch (error) {
    console.error('Create damage report error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error creating damage report', 
      error: error.message 
    });
  }
};

/**
 * Get all damage reports with filters
 */
exports.getAllDamageReports = async (req, res) => {
  try {
    const { status, damageType } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (damageType) filter.damageType = damageType;

    const damageReports = await DamageReport.find(filter)
      .populate('reportedBy', 'name phone email')
      .populate('verifiedBy', 'name role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: damageReports.length,
      damageReports
    });
  } catch (error) {
    console.error('Get damage reports error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching damage reports', 
      error: error.message 
    });
  }
};

/**
 * Get single damage report by ID
 */
exports.getDamageReportById = async (req, res) => {
  try {
    const damageReport = await DamageReport.findById(req.params.id)
      .populate('reportedBy', 'name phone email location')
      .populate('verifiedBy', 'name role');

    if (!damageReport) {
      return res.status(404).json({ message: 'Damage report not found' });
    }

    res.json({
      success: true,
      damageReport
    });
  } catch (error) {
    console.error('Get damage report error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching damage report', 
      error: error.message 
    });
  }
};

/**
 * Update damage report status
 */
exports.updateDamageReportStatus = async (req, res) => {
  try {
    const { status, verifiedBy, compensationAmount } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updateData = { 
      status, 
      updatedAt: Date.now() 
    };

    if (verifiedBy) updateData.verifiedBy = verifiedBy;
    if (compensationAmount) updateData.compensationAmount = compensationAmount;

    const damageReport = await DamageReport.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    .populate('reportedBy', 'name phone email')
    .populate('verifiedBy', 'name role');

    if (!damageReport) {
      return res.status(404).json({ message: 'Damage report not found' });
    }

    res.json({
      success: true,
      message: 'Damage report updated successfully',
      damageReport
    });
  } catch (error) {
    console.error('Update damage report error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating damage report', 
      error: error.message 
    });
  }
};

/**
 * Get damage report statistics
 */
exports.getDamageReportStats = async (req, res) => {
  try {
    const stats = await DamageReport.aggregate([
      {
        $group: {
          _id: '$damageType',
          count: { $sum: 1 },
          totalLoss: { $sum: '$estimatedLoss' }
        }
      }
    ]);

    const statusStats = await DamageReport.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        byDamageType: stats,
        byStatus: statusStats,
        totalReports: await DamageReport.countDocuments()
      }
    });
  } catch (error) {
    console.error('Get damage report stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching statistics', 
      error: error.message 
    });
  }
};

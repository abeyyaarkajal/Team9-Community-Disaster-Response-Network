const Incident = require('../models/Incident');

/**
 * Create new incident report
 */
exports.createIncident = async (req, res) => {
  try {
    const { type, description, location, severity, reportedBy, isSOS } = req.body;

    // Validation
    if (!type || !description || !location || !reportedBy) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const incident = new Incident({
      type,
      description,
      location,
      severity: severity || 'medium',
      reportedBy,
      isSOS: isSOS || false
    });

    await incident.save();
    
    // Populate reporter details
    await incident.populate('reportedBy', 'name phone email');

    res.status(201).json({
      success: true,
      message: 'Incident reported successfully',
      incident
    });
  } catch (error) {
    console.error('Create incident error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error creating incident', 
      error: error.message 
    });
  }
};

/**
 * Get all incidents with filters
 */
exports.getAllIncidents = async (req, res) => {
  try {
    const { status, severity, type, isSOS } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (type) filter.type = type;
    if (isSOS) filter.isSOS = isSOS === 'true';

    const incidents = await Incident.find(filter)
      .populate('reportedBy', 'name phone email')
      .populate('assignedTo', 'name phone skills')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: incidents.length,
      incidents
    });
  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching incidents', 
      error: error.message 
    });
  }
};

/**
 * Get single incident by ID
 */
exports.getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'name phone email location')
      .populate('assignedTo', 'name phone skills');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json({
      success: true,
      incident
    });
  } catch (error) {
    console.error('Get incident error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching incident', 
      error: error.message 
    });
  }
};

/**
 * Assign incident to volunteer
 */
exports.assignIncident = async (req, res) => {
  try {
    const { volunteerId } = req.body;

    if (!volunteerId) {
      return res.status(400).json({ message: 'Volunteer ID is required' });
    }

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo: volunteerId,
        status: 'assigned',
        updatedAt: Date.now()
      },
      { new: true }
    )
    .populate('reportedBy', 'name phone')
    .populate('assignedTo', 'name phone skills');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json({
      success: true,
      message: 'Incident assigned successfully',
      incident
    });
  } catch (error) {
    console.error('Assign incident error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error assigning incident', 
      error: error.message 
    });
  }
};

/**
 * Update incident status
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['pending', 'assigned', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    )
    .populate('reportedBy', 'name phone')
    .populate('assignedTo', 'name phone');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      incident
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating status', 
      error: error.message 
    });
  }
};

/**
 * Delete incident
 */
exports.deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json({ 
      success: true,
      message: 'Incident deleted successfully' 
    });
  } catch (error) {
    console.error('Delete incident error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting incident', 
      error: error.message 
    });
  }
};

/**
 * Get incident statistics
 */
exports.getIncidentStats = async (req, res) => {
  try {
    const stats = await Incident.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const severityStats = await Incident.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    const typeStats = await Incident.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        byStatus: stats,
        bySeverity: severityStats,
        byType: typeStats,
        total: await Incident.countDocuments()
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching statistics', 
      error: error.message 
    });
  }
};



exports.sendPushNotification = async (userId, notification) => {
  console.log(`Push notification to user ${userId}:`, notification);
  
  return {
    success: true,
    message: 'Notification sent (placeholder)'
  };
};

exports.sendBulkNotifications = async (userIds, notification) => {
  const results = await Promise.all(
    userIds.map(userId => this.sendPushNotification(userId, notification))
  );
  
  return {
    success: true,
    sent: results.length
  };
};

exports.notifyNearbyVolunteers = async (incident) => {
  const User = require('../models/User');
  const { calculateDistance } = require('./geocoding');

  const volunteers = await User.find({ role: 'volunteer' });
  
  const nearbyVolunteers = volunteers.filter(volunteer => {
    if (!volunteer.location) return false;
    
    const distance = calculateDistance(
      incident.location.lat,
      incident.location.lng,
      volunteer.location.lat,
      volunteer.location.lng
    );
    
    return distance <= 10;
  });

  await this.sendBulkNotifications(
    nearbyVolunteers.map(v => v._id),
    {
      title: '🚨 Emergency SOS Nearby',
      body: `${incident.type} incident reported within 10km. Tap to respond.`,
      data: { incidentId: incident._id }
    }
  );

  return nearbyVolunteers.length;
};

exports.broadcastAlert = async (alert) => {
  const User = require('../models/User');
  
  const users = await User.find({
    'location.address': { $in: alert.affectedAreas.map(area => new RegExp(area, 'i')) }
  });

  await this.sendBulkNotifications(
    users.map(u => u._id),
    {
      title: `⚠️ ${alert.severity.toUpperCase()} ALERT`,
      body: alert.title,
      data: { alertId: alert._id }
    }
  );

  return users.length;
};

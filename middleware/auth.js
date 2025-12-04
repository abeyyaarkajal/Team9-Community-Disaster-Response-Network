const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify JWT token and attach user to request
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * Check if user has specific role
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }

    next();
  };
};

/**
 * Verify user owns the resource
 */
exports.checkOwnership = (resourceUserField = 'reportedBy') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const model = req.baseUrl.includes('incident') ? 'Incident' :
                    req.baseUrl.includes('damage') ? 'DamageReport' : null;

      if (!model) {
        return next();
      }

      const Model = require(`../models/${model}`);
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Allow if user is owner or authority
      if (resource[resourceUserField].toString() !== req.user._id.toString() 
          && req.user.role !== 'authority') {
        return res.status(403).json({ message: 'Not authorized to modify this resource' });
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

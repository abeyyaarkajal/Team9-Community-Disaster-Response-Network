const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');

/**
 * Sanitize data to prevent NoSQL injection
 */
exports.sanitizeData = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized key: ${key} in request`);
  },
});

/**
 * Prevent XSS attacks
 */
exports.preventXSS = xss();

/**
 * Set security headers
 */
exports.setSecurityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
});

/**
 * Custom sanitizer for user input
 */
exports.sanitizeInput = (req, res, next) => {
  // Remove any HTML tags from string fields
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>/g, '').trim();
  };

  // Recursively sanitize object
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeString(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

const fs = require('fs');
const path = require('path');


const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}


exports.requestLogger = (req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    body: req.body
  };

  
  if (logData.body && logData.body.password) {
    logData.body.password = '[HIDDEN]';
  }

  const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, JSON.stringify(logData) + '\n');

  next();
};


exports.consoleLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  next();
};


exports.errorLogger = (err, req, res, next) => {
  const errorData = {
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress
  };

  const errorFile = path.join(logsDir, `error-${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(errorFile, JSON.stringify(errorData) + '\n');

  next(err);
};

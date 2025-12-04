const nodemailer = require('nodemailer');

/**
 * Send email utility
 */
const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send SOS alert email
 */
const sendSOSAlert = async (incident, user) => {
  const message = `
    🚨 EMERGENCY SOS ALERT

    User: ${user.name}
    Phone: ${user.phone}
    Location: ${incident.location.address}
    
    Description: ${incident.description}
    
    Time: ${new Date(incident.createdAt).toLocaleString()}
    
    Please respond immediately!
  `;

  await sendEmail({
    email: process.env.EMERGENCY_EMAIL,
    subject: '🚨 EMERGENCY SOS - Immediate Response Required',
    message,
  });
};

/**
 * Send alert notification
 */
const sendAlertNotification = async (alert, users) => {
  const message = `
    ⚠️ DISASTER ALERT

    Type: ${alert.type.toUpperCase()}
    Severity: ${alert.severity.toUpperCase()}
    
    ${alert.title}
    
    ${alert.message}
    
    Affected Areas: ${alert.affectedAreas.join(', ')}
    
    Stay safe and follow emergency protocols.
  `;

  // Send to all users in affected areas
  for (const user of users) {
    await sendEmail({
      email: user.email,
      subject: `⚠️ ${alert.severity.toUpperCase()} ALERT: ${alert.title}`,
      message,
    });
  }
};

module.exports = { sendEmail, sendSOSAlert, sendAlertNotification };

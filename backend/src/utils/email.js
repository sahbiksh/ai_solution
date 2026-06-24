const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendInquiryNotification = async (inquiry) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('[Email Simulation] New inquiry received:');
    console.log(`  From: ${inquiry.fullName} <${inquiry.email}>`);
    console.log(`  Company: ${inquiry.companyName} (${inquiry.country})`);
    console.log(`  Details: ${inquiry.jobDetails.substring(0, 100)}...`);
    return { simulated: true };
  }

  const mailOptions = {
    from: `"AI-Solutions" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Customer Inquiry from ${inquiry.fullName}`,
    html: `
      <h2>New Customer Inquiry</h2>
      <p><strong>Name:</strong> ${inquiry.fullName}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      <p><strong>Phone:</strong> ${inquiry.phone}</p>
      <p><strong>Company:</strong> ${inquiry.companyName}</p>
      <p><strong>Country:</strong> ${inquiry.country}</p>
      <p><strong>Job Title:</strong> ${inquiry.jobTitle}</p>
      <p><strong>Service Interest:</strong> ${inquiry.serviceInterest}</p>
      <p><strong>Requirements:</strong></p>
      <p>${inquiry.jobDetails}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  return { sent: true };
};

const sendConfirmationEmail = async (inquiry) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[Email Simulation] Confirmation sent to ${inquiry.email}`);
    return { simulated: true };
  }

  const mailOptions = {
    from: `"AI-Solutions" <${process.env.SMTP_USER}>`,
    to: inquiry.email,
    subject: 'Thank you for contacting AI-Solutions',
    html: `
      <h2>Thank you, ${inquiry.fullName}!</h2>
      <p>We have received your inquiry and our team will get back to you within 2 business days.</p>
      <p>Reference: ${inquiry._id}</p>
      <br>
      <p>Best regards,<br>AI-Solutions Team<br>Sunderland, UK</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  return { sent: true };
};

module.exports = { sendInquiryNotification, sendConfirmationEmail };

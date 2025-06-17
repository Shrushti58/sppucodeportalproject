const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"SPPU Code Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    });
    console.log(`📨 Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Email sending failed:', err);
    throw err;
  }
};

module.exports = sendEmail;

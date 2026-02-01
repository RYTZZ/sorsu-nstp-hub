const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
}

async function sendConcernConfirmation(concern) {
  const subject = `Concern Submitted - Reference: ${concern.referenceNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #FF6B35;">Concern Submitted Successfully</h2>
      <p>Dear ${concern.name},</p>
      <p>Your concern has been received and is being processed by our team.</p>
      <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #FF6B35; margin: 20px 0;">
        <p><strong>Reference Number:</strong> ${concern.referenceNumber}</p>
        <p><strong>Subject:</strong> ${concern.subject}</p>
        <p><strong>Status:</strong> ${concern.status}</p>
      </div>
      <p>You can track your concern status using the reference number above.</p>
      <p>Best regards,<br>SorSU NSTP Hub Team</p>
    </div>
  `;
  return await sendEmail({ to: concern.email, subject, html });
}

async function sendGWAConfirmation(submission) {
  const qualificationStatus = submission.isQualified ? 'Qualified' : 'Disqualified';
  const statusColor = submission.isQualified ? '#28a745' : '#dc3545';
  
  const subject = `GWA Submission - Reference: ${submission.referenceNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #FF6B35;">GWA Submission Received</h2>
      <p>Dear ${submission.firstName} ${submission.lastName},</p>
      <p>Your GWA has been calculated and submitted for Top 10 Evaluation.</p>
      <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #FF6B35; margin: 20px 0;">
        <p><strong>Reference Number:</strong> ${submission.referenceNumber}</p>
        <p><strong>GWA:</strong> ${submission.gwa}</p>
        <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${qualificationStatus}</span></p>
      </div>
      <p>You can track your submission status using the reference number above.</p>
      <p>Best regards,<br>SorSU NSTP Hub Team</p>
    </div>
  `;
  return await sendEmail({ to: submission.email, subject, html });
}

module.exports = {
  sendEmail,
  sendConcernConfirmation,
  sendGWAConfirmation
};

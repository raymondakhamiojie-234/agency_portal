import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'support@falcusmediaagency.com';

/**
 * Send an email notification
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML email body
 */
export async function sendNotificationEmail(to, subject, html) {
  try {
    const data = await resend.emails.send({
      from: `Falcus Media <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw the error so that the main flow isn't interrupted if email fails
    return null;
  }
}

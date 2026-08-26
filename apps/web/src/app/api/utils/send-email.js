/**
 * Simple email sending utility using Resend
 * This is a simpler version that returns an object with id
 * For more advanced email functions, see email.js
 */

export async function sendEmail({ to, from, subject, html, text }) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY not configured");
      throw new Error(
        "Email service not configured. Please add RESEND_API_KEY environment variable.",
      );
    }

    // Use FROM_EMAIL environment variable for sender address
    const defaultFrom =
      process.env.FROM_EMAIL || "noreply@falcusmediaagency.com";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from || defaultFrom,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("✅ Email sent successfully to:", to);
    return { id: data.id };
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw error;
  }
}

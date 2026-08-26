import { getSession } from "@/app/api/utils/auth";

export async function POST(req) {
  try {
    const session = await getSession(req);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, page_name, subject, message } = body;

    // In a real application, you would use an email service like Resend, SendGrid, etc.
    // For now, we'll log the email details
    console.log("📧 Support Email Request:");
    console.log("To: support@falcusmedia.com");
    console.log("From:", email);
    console.log("Name:", name);
    console.log("Page:", page_name);
    console.log("Subject:", subject);
    console.log("Message:", message);

    // Here you would integrate with an email service
    // Example with a hypothetical email service:
    // await emailService.send({
    //   to: "support@falcusmedia.com",
    //   from: email,
    //   subject: `Support Request: ${subject}`,
    //   html: `
    //     <h2>Support Request from ${name}</h2>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Page Name:</strong> ${page_name || 'N/A'}</p>
    //     <p><strong>Subject:</strong> ${subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `
    // });

    return Response.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}

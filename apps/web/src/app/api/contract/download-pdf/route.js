import { getSession } from "@/app/api/utils/auth";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get creator profile
    const profiles = await sql`
      SELECT id, full_name FROM creator_profiles WHERE user_id = ${session.user.id}
    `;

    if (profiles.length === 0) {
      return Response.json(
        { error: "Creator profile not found" },
        { status: 404 },
      );
    }

    const creatorId = profiles[0].id;
    const creatorName = profiles[0].full_name;

    // Get signed contract
    const contracts = await sql`
      SELECT * FROM contracts 
      WHERE creator_id = ${creatorId} 
      AND status = 'Signed'
      ORDER BY signed_at DESC
      LIMIT 1
    `;

    if (contracts.length === 0) {
      return Response.json(
        { error: "No signed contract found" },
        { status: 404 },
      );
    }

    const contract = contracts[0];

    // Generate HTML for PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      margin: 2cm;
      size: A4;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      line-height: 1.6;
      color: #000;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 2px solid #726BFF;
      padding-bottom: 20px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #726BFF;
      margin-bottom: 10px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      margin-top: 20px;
      color: #111;
    }
    .contract-body {
      white-space: pre-wrap;
      font-size: 12px;
      margin: 30px 0;
    }
    .signature-section {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 1px solid #ccc;
    }
    .signature-line {
      margin-top: 20px;
      padding-top: 20px;
    }
    .signature-name {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 5px;
    }
    .signature-date {
      color: #666;
      font-size: 12px;
    }
    .metadata {
      margin-top: 10px;
      font-size: 10px;
      color: #666;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ccc;
      font-size: 10px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">FALCUS MEDIA</div>
    <div class="title">Creator Monetization Agreement</div>
  </div>

  <div class="contract-body">${contract.contract_text}</div>

  <div class="signature-section">
    <h3 style="margin-bottom: 30px;">Digital Signature</h3>
    
    <div class="signature-line">
      <div class="signature-name">Signed by: ${contract.signature_name}</div>
      <div class="signature-date">Date: ${new Date(
        contract.signed_at,
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })}</div>
      <div class="metadata">
        IP Address: ${contract.signature_ip || "Not recorded"}<br>
        Contract ID: ${contract.id}<br>
        Revenue Share: ${100 - contract.revenue_share_percentage}% to Creator, ${contract.revenue_share_percentage}% to Falcus Media
      </div>
    </div>
  </div>

  <div class="footer">
    <p>This is a legally binding digital contract between ${creatorName} and Falcus Media.</p>
    <p>Document generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
  </div>
</body>
</html>
    `;

    // Use the PDF Generation integration
    const baseUrl =
      process.env.NEXT_PUBLIC_CREATE_APP_URL || "http://localhost:3000";
    const pdfResponse = await fetch(
      `${baseUrl}/integrations/pdf-generation/pdf`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: {
            html: html,
          },
        }),
      },
    );

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      console.error("PDF generation failed:", errorText);
      throw new Error("Failed to generate PDF");
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    // Return PDF with appropriate headers
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Falcus_Media_Contract_${contract.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return Response.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}

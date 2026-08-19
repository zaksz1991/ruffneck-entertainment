/**
 * RuffNeck Entertainment – Lead Magnet Delivery Script
 * Final commercial version with Drive attachment + Sheet logging
 * 
 * SETUP:
 * 1. Paste this entire code into a new Apps Script project
 * 2. Update SHEET_ID below (optional but recommended)
 * 3. Run the "setup" function once and grant permissions
 * 4. Deploy → New deployment → Web app → Anyone
 * 5. Copy the Web App URL into js/lead-magnet.js
 */

const CONFIG = {
  OWNER_EMAIL: "ruffneckhassan@gmail.com",

  // Optional: Create a Google Sheet and paste its ID here to log all leads
  // Example: https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit  → ID is 1ABC...XYZ
  SHEET_ID: "",

  PDF_DRIVE_FILE_ID: "1EVLy1k4wD3NTasr3lTUyv1VWPFeeGeui",
  PDF_PUBLIC_URL: "https://ruffneck-entertainment.vercel.app/20_AI_Prompts_RuffNeck.pdf",
  EMAIL_SUBJECT: "Your Free Guide: 20 AI Prompts Every Nigerian Business Should Be Using"
};


function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({
        status: "error",
        message: "No data received. This function only works via POST from the website."
      });
    }

    const data = JSON.parse(e.postData.contents);

    const name     = (data.customer_name || "there").trim();
    const email    = (data.customer_email || "").trim().toLowerCase();
    const resource = data.resource || "20 AI Prompts for Nigerian Businesses";
    const pdfUrl   = data.pdf_url || CONFIG.PDF_PUBLIC_URL;
    const date     = data.date || new Date().toISOString();
    const source   = data.source || "Website";

    if (!email || !email.includes("@")) {
      return jsonResponse({ status: "error", message: "Invalid email address" });
    }

    logLead(name, email, resource, date, source);
    sendGuideEmail(name, email, pdfUrl);
    notifyOwner(name, email, resource);

    return jsonResponse({ status: "success", message: "Guide sent successfully" });

  } catch (err) {
    console.error("doPost error:", err);
    try {
      MailApp.sendEmail({
        to: CONFIG.OWNER_EMAIL,
        subject: "⚠️ Lead Magnet Script Error",
        body: "Error: " + err.message + "\n\nStack: " + err.stack
      });
    } catch (e2) {}
    return jsonResponse({ status: "error", message: err.message });
  }
}


function sendGuideEmail(name, email, pdfUrl) {
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <div style="background: #0A0F1E; padding: 24px; text-align: center;">
        <h1 style="color: #00C2FF; margin: 0; font-size: 22px;">RuffNeck Entertainment</h1>
        <p style="color: #94a3b8; margin: 6px 0 0; font-size: 13px;">AI Solutions · Digital Operations · Business Growth</p>
      </div>

      <div style="padding: 32px 24px; background: #ffffff;">
        <h2 style="color: #0A0F1E; margin-top: 0;">Hi ${escapeHtml(name)},</h2>
        <p>Thank you for requesting the free guide.</p>
        <p style="font-size: 16px; font-weight: 600; color: #0A0F1E;">
          20 AI Prompts Every Nigerian Business Should Be Using
        </p>
        <p>These ready-to-use prompts will help you with marketing, sales, operations, content, customer service, and career growth.</p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${pdfUrl}" 
             style="background: #00C2FF; color: #0A0F1E; padding: 14px 28px; 
                    text-decoration: none; font-weight: 700; border-radius: 8px; 
                    display: inline-block; font-size: 15px;">
            Download Your Free PDF Guide →
          </a>
        </div>

        <p style="font-size: 14px; color: #64748b;">
          Just click the button above. The guide opens instantly.
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;">

        <p style="font-size: 14px;">
          Need help implementing AI in your business?<br>
          WhatsApp me: <strong>+234 803 380 7856</strong><br>
          or reply to this email.
        </p>

        <p style="margin-bottom: 0;">
          To your growth,<br>
          <strong>Hassan Zakariya</strong><br>
          Founder, RuffNeck Entertainment
        </p>
      </div>

      <div style="background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b;">
        © ${new Date().getFullYear()} RuffNeck Entertainment · Nigeria · Africa · Global
      </div>
    </div>
  `;

  const options = {
    to: email,
    subject: CONFIG.EMAIL_SUBJECT,
    htmlBody: htmlBody,
    name: "RuffNeck Entertainment",
    replyTo: CONFIG.OWNER_EMAIL
  };

  // Attach PDF from Drive (safe – continues even if it fails)
  if (CONFIG.PDF_DRIVE_FILE_ID) {
    try {
      const file = DriveApp.getFileById(CONFIG.PDF_DRIVE_FILE_ID);
      options.attachments = [file.getAs(MimeType.PDF)];
    } catch (driveErr) {
      console.warn("Drive attachment failed:", driveErr.message);
    }
  }

  MailApp.sendEmail(options);
}


function notifyOwner(name, email, resource) {
  MailApp.sendEmail({
    to: CONFIG.OWNER_EMAIL,
    subject: "🎯 New Lead Magnet Download – " + name,
    body: 
      "New free guide request:\n\n" +
      "Name: " + name + "\n" +
      "Email: " + email + "\n" +
      "Resource: " + resource + "\n" +
      "Time: " + new Date().toLocaleString() + "\n\n" +
      "The guide has been sent to the customer."
  });
}


function logLead(name, email, resource, date, source) {
  try {
    if (!CONFIG.SHEET_ID || CONFIG.SHEET_ID.trim() === "") return;

    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet = ss.getSheetByName("Leads");

    if (!sheet) {
      sheet = ss.insertSheet("Leads");
      sheet.appendRow(["Timestamp", "Name", "Email", "Resource", "Source"]);
      sheet.getRange(1, 1, 1, 5).setFontWeight("bold");
    }

    sheet.appendRow([new Date(date), name, email, resource, source || "Website"]);
  } catch (err) {
    console.error("Logging error:", err.message);
  }
}


function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}


function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


function setup() {
  MailApp.sendEmail({
    to: CONFIG.OWNER_EMAIL,
    subject: "✅ RuffNeck Lead Magnet – Setup Successful",
    body: "Script is authorized and ready.\n\nDeploy it as a Web App if you haven't already."
  });

  try {
    const file = DriveApp.getFileById(CONFIG.PDF_DRIVE_FILE_ID);
    Logger.log("Drive file found: " + file.getName());
  } catch (e) {
    Logger.log("Drive error: " + e.message);
  }
}


function testDoPost() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        type: "lead_magnet",
        customer_name: "Test User",
        customer_email: CONFIG.OWNER_EMAIL,
        resource: "20 AI Prompts for Nigerian Businesses",
        pdf_url: CONFIG.PDF_PUBLIC_URL,
        date: new Date().toISOString(),
        source: "Manual Test"
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log(result.getContent());
}

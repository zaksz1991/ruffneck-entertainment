/**
 * RuffNeck Entertainment – Free CMS + Forms
 * Google Apps Script (100% free – no paid APIs)
 *
 * Features:
 * - Lead magnet, contact, webinar, newsletter
 * - Products & Blog stored in Google Sheet (public read via doGet)
 * - Admin writes via doPost (type: admin_product / admin_blog)
 *
 * SETUP:
 * 1. Paste into Apps Script bound to your Sheet OR standalone with SHEET_ID set
 * 2. Run setup() once – grants permissions + creates tabs
 * 3. Deploy → Web app → Execute as: Me → Who has access: Anyone
 * 4. Use the Web App URL in js/cms.js and js/forms.js
 */

const CONFIG = {
  OWNER_EMAIL: "ruffneckhassan@gmail.com",
  SHEET_ID: "1laTcMbuNHXMti-JwoCLQbR-VaiuwVvJrwIniF9B2bFo",
  PDF_DRIVE_FILE_ID: "1EVLy1k4wD3NTasr3lTUyv1VWPFeeGeui",
  PDF_PUBLIC_URL: "https://ruffneck-entertainment.vercel.app/20_AI_Prompts_RuffNeck.pdf",
  EMAIL_SUBJECT: "Your Free Guide: 20 AI Prompts Every Nigerian Business Should Be Using",
  // Simple write key – change this. Must match admin panel.
  ADMIN_KEY: "ruffneck2026admin"
};

function doGet(e) {
  try {
    const action = (e.parameter.action || "ping").toLowerCase();
    if (action === "products") {
      return jsonResponse({ status: "success", products: listProducts() });
    }
    if (action === "blog") {
      return jsonResponse({ status: "success", posts: listBlogPosts(true) });
    }
    if (action === "blog_all") {
      // includes drafts – requires key
      if (e.parameter.key !== CONFIG.ADMIN_KEY) {
        return jsonResponse({ status: "error", message: "Unauthorized" });
      }
      return jsonResponse({ status: "success", posts: listBlogPosts(false) });
    }
    return jsonResponse({ status: "ok", message: "RuffNeck CMS API", actions: ["products", "blog"] });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.message });
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: "error", message: "No data received" });
    }
    const data = JSON.parse(e.postData.contents);
    const type = (data.type || "").toLowerCase();

    if (type === "contact") return handleContact(data);
    if (type === "webinar") return handleWebinar(data);
    if (type === "newsletter") return handleNewsletter(data);
    if (type === "lead_magnet") return handleLeadMagnet(data);
    if (type === "admin_product") return handleAdminProduct(data);
    if (type === "admin_blog") return handleAdminBlog(data);
    if (type === "admin_delete_product") return handleDeleteProduct(data);
    if (type === "admin_delete_blog") return handleDeleteBlog(data);

    // default legacy
    return handleLeadMagnet(data);
  } catch (err) {
    console.error(err);
    try {
      MailApp.sendEmail({
        to: CONFIG.OWNER_EMAIL,
        subject: "⚠️ RuffNeck CMS Error",
        body: err.message + "\n" + err.stack
      });
    } catch (e2) {}
    return jsonResponse({ status: "error", message: err.message });
  }
}

/* ═══════ PRODUCTS ═══════ */

function handleAdminProduct(data) {
  if (data.admin_key !== CONFIG.ADMIN_KEY) {
    return jsonResponse({ status: "error", message: "Unauthorized" });
  }
  const ss = getSS();
  const sheet = getOrCreateSheet_(ss, "Products", [
    "id", "name", "category", "emoji", "desc", "fullDesc",
    "priceBeg", "labelBeg", "pdfBeg",
    "priceMid", "labelMid", "pdfMid",
    "priceAdv", "labelAdv", "pdfAdv",
    "imageUrl", "videoUrl", "status", "createdAt"
  ]);

  const id = data.id || ("p" + Date.now());
  const row = [
    id,
    data.name || "",
    data.category || data.cat || "",
    data.emoji || "📦",
    data.desc || "",
    data.fullDesc || "",
    data.priceBeg || "",
    data.labelBeg || "Beginner",
    data.pdfBeg || "",
    data.priceMid || "",
    data.labelMid || "Intermediate",
    data.pdfMid || "",
    data.priceAdv || "",
    data.labelAdv || "Advanced",
    data.pdfAdv || "",
    data.imageUrl || "",
    data.videoUrl || "",
    data.status || "active",
    data.createdAt || new Date().toISOString()
  ];

  // Update if id exists
  const values = sheet.getDataRange().getValues();
  let updated = false;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
      updated = true;
      break;
    }
  }
  if (!updated) sheet.appendRow(row);

  return jsonResponse({ status: "success", id: id, message: updated ? "Product updated" : "Product added" });
}

function handleDeleteProduct(data) {
  if (data.admin_key !== CONFIG.ADMIN_KEY) {
    return jsonResponse({ status: "error", message: "Unauthorized" });
  }
  const sheet = getSS().getSheetByName("Products");
  if (!sheet) return jsonResponse({ status: "error", message: "No products sheet" });
  const values = sheet.getDataRange().getValues();
  for (let i = values.length - 1; i >= 1; i--) {
    if (String(values[i][0]) === String(data.id)) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ status: "success", message: "Deleted" });
    }
  }
  return jsonResponse({ status: "error", message: "Not found" });
}

function listProducts() {
  const sheet = getSS().getSheetByName("Products");
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const out = [];
  for (let i = 1; i < values.length; i++) {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = values[i][idx]; });
    if (String(obj.status || "active").toLowerCase() === "active") {
      out.push(normalizeProduct_(obj));
    }
  }
  return out;
}

function normalizeProduct_(o) {
  const tiers = [];
  if (o.priceBeg !== "" && o.priceBeg != null) {
    tiers.push({
      level: "🟢 " + (o.labelBeg || "Beginner"),
      price: Number(o.priceBeg) || 0,
      desc: o.fullDesc || o.desc || "",
      includes: String(o.fullDesc || o.desc || "").split("\n").filter(Boolean),
      pdf: o.pdfBeg || ""
    });
  }
  if (o.priceMid !== "" && o.priceMid != null) {
    tiers.push({
      level: "🔵 " + (o.labelMid || "Intermediate"),
      price: Number(o.priceMid) || 0,
      desc: o.fullDesc || o.desc || "",
      includes: String(o.fullDesc || o.desc || "").split("\n").filter(Boolean),
      pdf: o.pdfMid || ""
    });
  }
  if (o.priceAdv !== "" && o.priceAdv != null) {
    tiers.push({
      level: "⭐ " + (o.labelAdv || "Advanced"),
      price: Number(o.priceAdv) || 0,
      desc: o.fullDesc || o.desc || "",
      includes: String(o.fullDesc || o.desc || "").split("\n").filter(Boolean),
      pdf: o.pdfAdv || ""
    });
  }
  return {
    id: String(o.id),
    name: o.name,
    cat: o.category || o.cat || "",
    emoji: o.emoji || "📦",
    desc: o.desc || "",
    fullDesc: o.fullDesc || "",
    imageUrl: o.imageUrl || "",
    videoUrl: o.videoUrl || "",
    status: o.status || "active",
    tiers: tiers
  };
}

/* ═══════ BLOG ═══════ */

function handleAdminBlog(data) {
  if (data.admin_key !== CONFIG.ADMIN_KEY) {
    return jsonResponse({ status: "error", message: "Unauthorized" });
  }
  const ss = getSS();
  const sheet = getOrCreateSheet_(ss, "BlogPosts", [
    "id", "title", "label", "category", "meta", "excerpt", "body",
    "imageUrl", "videoUrl", "status", "createdAt"
  ]);

  const id = data.id || ("b" + Date.now());
  const row = [
    id,
    data.title || "",
    data.label || data.category || "Article",
    data.category || "",
    data.meta || "",
    data.excerpt || data.desc || "",
    data.body || "",
    data.imageUrl || "",
    data.videoUrl || "",
    data.status || "published",
    data.createdAt || new Date().toISOString()
  ];

  const values = sheet.getDataRange().getValues();
  let updated = false;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
      updated = true;
      break;
    }
  }
  if (!updated) sheet.appendRow(row);

  return jsonResponse({ status: "success", id: id, message: updated ? "Post updated" : "Post published" });
}

function handleDeleteBlog(data) {
  if (data.admin_key !== CONFIG.ADMIN_KEY) {
    return jsonResponse({ status: "error", message: "Unauthorized" });
  }
  const sheet = getSS().getSheetByName("BlogPosts");
  if (!sheet) return jsonResponse({ status: "error", message: "No blog sheet" });
  const values = sheet.getDataRange().getValues();
  for (let i = values.length - 1; i >= 1; i--) {
    if (String(values[i][0]) === String(data.id)) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ status: "success", message: "Deleted" });
    }
  }
  return jsonResponse({ status: "error", message: "Not found" });
}

function listBlogPosts(publishedOnly) {
  const sheet = getSS().getSheetByName("BlogPosts");
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const out = [];
  for (let i = 1; i < values.length; i++) {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = values[i][idx]; });
    const st = String(obj.status || "published").toLowerCase();
    if (publishedOnly && st !== "published" && st !== "active") continue;
    out.push({
      id: String(obj.id),
      title: obj.title || "",
      label: obj.label || obj.category || "Article",
      category: obj.category || "",
      meta: obj.meta || "",
      excerpt: obj.excerpt || "",
      body: obj.body || "",
      imageUrl: obj.imageUrl || "",
      videoUrl: obj.videoUrl || "",
      status: obj.status || "published",
      createdAt: obj.createdAt || ""
    });
  }
  return out;
}

/* ═══════ FORMS (existing) ═══════ */


/* ═══════ PROFESSIONAL EMAIL TEMPLATES ═══════ */

function emailLayout_(title, bodyHtml) {
  return '' +
    '<div style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:24px 12px;">' +
    '<tr><td align="center">' +
    '<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(11,30,58,0.08);">' +
    '<tr><td style="background:#0A0F1E;padding:28px 32px;text-align:center;">' +
    '<div style="font-size:20px;font-weight:700;color:#00C2FF;letter-spacing:0.3px;">RuffNeck Entertainment</div>' +
    '<div style="font-size:12px;color:#94a3b8;margin-top:6px;">AI Solutions · Digital Operations · Business Growth</div>' +
    '</td></tr>' +
    '<tr><td style="padding:32px 28px;color:#1e293b;font-size:15px;line-height:1.65;">' +
    bodyHtml +
    '</td></tr>' +
    '<tr><td style="background:#f8fafc;padding:20px 28px;border-top:1px solid #e2e8f0;">' +
    '<div style="font-size:13px;color:#64748b;line-height:1.5;">' +
    '<strong style="color:#0B1E3A;">Hassan Zakariya</strong><br>' +
    'Founder &amp; CEO, RuffNeck Entertainment<br>' +
    'WhatsApp: <a href="https://wa.me/2348033807856" style="color:#00B4D8;text-decoration:none;">+234 803 380 7856</a><br>' +
    'Email: <a href="mailto:ruffneckhassan@gmail.com" style="color:#00B4D8;text-decoration:none;">ruffneckhassan@gmail.com</a><br>' +
    '<a href="https://ruffneck-entertainment.vercel.app/" style="color:#00B4D8;text-decoration:none;">ruffneck-entertainment.vercel.app</a>' +
    '</div>' +
    '<div style="font-size:11px;color:#94a3b8;margin-top:16px;">' +
    'CAC Reg. 3770977 · SMEDAN Certified · Nigeria · Africa · Global' +
    '</div></td></tr></table></td></tr></table></div>';
}

function detectIntent_(service, message) {
  var s = ((service || "") + " " + (message || "")).toLowerCase();
  if (/partner|sponsor|sponsorship|collaboration|affiliate/.test(s)) return "partnership";
  if (/quote|pricing|price|cost|proposal|estimate/.test(s)) return "quote";
  if (/consult|advisory|strategy|roadmap|discovery|book a call|30.?min/.test(s)) return "consultation";
  if (/webinar|training session|workshop/.test(s)) return "webinar";
  return "general";
}

function clientAutoReply_(intent, firstName, service) {
  var name = firstName || "there";
  var serviceLine = service ? "<p style=\"margin:12px 0;\"><strong>Regarding:</strong> " + escapeHtml(service) + "</p>" : "";

  if (intent === "partnership") {
    return {
      subject: "Thank you for your partnership enquiry — RuffNeck Entertainment",
      html: emailLayout_("Partnership",
        "<p>Dear " + escapeHtml(name) + ",</p>" +
        "<p>Thank you for your interest in partnering with <strong>RuffNeck Entertainment</strong>.</p>" +
        serviceLine +
        "<p>We work with organisations, sponsors, and collaborators who share our focus on practical AI adoption, digital operations, and business growth across Nigeria, Africa, and global markets.</p>" +
        "<p>Our team will review your message and respond within <strong>1–2 business days</strong> with next steps.</p>" +
        "<p>If your request is time-sensitive, WhatsApp us on <strong>+234 803 380 7856</strong>.</p>" +
        "<p style=\"margin-top:24px;\">We look forward to exploring how we can create value together.</p>" +
        "<p>Kind regards,</p>")
    };
  }

  if (intent === "quote") {
    return {
      subject: "We received your quote request — RuffNeck Entertainment",
      html: emailLayout_("Quote",
        "<p>Dear " + escapeHtml(name) + ",</p>" +
        "<p>Thank you for requesting a quote from <strong>RuffNeck Entertainment</strong>.</p>" +
        serviceLine +
        "<p>We prepare clear, scope-based proposals so you know exactly what is included, timelines, and investment.</p>" +
        "<p>You can expect a response within <strong>24–48 hours</strong> (business days). To speed things up, you may also book a short discovery call:</p>" +
        "<p style=\"text-align:center;margin:28px 0;\"><a href=\"https://calendly.com/hassanzakariyabiz/30min\" style=\"background:#00C2FF;color:#0A0F1E;padding:14px 26px;text-decoration:none;font-weight:700;border-radius:8px;display:inline-block;\">Book a Free 30-min Call</a></p>" +
        "<p>Kind regards,</p>")
    };
  }

  if (intent === "consultation") {
    return {
      subject: "Your consultation request — RuffNeck Entertainment",
      html: emailLayout_("Consultation",
        "<p>Dear " + escapeHtml(name) + ",</p>" +
        "<p>Thank you for reaching out about a consultation with <strong>RuffNeck Entertainment</strong>.</p>" +
        serviceLine +
        "<p>We help founders, teams, and organisations adopt AI and strengthen digital operations with practical, measurable steps.</p>" +
        "<p>The fastest way to get started is to book a complimentary discovery call:</p>" +
        "<p style=\"text-align:center;margin:28px 0;\"><a href=\"https://calendly.com/hassanzakariyabiz/30min\" style=\"background:#00C2FF;color:#0A0F1E;padding:14px 26px;text-decoration:none;font-weight:700;border-radius:8px;display:inline-block;\">Schedule Your Call</a></p>" +
        "<p>If you already shared preferred times in your message, we will confirm shortly.</p>" +
        "<p>Kind regards,</p>")
    };
  }

  // general contact
  return {
    subject: "We received your message — RuffNeck Entertainment",
    html: emailLayout_("Message received",
      "<p>Dear " + escapeHtml(name) + ",</p>" +
      "<p>Thank you for contacting <strong>RuffNeck Entertainment</strong>.</p>" +
      serviceLine +
      "<p>Your message has been received and will be reviewed by our team. We typically respond within <strong>24 hours</strong> on business days.</p>" +
      "<p>For urgent matters, WhatsApp: <strong>+234 803 380 7856</strong>.</p>" +
      "<p style=\"margin-top:20px;\">Meanwhile, you may find these useful:</p>" +
      "<ul style=\"color:#334155;padding-left:18px;\">" +
      "<li><a href=\"https://ruffneck-entertainment.vercel.app/#free-guide\" style=\"color:#00B4D8;\">Free: 20 AI Prompts for Nigerian Businesses</a></li>" +
      "<li><a href=\"https://calendly.com/hassanzakariyabiz/30min\" style=\"color:#00B4D8;\">Book a free consultation</a></li>" +
      "</ul>" +
      "<p>Kind regards,</p>")
  };
}

function webinarAutoReply_(email) {
  return {
    subject: "You're on the list — AI Literacy Webinar Series | RuffNeck",
    html: emailLayout_("Webinar",
      "<p>Hello,</p>" +
      "<p>Thank you for registering your interest in the <strong>AI Literacy Webinar Series</strong> by RuffNeck Entertainment.</p>" +
      "<p>You are on the early-access list. We will email you as soon as dates, agenda, and joining details are confirmed.</p>" +
      "<p style=\"background:#f0f9ff;border-left:4px solid #00B4D8;padding:14px 16px;margin:24px 0;\">" +
      "<strong>What to expect</strong><br>" +
      "Practical sessions on AI fundamentals, prompt engineering, real-world use cases, limitations, and responsible AI use — designed for professionals, students, and business teams." +
      "</p>" +
      "<p>While you wait, download our free guide:</p>" +
      "<p style=\"text-align:center;margin:24px 0;\"><a href=\"https://ruffneck-entertainment.vercel.app/20_AI_Prompts_RuffNeck.pdf\" style=\"background:#00C2FF;color:#0A0F1E;padding:14px 26px;text-decoration:none;font-weight:700;border-radius:8px;display:inline-block;\">Download 20 AI Prompts (PDF)</a></p>" +
      "<p>Kind regards,</p>")
  };
}

function newsletterAutoReply_() {
  return {
    subject: "You're subscribed — RuffNeck Insights",
    html: emailLayout_("Newsletter",
      "<p>Hello,</p>" +
      "<p>Thank you for subscribing to <strong>RuffNeck Insights</strong>.</p>" +
      "<p>You will receive practical articles on AI, digital operations, marketing, and career growth — written for businesses and professionals in Nigeria and beyond.</p>" +
      "<p>No spam. You can unsubscribe at any time by replying to any email.</p>" +
      "<p>Kind regards,</p>")
  };
}

function leadMagnetAutoReply_(name, pdfUrl) {
  var n = name || "there";
  return {
    subject: "Your free guide: 20 AI Prompts Every Nigerian Business Should Be Using",
    html: emailLayout_("Free Guide",
      "<p>Hi " + escapeHtml(n) + ",</p>" +
      "<p>Thank you for downloading your free resource from RuffNeck Entertainment.</p>" +
      "<p style=\"font-size:16px;font-weight:700;color:#0B1E3A;\">20 AI Prompts Every Nigerian Business Should Be Using</p>" +
      "<p>Copy, paste, and adapt these prompts in ChatGPT, Claude, or any AI tool — for marketing, sales, operations, content, and career growth.</p>" +
      "<p style=\"text-align:center;margin:28px 0;\"><a href=\"" + pdfUrl + "\" style=\"background:#00C2FF;color:#0A0F1E;padding:14px 28px;text-decoration:none;font-weight:700;border-radius:8px;display:inline-block;\">Download Your PDF Guide →</a></p>" +
      "<p style=\"font-size:14px;color:#64748b;\">If the button does not work, copy this link:<br><a href=\"" + pdfUrl + "\" style=\"color:#00B4D8;\">" + pdfUrl + "</a></p>" +
      "<p style=\"margin-top:28px;\">Want help applying AI inside your business?</p>" +
      "<p style=\"text-align:center;margin:20px 0;\"><a href=\"https://calendly.com/hassanzakariyabiz/30min\" style=\"border:2px solid #00C2FF;color:#00B4D8;padding:12px 22px;text-decoration:none;font-weight:600;border-radius:8px;display:inline-block;\">Book a Free Consultation</a></p>" +
      "<p>Kind regards,</p>")
  };
}


function handleLeadMagnet(data) {
  const name = (data.customer_name || "there").trim();
  const email = (data.customer_email || "").trim().toLowerCase();
  const resource = data.resource || "20 AI Prompts for Nigerian Businesses";
  const pdfUrl = data.pdf_url || CONFIG.PDF_PUBLIC_URL;
  const date = data.date || new Date().toISOString();
  const source = data.source || "Website";
  if (!email || !email.includes("@")) return jsonResponse({ status: "error", message: "Invalid email" });
  logToSheet("Leads", [new Date(date), name, email, resource, source]);
  sendGuideEmail(name, email, pdfUrl);
  notifyOwner("🎯 New Lead Magnet — " + name, "Name: " + name + "\nEmail: " + email + "\nSource: " + source);
  return jsonResponse({ status: "success", message: "Guide sent" });
}

function handleContact(data) {
  const first = (data.first_name || "").trim();
  const last = (data.last_name || "").trim();
  const name = (first + " " + last).trim() || data.name || "Visitor";
  const email = (data.email || "").trim().toLowerCase();
  const phone = (data.phone || "").trim();
  const service = (data.service || "").trim();
  const message = (data.message || "").trim();
  const date = data.date || new Date().toISOString();
  if (!email || !email.includes("@")) return jsonResponse({ status: "error", message: "Invalid email" });

  logToSheet("Contact", [new Date(date), name, email, phone, service, message]);

  const intent = detectIntent_(service, message);

  // Owner notification
  MailApp.sendEmail({
    to: CONFIG.OWNER_EMAIL,
    subject: "📩 [" + intent.toUpperCase() + "] Contact — " + name,
    body:
      "Intent: " + intent + "\n" +
      "Name: " + name + "\n" +
      "Email: " + email + "\n" +
      "Phone: " + phone + "\n" +
      "Service: " + service + "\n\n" +
      "Message:\n" + message + "\n\n" +
      "Time: " + new Date().toLocaleString()
  });

  // Professional client auto-reply
  const reply = clientAutoReply_(intent, first || name.split(" ")[0], service);
  MailApp.sendEmail({
    to: email,
    subject: reply.subject,
    htmlBody: reply.html,
    name: "RuffNeck Entertainment",
    replyTo: CONFIG.OWNER_EMAIL
  });

  return jsonResponse({ status: "success", intent: intent });
}

function handleWebinar(data) {
  const email = (data.email || data.customer_email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) return jsonResponse({ status: "error", message: "Invalid email" });
  logToSheet("Webinar", [new Date(), email, "AI Literacy Webinar", data.source || "Website"]);
  notifyOwner("🔔 Webinar signup", "Email: " + email + "\nTime: " + new Date().toLocaleString());
  const reply = webinarAutoReply_(email);
  MailApp.sendEmail({
    to: email,
    subject: reply.subject,
    htmlBody: reply.html,
    name: "RuffNeck Entertainment",
    replyTo: CONFIG.OWNER_EMAIL
  });
  return jsonResponse({ status: "success" });
}

function handleNewsletter(data) {
  const email = (data.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) return jsonResponse({ status: "error", message: "Invalid email" });
  logToSheet("Newsletter", [new Date(), email, data.source || "Blog"]);
  notifyOwner("📬 Newsletter signup", "Email: " + email);
  const reply = newsletterAutoReply_();
  MailApp.sendEmail({
    to: email,
    subject: reply.subject,
    htmlBody: reply.html,
    name: "RuffNeck Entertainment",
    replyTo: CONFIG.OWNER_EMAIL
  });
  return jsonResponse({ status: "success" });
}

function sendGuideEmail(name, email, pdfUrl) {
  const reply = leadMagnetAutoReply_(name, pdfUrl);
  const options = {
    to: email,
    subject: reply.subject,
    htmlBody: reply.html,
    name: "RuffNeck Entertainment",
    replyTo: CONFIG.OWNER_EMAIL
  };
  if (CONFIG.PDF_DRIVE_FILE_ID) {
    try {
      options.attachments = [DriveApp.getFileById(CONFIG.PDF_DRIVE_FILE_ID).getAs(MimeType.PDF)];
    } catch (err) {}
  }
  MailApp.sendEmail(options);
}

/* ═══════ HELPERS ═══════ */

function getSS() {
  return SpreadsheetApp.openById(CONFIG.SHEET_ID);
}

function getOrCreateSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  return sheet;
}

function logToSheet(sheetName, row) {
  try {
    const ss = getSS();
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (sheetName === "Leads") sheet.appendRow(["Timestamp", "Name", "Email", "Resource", "Source"]);
      else if (sheetName === "Contact") sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Service", "Message"]);
      else if (sheetName === "Webinar") sheet.appendRow(["Timestamp", "Email", "Event", "Source"]);
      else if (sheetName === "Newsletter") sheet.appendRow(["Timestamp", "Email", "Source"]);
      sheet.getRange(1, 1, 1, row.length).setFontWeight("bold");
    }
    sheet.appendRow(row);
  } catch (err) {
    console.error("logToSheet", err.message);
  }
}

function notifyOwner(subject, body) {
  MailApp.sendEmail({ to: CONFIG.OWNER_EMAIL, subject: subject, body: body });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
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
  const ss = getSS();
  getOrCreateSheet_(ss, "Products", [
    "id", "name", "category", "emoji", "desc", "fullDesc",
    "priceBeg", "labelBeg", "pdfBeg", "priceMid", "labelMid", "pdfMid",
    "priceAdv", "labelAdv", "pdfAdv", "imageUrl", "videoUrl", "status", "createdAt"
  ]);
  getOrCreateSheet_(ss, "BlogPosts", [
    "id", "title", "label", "category", "meta", "excerpt", "body",
    "imageUrl", "videoUrl", "status", "createdAt"
  ]);
  MailApp.sendEmail({
    to: CONFIG.OWNER_EMAIL,
    subject: "✅ RuffNeck Free CMS Ready",
    body: "Products + Blog sheets created. Deploy as Web App (Anyone) and use the URL on your site."
  });
}

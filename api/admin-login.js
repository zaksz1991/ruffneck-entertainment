/**
 * POST /api/admin-login
 * Body: { "password": "..." }
 * Sets httpOnly session cookie if password matches process.env.ADMIN_PASSWORD
 */
const crypto = require("crypto");

const COOKIE_NAME = "rn_admin_session";
const MAX_AGE_SEC = 60 * 60 * 12; // 12 hours

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function sign(payload, secret) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return body + "." + sig;
}

function cookieHeader(token) {
  const secure = process.env.NODE_ENV === "production" || process.env.VERCEL ? "; Secure" : "";
  return (
    COOKIE_NAME +
    "=" +
    token +
    "; Path=/; HttpOnly; SameSite=Strict; Max-Age=" +
    MAX_AGE_SEC +
    secure
  );
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  const expected = process.env.ADMIN_PASSWORD || "";
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";

  if (!expected || !secret) {
    return json(res, 503, {
      ok: false,
      error: "Server auth not configured. Set ADMIN_PASSWORD and ADMIN_SECRET in Vercel environment variables.",
    });
  }

  let body;
  try {
    body = await readBody(req);
  } catch (e) {
    return json(res, 400, { ok: false, error: "Invalid JSON" });
  }

  const password = String(body.password || "").trim();
  if (!password || password !== expected) {
    return json(res, 401, { ok: false, error: "Incorrect password" });
  }

  const token = sign(
    { role: "admin", iat: Date.now(), exp: Date.now() + MAX_AGE_SEC * 1000 },
    secret
  );

  res.setHeader("Set-Cookie", cookieHeader(token));
  return json(res, 200, { ok: true, message: "Logged in" });
};

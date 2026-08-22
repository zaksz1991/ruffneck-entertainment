/**
 * GET /api/admin-session
 * Returns { ok: true, authenticated: true|false }
 */
const crypto = require("crypto");

const COOKIE_NAME = "rn_admin_session";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(";").forEach((part) => {
    const i = part.indexOf("=");
    if (i === -1) return;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    out[k] = decodeURIComponent(v);
  });
  return out;
}

function verify(token, secret) {
  if (!token || !secret || token.indexOf(".") === -1) return null;
  const [body, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return json(res, 405, { ok: false });
  }
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
  if (!secret) {
    return json(res, 200, { ok: true, authenticated: false, configured: false });
  }
  const cookies = parseCookies(req.headers.cookie || "");
  const payload = verify(cookies[COOKIE_NAME], secret);
  return json(res, 200, {
    ok: true,
    authenticated: Boolean(payload),
    configured: true,
  });
};

/**
 * /api/cms/posts
 * GET    — list posts
 * POST   — create { title, cat, body, ... }
 * PUT    — update { id, ...fields }
 * DELETE — { id }
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY)
 * Optional: ADMIN_PASSWORD check for mutating methods via cookie session
 */
const crypto = require("crypto");

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

function sb() {
  const url = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || "";
  return { url, key, ok: Boolean(url && key) };
}

async function sbFetch(path, options = {}) {
  const { url, key } = sb();
  const res = await fetch(url + "/rest/v1/" + path, {
    ...options,
    headers: {
      apikey: key,
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
  if (!res.ok) {
    const err = new Error((data && data.message) || (data && data.error) || text || res.statusText);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function verifyAdmin(req) {
  // Soft check: if ADMIN_SECRET set, require valid session cookie for writes
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
  if (!secret) return true; // allow if not configured (dev)
  const header = req.headers.cookie || "";
  const m = header.match(/(?:^|;\s*)rn_admin_session=([^;]+)/);
  if (!m) return false;
  const token = decodeURIComponent(m[1]);
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const expected = crypto.createHmac("sha256", secret).update(parts[0]).digest("base64url");
  try {
    if (parts[1] !== expected) return false;
    const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    if (!payload.exp || Date.now() > payload.exp) return false;
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") return json(res, 204, {});

  if (!sb().ok) {
    return json(res, 503, {
      ok: false,
      error: "Database not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY on Vercel.",
      code: "NO_DB",
    });
  }

  try {
    if (req.method === "GET") {
      const rows = await sbFetch("blog_posts?select=*&order=created_at.desc");
      return json(res, 200, { ok: true, posts: rows || [] });
    }

    if (!verifyAdmin(req)) {
      return json(res, 401, { ok: false, error: "Admin login required" });
    }

    if (req.method === "POST") {
      const body = await readBody(req);
      const row = {
        id: body.id || String(Date.now()),
        title: body.title || "Untitled",
        cat: body.cat || "General",
        emoji: body.emoji || "📝",
        image: body.image || null,
        desc: body.desc || "",
        body: body.body || "",
        tags: body.tags || [],
        author: body.author || "RuffNeck Entertainment",
        read_time: body.readTime || body.read_time || "5",
        status: body.status || "draft",
        created: body.created || new Date().toLocaleDateString("en-GB"),
        updated: new Date().toLocaleDateString("en-GB"),
      };
      const data = await sbFetch("blog_posts", {
        method: "POST",
        body: JSON.stringify(row),
        prefer: "return=representation",
      });
      return json(res, 201, { ok: true, post: Array.isArray(data) ? data[0] : data });
    }

    if (req.method === "PUT") {
      const body = await readBody(req);
      if (!body.id) return json(res, 400, { ok: false, error: "id required" });
      const id = body.id;
      const patch = { ...body, updated: new Date().toLocaleDateString("en-GB") };
      delete patch.id;
      if (patch.readTime) {
        patch.read_time = patch.readTime;
        delete patch.readTime;
      }
      const data = await sbFetch("blog_posts?id=eq." + encodeURIComponent(id), {
        method: "PATCH",
        body: JSON.stringify(patch),
        prefer: "return=representation",
      });
      return json(res, 200, { ok: true, post: Array.isArray(data) ? data[0] : data });
    }

    if (req.method === "DELETE") {
      const body = await readBody(req);
      if (!body.id) return json(res, 400, { ok: false, error: "id required" });
      await sbFetch("blog_posts?id=eq." + encodeURIComponent(body.id), {
        method: "DELETE",
        prefer: "return=minimal",
      });
      return json(res, 200, { ok: true });
    }

    return json(res, 405, { ok: false, error: "Method not allowed" });
  } catch (e) {
    return json(res, e.status || 500, {
      ok: false,
      error: e.message || "Database error",
      details: e.data || null,
    });
  }
};

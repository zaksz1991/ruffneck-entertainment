RuffNeck Admin + CMS fix package
================================

WHY ADMIN WAS 404
- Live /admin had no rewrite to admin.html
- This package adds vercel.json rewrites:
  /admin  → /admin.html
  /admin/ → /admin.html

WHY SAVE FAILED (even when UI existed)
Admin calls:
  GET/POST/PUT/DELETE  /api/cms/posts
  GET/POST/PUT/DELETE  /api/cms/products
Those need Supabase env vars on Vercel. Without them API returns 503 NO_DB
and nothing is saved for other visitors.

FILES TO COPY INTO REPO ROOT (same paths)
  admin.html
  vercel.json          (merge carefully if you already customized redirects)
  supabase_schema.sql
  .env.example
  js/cms.js
  api/admin-login.js
  api/admin-logout.js
  api/admin-session.js
  api/cms/posts.js
  api/cms/products.js

STEP 1 — Supabase SQL
1. Open Supabase → SQL Editor
2. Paste and run supabase_schema.sql
3. Confirm tables: blog_posts, products

STEP 2 — Vercel Environment Variables (Production)
  ADMIN_PASSWORD   = (strong password you choose)
  ADMIN_SECRET     = (long random string)
  SUPABASE_URL     = https://YOUR_PROJECT.supabase.co
  SUPABASE_SERVICE_KEY = (service_role key — keep secret)

Redeploy after saving env vars.

STEP 3 — Deploy these files
Push to the branch Vercel Production uses.
Confirm deployment Ready.

STEP 4 — Test
1. https://ruffneck-entertainment.vercel.app/admin
   → login screen (not 404)
2. Password = ADMIN_PASSWORD from Vercel
   (fallback in UI only if API not configured: ruffneck2026admin)
3. Add a draft post → Save
4. Network tab: POST /api/cms/posts → should be 200 { ok: true }
5. Refresh admin list → post still there
6. Publish post → public blog can load via CMS when wired

IMPORTANT
- Local storage is NOT the public database. Only Supabase via API is permanent.
- Store embedded HTML products remain as fallback if CMS fails (good).
- Do not put service_role key in the frontend.

If POST returns 503 NO_DB → env vars missing on Production.
If POST returns 401 → login session cookie missing; sign in again.
If /admin still 404 → admin.html not in the deployed commit or vercel.json not updated.

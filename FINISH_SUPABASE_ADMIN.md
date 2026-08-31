# RuffNeck — Finish Supabase + Admin (do this in order)

## A. Security warning
You shared Supabase **service_role** keys in chat. After setup:
1. In Supabase → Settings → API → consider **rotating** the service_role key if this chat is not private
2. Never commit keys to GitHub
3. Only put them in **Vercel Environment Variables**

## B. Run SQL (creates tables)
1. Supabase dashboard → **SQL Editor** → New query
2. Paste entire `supabase_schema.sql` from the package
3. Click **Run**
4. Confirm tables exist: Table Editor → `blog_posts` and `products`

## C. Vercel environment variables
Vercel → Project → Settings → Environment Variables → Add:

| Name | Value |
|------|--------|
| SUPABASE_URL | https://grehbumrnrgimwwyiqua.supabase.co |
| SUPABASE_SERVICE_KEY | (your service_role JWT — starts with eyJ...) |
| ADMIN_PASSWORD | choose a strong password YOU will type at /admin |
| ADMIN_SECRET | any long random string (32+ chars) |

Apply to Production (and Preview if you want).
Then **Redeploy** the project (Deployments → … → Redeploy).

## D. Deploy code files
Push to GitHub (must include):
- api/admin-login.js
- api/admin-logout.js
- api/admin-session.js
- api/cms/posts.js
- api/cms/products.js
- admin.html, blog.html, store.html
- supabase_schema.sql (optional, for reference)

## E. Admin password explained
| Password | What it is |
|----------|------------|
| **ADMIN_PASSWORD** (Vercel env) | What you type on /admin after server auth is live |
| **ruffneck2026admin** | Temporary fallback if API/env not set |
| Supabase **database password** | Only for direct Postgres tools — NOT used for /admin login |

After env vars + redeploy: log in with **ADMIN_PASSWORD** only.

## F. Test
1. /admin → login → login screen must disappear
2. Yellow banner should say Database (synced) not "This browser only"
3. Create blog post → Published → open /blog on another device

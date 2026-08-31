# Replace localStorage with Supabase (free database)

## Why
localStorage stays in one browser only. GitHub/Vercel cannot see it. A database syncs Admin → Blog → Store on every device.

## 1. Create free Supabase project
1. Go to https://supabase.com → Start your project
2. Create a project (free tier)
3. Project Settings → API:
   - Copy **Project URL** → `SUPABASE_URL`
   - Copy **service_role** key → `SUPABASE_SERVICE_KEY` (keep secret)

## 2. Create tables
Supabase → SQL Editor → paste `supabase_schema.sql` → Run

## 3. Vercel environment variables
| Name | Value |
|------|--------|
| SUPABASE_URL | https://xxxx.supabase.co |
| SUPABASE_SERVICE_KEY | service_role key |
| ADMIN_PASSWORD | your admin password |
| ADMIN_SECRET | random long string |

Redeploy after saving.

## 4. Deploy these files
- `api/cms/posts.js`
- `api/cms/products.js`
- `api/admin-login.js` (if not already)
- Updated `admin.html`, `blog.html`, `store.html`

## 5. How it works
- Admin saves posts/products via `POST /api/cms/posts` and `/api/cms/products`
- Blog page loads `GET /api/cms/posts` and shows `status=published`
- Store page loads `GET /api/cms/products` and shows `status=active`
- Works on mobile and desktop because data is on the server

## 6. Migrate old localStorage data (optional)
In Admin browser console after deploy:
```js
// Export local posts then re-save each via Admin UI, or:
const posts = JSON.parse(localStorage.getItem('rn_blog_posts')||'[]')
for (const p of posts) {
  await fetch('/api/cms/posts', { method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'}, body: JSON.stringify(p) })
}
```
(You must be logged into Admin first.)

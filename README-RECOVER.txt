URGENT RECOVERY — clean URLs broken
===================================
CAUSE
  P0 vercel.json contained ONLY security headers and replaced your full
  vercel.json. That deleted rewrites like:
    /blog  → /blog.html
    /store → /store.html

  The HTML files are still on the server:
    https://ruffneck-entertainment.vercel.app/blog.html  (works)
    https://ruffneck-entertainment.vercel.app/store.html (works)
  Only /blog and /store return "Page not found".

FIX (do this now)
  1. Upload THIS vercel.json to the ROOT of your GitHub/Vercel project
     (replace the broken one)
  2. Redeploy
  3. Open /blog and /store — should work again

Until then you can use:
  /blog.html
  /store.html

This file restores your original redirects + rewrites + security headers.
It does NOT change HTML, Flutterwave, or APIs.

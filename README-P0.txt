P0 DEPLOY PACKAGE — RuffNeck
============================
1. Blog mobile grid: 1 column on phones (fixes skinny cards)
2. Removed links to 404 CSS (professional-ux, cleanup)
3. Web Components JS included under /js/components/ (stops 404)
4. rel=noopener noreferrer on target=_blank links
5. vercel.json security headers (nosniff, frame, referrer, permissions)

NOT CHANGED
- Flutterwave keys / checkout logic
- API routes / admin auth code
- WhatsApp and other external destinations

UPLOAD TO REPO ROOT (Vercel)
  blog.html
  index.html
  store.html
  css/rn-site-ux.css
  js/components/*.js
  vercel.json   (merge with existing if you already have rewrites)

TEST (Incognito phone ~375px)
  /blog  → full-width stacked cards, readable titles
  /store → products visible, cart works
  /      → loads; Network: no 404 on rn-site-ux or js/components

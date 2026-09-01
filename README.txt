FIX: Store endless loading
==========================

Cause:
  Service worker was intercepting /api/cms/products.
  That API is slow (~2s). Page stayed in "loading/processing".

Files to upload:
  1. sw.js       → site root (replace existing sw.js)
  2. store.html  → site root (replace existing store.html)

What changed:
  - SW no longer touches /api/* routes
  - New cache name clears old bad cache
  - CMS product load is non-blocking (static products show immediately)

NOT changed:
  Flutterwave, product cards, checkout, cart

AFTER UPLOAD:
  1. Redeploy on Vercel
  2. On phone: open site → clear site data OR Incognito
  3. Visit /store — loading should finish; scroll to see all products

If still stuck once: Chrome menu → Settings → Site settings →
  ruffneck-entertainment.vercel.app → Clear & reset

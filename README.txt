RUFFNECK STORE — RECOVER + UPGRADE (SAFE)
==========================================

Base: your original backup store.html
Upgrade: visual CSS only

CHANGED (only these):
  1. Linked /css/store-commercial.css  (layout, cards, mobile/desktop)
  2. Hidden the extra search bar (HTML attribute only)
  3. Slightly improved viewport meta for mobile

NOT TOUCHED:
  - CMS / listProducts / loading scripts
  - Flutterwave / checkout / product IDs
  - Admin, APIs, Google Apps Script
  - No new JavaScript files

UPLOAD:
  1. css/store-commercial.css  →  /css/store-commercial.css
  2. store.html                →  replace store.html
  3. Hard refresh  Ctrl+Shift+R

If the page ever hangs again, it is NOT from this CSS package —
restore store.html only and remove the CSS link line if needed.

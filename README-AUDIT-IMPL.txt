RUFFNECK AUDIT IMPLEMENTATION PACKAGE
=====================================
Implements professional audit fixes BEFORE you deploy piecemeal.

INCLUDED
  css/rn-audit.css   — spacing, touch targets, focus, kill language UI,
                       blog search-only, responsive contain images, grids
  js/rn-audit.js     — removes language DOM + cookies
  index.html         — no language toggle styles; audit CSS/JS
  blog.html          — category chips removed; search kept
  store.html         — audit CSS/JS; logo path fix
  admin.html         — no price-tiers JSON; editor enforced if missing
  faq.html, contact-page.html, start-here.html, founder.html

STANDARDS APPLIED
  - min 44px controls
  - inputs 16px (no iOS zoom)
  - focus-visible outline
  - object-fit:contain for uploaded images
  - language toggle killed
  - target=_blank gets rel=noopener noreferrer
  - /logo.png → /icon-192.png

NOT TOUCHED
  Flutterwave, payment URLs, API endpoints, WhatsApp numbers

DEPLOY ALL FILES TOGETHER (overwrite by path). Then hard refresh.

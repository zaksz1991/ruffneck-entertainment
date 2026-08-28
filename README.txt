Pass 6 — Mobile & performance
==============================
Changes:
- index.html: preconnect/dns-prefetch, AOS defer, forms/app defer,
  Google Maps iframe loading=lazy
- css/cleanup.css: safe-area mobile bar, 48px touch targets,
  reduced-motion for AOS, media containment, maps responsive

Unchanged: forms logic, GAS, design system, business copy

Manual tests (320 / 375 / 390 / 414 / 768 / 1024):
- No horizontal scroll
- Mobile menu open/close
- Sticky bar above home indicator
- Chat + language usable
- Forms usable
- Lighthouse mobile (optional)

Note: Homepage is still content-heavy (~300KB HTML).
Further gains: split inline CSS, fewer third-party scripts, image CDN already in use.

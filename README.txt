HOME + STORE INTERACTION FIXES
==============================
ROOT CAUSES FOUND
1. Service tabs (All Services, AI & Tech, …) had data-filter attributes
   and cards had data-category — but NO JavaScript connected them.
2. /js/app.js was returning the 404 HTML page (file missing).
3. Store sticky header + overlay pointer-events could feel "frozen".
4. Search/filter layout uneven mobile vs desktop.

THIS PACKAGE
- js/rn-services-filter.js — wires tab filters + Show all services
- js/app.js — real file (stops 404 HTML-as-JS)
- css/rn-interactions.css — tabs layout, search visible both viewports,
  header alignment, overlay unlock
- index.html, store.html, blog.html updated to load the above

NOT changed: Flutterwave, payment, API, vercel rewrites.

TEST
- Home: tap All Services / AI & Tech / Marketing — cards filter
- Home: Show all services — all cards return
- Store: scroll page; header should not lock the page
- Store: search visible on phone and desktop

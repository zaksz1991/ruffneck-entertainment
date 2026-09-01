STORE — STATIC LOAD (nuclear fix for endless loading)
=====================================================

This store.html:
  - Unregisters service workers and clears caches on open
  - Does NOT load /js/cms.js
  - Does NOT fetch /api/cms/products on page load
  - Does NOT register a new service worker
  - Keeps all your product cards, Flutterwave, cart, checkout

Your products are already in the HTML (static). They do not need the API to show.

UPLOAD
  1. Replace store.html only
  2. On your PHONE you MUST clear the old worker once:
     Chrome → padlock/site settings → Clear & reset
     OR open in Incognito
  3. Open /store

If Incognito works but normal browser does not, the old service worker
is still on the device — Clear & reset is required once.

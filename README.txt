STORE — STOP ENDLESS LOADING
==============================

Base: store with translator already removed

ONLY change:
  CMS product fetch cannot wait forever (2.5s timeout).
  Your static products still show immediately.
  Empty admin/CMS product list does not block the page.

NOT changed:
  Flutterwave, product IDs, cart, search, filters, layout CSS

UPLOAD:
  Replace store.html only
  Hard refresh or Incognito on phone
  Scroll down — all product sections should be reachable

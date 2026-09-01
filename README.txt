STORE — TRANSLATOR REMOVED
==========================

Base: your original backup store.html

REMOVED:
  - Language button (🌐 EN) and menu
  - Google Translate element
  - Google Translate loader script

ADDED (tiny):
  - Clears leftover googtrans cookie so old translation state does not stick

NOT TOUCHED:
  - Flutterwave / checkout / products
  - CMS / listProducts / loading logic
  - Cart, filters, search
  - No commercial CSS, no rn-fixes

UPLOAD:
  1. Replace store.html only
  2. Hard refresh (Ctrl+Shift+R) or Incognito on phone

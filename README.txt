FIX FOR YOUR SCREENSHOT
=======================
You saw: "AI Career Guides" heading, then empty white (no product cards).

Cause: search/filter scripts set product cards to display:none.

This build:
- Removes the dual-search script that hid cards
- Safe filterProducts (All + empty search = show everything)
- CSS forces .products-grid cards visible
- Boot script shows all cards on load

Upload store.html
Incognito → scroll to AI Career Guides → cards should appear under the title.

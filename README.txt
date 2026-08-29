Store loading-state emergency fix
=================================
Root cause candidates addressed:
1. Closed modal/cart overlays forced display:none when not .open
2. body overflow lock cleared when overlays closed
3. CMS listProducts races with 2.5s timeout so catalogue never waits forever
4. revealStore runs on DOMContentLoaded, load, 500ms, and 4s max

Unchanged: products, prices, Flutterwave, cart API

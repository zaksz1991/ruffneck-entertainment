STORE POLISH PASS — store.html only
===================================
Preserved: product IDs, prices, tiers, Flutterwave, webhooks, required globals
Changed: a11y modal/cart, checkout reassurance, CSS polish layer, hero/delivery wording, Escape handler, filter aria-pressed sync, View options label

Regression:
1. Open product modal from card
2. Select tier, add to cart
3. Cart qty +/- remove
4. Pay button still calls initiatePayment
5. Escape closes modal then cart
6. Filters + search still work
7. Mobile 320–414 cart drawer usable

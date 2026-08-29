EMERGENCY STORE FIX
1. CMS product loader DISABLED (no await listProducts on page load)
2. rn-store-loading-override CSS
3. rn-store-emergency-reveal (DOMContentLoaded + load + 1.5s)
4. Duplicate early search init disabled where found

Deploy store.html, open:
https://ruffneck-entertainment.vercel.app/store?fix=20260829
Private window + hard refresh.

LOGO + ADMIN EDIT/DELETE
========================
1) store.html — logo src /logo.png → /icon-192.png (file that exists)
2) admin.html — Edit + Delete on CMS posts and products
   - Edit loads form, Save uses PUT when id present, POST when new
   - Delete calls DELETE /api/cms/posts or /products with {id}
   - Requires admin login session (same as before)

NOTE: Static products hardcoded in store.html are NOT in CMS.
Only products/posts returned by /api/cms/* appear in admin lists.

Upload:
  store.html
  admin.html
  (optional index.html if included)

Do NOT replace vercel.json unless you need routing recovery.

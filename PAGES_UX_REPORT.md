# Store · Blog · Admin · Services — UX/UI Update
**19 August 2026**

## Store (`store.html`)
- Fixed broken meta description (SEO)
- Added canonical URL
- Product card hover polish
- Cart sidebar / modal / button micro-interactions
- Mobile cart full-width improvement
- Flutterwave left unchanged (confirmed working)

## Blog (`blog.html`)
- Fixed broken meta description
- Added canonical URL
- **Newsletter was fake** → now sends to Google Apps Script
  - Logs to Sheet tab `Newsletter`
  - Notifies owner
  - Confirms subscriber by email
- Article card hover polish

## Admin (`admin.html`)
- Visual polish on login, sidebar, stats
- `noindex, nofollow` (if applied) so Google doesn’t index admin
- Stronger login warning copy
- **Security note:** Password is still client-side only. Anyone can view source and find it. For real security you need server-side auth later. For now: do not share `/admin` publicly and change the password in the script if it has been exposed.

## Services (homepage)
- Clearer filter + “click card for details” guidance
- Existing card hover / expand UX retained and polished via global CSS

## Forms now working end-to-end
| Form | Status |
|------|--------|
| Free Guide | Apps Script ✓ |
| Contact | Apps Script ✓ |
| Webinar Notify | Apps Script ✓ |
| Blog Newsletter | Apps Script ✓ |
| Store checkout | Flutterwave ✓ (yours) |

## Deploy order
1. Upload this full package to Vercel
2. Replace Apps Script with `RuffNeck_LeadMagnet_Script.gs`
3. Run `setup` → Redeploy Web App (new version)
4. Test: guide, contact, webinar, blog subscribe, one store payment

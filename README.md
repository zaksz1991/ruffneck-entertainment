# RuffNeck Entertainment Website
**Final commercial package — 19 August 2026**

## Quick Deploy (Vercel)

1. Upload **all** files from this package to your project root
2. Make sure the folder structure is:

```
/
├── index.html
├── css/main.css
├── js/lead-magnet.js
├── 20_AI_Prompts_RuffNeck.pdf
├── blog.html
├── store.html
├── admin.html
├── vercel.json
├── robots.txt
├── sitemap.xml
├── manifest.json
├── sw.js
├── icons & favicons...
└── RuffNeck_LeadMagnet_Script.gs  (for Google Apps Script only)
```

3. Deploy on Vercel
4. Hard-refresh the live site (Ctrl+Shift+R) so the new Service Worker loads

## Google Apps Script (Lead Magnet Email)

1. Open [script.google.com](https://script.google.com)
2. Paste the contents of `RuffNeck_LeadMagnet_Script.gs`
3. Run `setup` once and grant permissions
4. Deploy → Web app → Execute as Me → Anyone
5. The webhook URL is already set in `js/lead-magnet.js`

Current webhook:
`https://script.google.com/macros/s/AKfycby0mX6rqzDHVPy1deNqpHAnBC_f0QRL5f0jL5Bdwxfo4e4AFDO2flbCkV8fjIoT-1w/exec`

## What’s Included / Fixed

### Lead Magnet
- Working form → Google Apps Script → professional email + PDF link
- Optional Drive attachment
- Thank-you UI with Download + Book a Call CTA
- Owner notification email

### Performance & Code
- CSS extracted to `/css/main.css`
- Lead form JS modularized
- Security headers in `vercel.json`
- Service Worker cache version bumped

### SEO
- Canonical tag
- Complete Open Graph + Twitter cards
- Schema.org Organization markup
- Updated sitemap + robots.txt

### UI/UX
- Cleaner hero + dual CTAs
- Trust strip (CAC, SMEDAN, experience)
- Polished services, testimonials, forms
- Mobile-friendly spacing and buttons
- Accessibility focus states

### HTML Fixes
- Closed broken meta description tag
- Font preconnect / loading verified

## After Deploy — Test Checklist

- [ ] Homepage loads with correct styles
- [ ] Free Guide form submits and sends email
- [ ] Thank-you state appears after submit
- [ ] PDF opens at `/20_AI_Prompts_RuffNeck.pdf`
- [ ] Mobile menu works
- [ ] /store and /blog routes work
- [ ] Calendly “Get Started” / consultation links work

## Optional Next Steps

1. Add a Google Sheet ID in the Apps Script `CONFIG.SHEET_ID` to log leads
2. Replace placeholder testimonials with real client quotes when available
3. Restrict or remove `/admin` if not needed (current password is client-side only)

## Support Contact
WhatsApp: +234 803 380 7856  
Email: ruffneckhassan@gmail.com

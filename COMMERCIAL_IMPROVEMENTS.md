# RuffNeck Entertainment – Commercial Grade Improvements
**Date:** 18 August 2026  
**Prepared by:** Senior Web Development + Startup Advisory

---

## What Has Been Done

### 1. Performance
- Extracted the large inline CSS (~53 KB) into `/css/main.css`
- Created modular JavaScript for the lead magnet form (`/js/lead-magnet.js`)

### 2. SEO & Discovery
- Updated `sitemap.xml` with `lastmod` dates and the PDF resource
- Improved `robots.txt` (explicitly blocks admin)

### 3. Security Headers (vercel.json)
- Added `X-Content-Type-Options: nosniff`
- Added `X-Frame-Options: DENY`
- Added `Referrer-Policy`
- Added `Permissions-Policy`
- Proper caching headers for the PDF

### 4. Lead Magnet Form
- Improved validation
- Better loading / success / error states
- Google Analytics event tracking ready
- Cleaner code structure

---

## Critical Action You Must Still Take

### A. Update the Google Apps Script Webhook URL

1. Deploy the new Apps Script (the one I gave you earlier)
2. Copy the new Web App URL
3. Open `js/lead-magnet.js`
4. Replace the value of `LEAD_MAGNET_WEBHOOK_URL` with your new URL

### B. Link the external CSS & JS in index.html

In the `<head>` of `index.html`, replace the entire `<style>...</style>` block with:

```html
<link rel="stylesheet" href="/css/main.css"/>
```

Just before the closing `</body>` tag, add:

```html
<script src="/js/lead-magnet.js"></script>
```

And remove the old inline `submitLeadMagnet` function and the old `const LEAD_MAGNET_WEBHOOK_URL = ...` line.

### C. Drive File Permission
Make sure this file is set to **Anyone with the link → Viewer**:
https://drive.google.com/file/d/1EVLy1k4wD3NTasr3lTUyv1VWPFeeGeui/view

---

## Recommended Next Improvements (Priority Order)

1. **Admin Security** – Client-side password is not secure. Either remove sensitive features or implement real authentication.
2. **Split remaining JS** – Move other scripts out of index.html
3. **Add canonical tags** and strengthen Open Graph on all pages
4. **Thank-you experience** – After successful form submit, consider a short thank-you section or page with a secondary CTA (Book a Call)
5. **Core Web Vitals** – Test with PageSpeed Insights after the CSS/JS extraction
6. **Content strategy** – Blog needs consistent publishing for SEO growth

---

## File Structure After Changes

```
/
├── index.html
├── css/
│   └── main.css
├── js/
│   └── lead-magnet.js
├── 20_AI_Prompts_RuffNeck.pdf
├── blog.html
├── store.html
├── admin.html
├── vercel.json          ← updated with security headers
├── robots.txt           ← updated
├── sitemap.xml          ← updated
└── ...
```

---

## How to Deploy These Changes

1. Upload the new `css/` and `js/` folders to your project
2. Update `index.html` as described above
3. Replace `vercel.json`, `robots.txt`, and `sitemap.xml`
4. Redeploy on Vercel
5. Update the Apps Script webhook URL
6. Test the free guide form end-to-end


---

## UI/UX Design Pass (19 Aug 2026)

### Implemented
- Stronger visual hierarchy and section spacing
- Hero refinements (clearer CTAs, trust line)
- Lead magnet form polish (better inputs, focus states, privacy line)
- Services section clearer intro + card hover states
- New **Trust Strip** (Years, Services, CAC, SMEDAN, Remote)
- Testimonials card polish
- Navigation backdrop and CTA polish
- Mobile improvements (stacked CTAs, spacing, form layout)
- Accessibility focus states
- Smooth scroll

### Files updated
- `css/main.css` — full commercial polish layer added
- `index.html` — trust strip + copy refinements
- `js/lead-magnet.js` — thank-you UI with secondary CTA


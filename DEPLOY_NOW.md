# Deploy this package (final homepage rebuild)

## Vercel — upload these files

**Required**
- index.html          ← new clean homepage
- css/site.css        ← design system
- js/site.js          ← menu, theme, expand
- js/forms.js         ← lead magnet + contact emails
- store.html, blog.html, admin.html
- services-ai.html, services-marketing.html, services-va.html, consulting.html
- vercel.json, robots.txt, sitemap.xml, manifest.json, sw.js
- 20_AI_Prompts_RuffNeck.pdf
- All icons / favicon / og-image.png

**Optional but recommended**
- css/main.css (older pages may still reference it)
- js/cms.js

## Apps Script
Paste RuffNeck_CMS_Script.gs → setup → Deploy New version → Anyone

## After deploy
Hard refresh. Test:
1. Mobile hamburger opens/closes
2. Desktop nav links work
3. Book a Consultation (Calendly)
4. Free guide form → email
5. Contact form → email
6. Service expand + Show more
7. /store Flutterwave
8. Theme toggle (moon/sun)

## Design notes
- Dark theme default; light mode available
- Primary CTA = consultation
- Secondary = free prompts
- Mobile menu included (template was missing this)

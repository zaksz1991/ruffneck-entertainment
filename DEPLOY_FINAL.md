# RuffNeck — Final Deploy Package

## Upload to Vercel (all of these)

```
index.html
store.html
blog.html
admin.html
services-ai.html
services-marketing.html
services-va.html
consulting.html
css/main.css
js/forms.js
js/cms.js
js/lead-magnet.js
vercel.json
robots.txt
sitemap.xml
manifest.json
sw.js
20_AI_Prompts_RuffNeck.pdf
favicon*.png / icons / og-image.png
```

## Google Apps Script (not on Vercel)

1. Paste **RuffNeck_CMS_Script.gs** (full replace)
2. Run **setup**
3. Deploy Web App → New version → Anyone

## After deploy

1. Hard refresh (Ctrl+Shift+R)
2. Test checklist:
   - [ ] Homepage: Book a Consultation is primary button
   - [ ] Only ~6 services until "Show all services"
   - [ ] Mobile menu opens
   - [ ] Service expand works
   - [ ] /services/ai /marketing /virtual-assistance /consulting load
   - [ ] Free guide form emails you
   - [ ] Contact form emails
   - [ ] Store + Flutterwave
   - [ ] /css/main.css is not 404

## What this package changed

- Homepage focused CTAs (Consultation primary)
- Long sections → short teaser cards
- Services limited + Show all
- Service landing pages + SEO routes
- Trust links (CAC / SMEDAN)
- Expand accordion UX
- Nav dropdowns + mobile menu
- Email auto-replies (in Apps Script)
- Free Sheet CMS for products/blog
- Performance: lazy images, defer AOS

# Enable Vercel Analytics

## 1. Deploy site with the analytics scripts (already in HTML)

Scripts load from:
- `/_vercel/insights/script.js` — Web Analytics (page views, visitors)
- `/_vercel/speed-insights/script.js` — Speed Insights (performance)

## 2. Turn on in Vercel Dashboard

1. Open [vercel.com](https://vercel.com) → your project **ruffneck-entertainment**
2. **Analytics** tab → Enable **Web Analytics**
3. **Speed Insights** tab → Enable **Speed Insights** (optional)

Hobby (free) plan includes Analytics with a monthly events quota.

## 3. Verify

1. Visit your live site, click a few pages
2. Vercel → Analytics → data appears within a few minutes (sometimes longer on first enable)

## Privacy note

Vercel Web Analytics is cookieless / privacy-friendly compared to classic GA.
No extra API keys in the HTML.

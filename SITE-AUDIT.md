# RuffNeck Entertainment — Full Professional Site Audit
Date: 2026-09-04
Scope: index, blog, store, admin, faq, contact, start-here, founder

## P0 — Critical / User-requested

### 1. Language toggle (CONFIRMED on index + blog)
- Index and Blog still load Google Translate–style language UI (`#rnFixedLang`, goog-te styles, `rn_lang` localStorage).
- User requested removal (again).
- **Fix in this package:** translator kill CSS + JS on index, blog, store; translate scripts stripped where found.

### 2. Admin image upload
- Device file upload for blog + product is present on current admin (Choose File).
- Images should use `object-fit: contain` on blog/store (earlier packages). Re-verify after deploy.

### 3. Blog category chips
- User asked to remove All / AI / Operations / Marketing / Careers / IT chips.
- Deploy `blog.html` from previous no-cats package if chips still show (cache or incomplete deploy).

## P1 — Functionality

| Area | Status | Notes |
|------|--------|-------|
| Flutterwave / payments | Do not touch | Preserve all payment scripts & URLs |
| Admin blog CRUD | Working (user confirmed edit/delete) | Rich text editor must include toolbar HTML (B/I/U/List) |
| Admin product image | File picker present | Confirm save persists `image` field via API size limits |
| Blog openArticle | Modal-based | Read button should call openArticle; Escape closes |
| Expand/collapse | Fragile | Depends on `.blog-popup` existence; many cards use modal instead |
| Store loading | Historical issue | Avoid SW caching /api; do not regress |
| Service tabs on Home | Needs JS | `rn-services-filter.js` must be live |

## P2 — UI / Layout / Spacing

| Page | Finding | Recommendation |
|------|---------|----------------|
| Index | Heavy inline styles (~288) | Prefer shared CSS; reduce override wars |
| Index | Sticky bottom bar + chat FAB | Verify safe-area padding; no overlap of CTAs |
| Blog | Sticky filters under header | Search-only bar; consistent max-width 1120px |
| Blog | Card grid | 1 col mobile / 2 tablet / 3 desktop |
| Store | Duplicate product ids (p001…) | Unique ids for a11y and JS |
| Store | Product modal ids duplicated | Ensure single modal root |
| Founder | `/logo.png` reference | Use `/icon-192.png` or `/founder.png` |
| All | Touch targets | Keep min 44×44px on buttons/inputs |
| All | Horizontal overflow | `overflow-x: hidden` on body; avoid 100vw pitfalls |

## P3 — Accessibility

| Issue | Pages | Fix |
|-------|-------|-----|
| Multiple/missing h1 | check blog/store | One h1 per page |
| Inputs without label for= | admin, blog | Associate labels or aria-label |
| target=_blank without rel | start-here | rel="noopener noreferrer" |
| Img without alt | various | Meaningful alt or alt="" if decorative |
| Focus states | mixed | :focus-visible 3px accent outline |

## P4 — Performance

| Issue | Notes |
|-------|-------|
| Large HTML pages | index ~275KB, blog ~210KB — consider splitting CSS/JS |
| Base64 images in CMS | Device uploads as data URLs can bloat API payloads; compress (already ~1400px) |
| Many competing CSS layers | rn-site-ux, rn-spacing, rn-interactions, inline audits — consolidate |

## P5 — Consistency checklist (buttons, padding, inputs)

Standards to enforce sitewide:
1. Content width: `min(1120px, 100% - 2rem)` centered
2. Section padding: `clamp(1.5rem, 4vw, 3rem)` vertical
3. Buttons: min-height 44px, consistent radius 10–12px or pill for filters
4. Inputs: font-size 16px (no iOS zoom), min-height 44px, full width in forms
5. Cards: equal height in grid, consistent border `#e2e8f0`, radius 16px
6. No full-width stacked filter chips unless intentional
7. Primary navy `#0B1E3A`, accent cyan `#00B4D8`

## Regression tests after this deploy
1. Index: no EN / language button top-right
2. Blog: no language control; search works; no category pills if no-cats deployed
3. Store: products load; pay/Flutterwave unchanged
4. Admin: file image upload visible; no price-tiers JSON
5. Mobile 375px + desktop 1280px: no horizontal scroll
6. Founder photo at `/founder.png` if that package was deployed

## Files in this package
- index.html — language toggle removed
- blog.html — language toggle removed  
- store.html — language kill CSS (defensive)

NOT modified: Flutterwave config, API endpoints, form field names for payment.

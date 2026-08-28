Pass 2 — Lead magnet reliability + consent
==========================================
Changed:
- index.html — consent checkbox (#lmConsent), name attrs, aria-live on #lmMsg
- js/forms.js — consent required, double-submit lock, clearer success/error,
  payload includes consent + utm_source, PDF fallback always on success

Unchanged:
- WEBHOOK_URL (same Apps Script deployment)
- PDF_URL, CALENDLY_URL
- IDs: lmName, lmEmail, lmSubmitBtn, lmMsg
- No CSS redesign, no SEO, no app.js changes

Verify after deploy:
1. Empty submit → validation
2. Without consent → message
3. Valid submit → success UI + PDF button
4. Google Sheet new row with consent=yes
5. Email with PDF (or use Download PDF Now)
6. GA4 generate_lead (if property active)

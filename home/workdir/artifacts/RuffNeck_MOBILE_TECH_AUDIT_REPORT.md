# RuffNeck Mobile Technical Fix Report
Site: https://ruffneck-entertainment.vercel.app/
Date: 2026-08-24

## Confirmed conflicts (live HTML)

1. Translator failure
   - Rule present: `.skiptranslate { display: none !important; }`
   - This hides ALL Google Translate skiptranslate nodes, not only the top banner.
   - `#google_translate_element` was clipped (1×1 / opacity 0) which is OK for cookie-driven custom menu IF the engine can still inject `.goog-te-combo`.
   - Custom control: `#rnLangBtn` / `#rnLangMenu` (primary UX).

2. Text overflow covering content
   - Long service/pricing/founder copy + translation expansion.
   - Fixed/max heights and overflow:hidden on cards would clip expanded text.
   - Fix: height:auto; max-height:none; overflow:visible; overflow-wrap:anywhere on text and cards.

3. Hidden chatbox
   - Markup: `#rnChatBubble` / `#rnChatPanel` / `.rn-chat-*`
   - Earlier deploys lacked positioning CSS; later builds added CSS but stacking vs `#rnMobileBar` needed explicit z-index.
   - Fix: fixed bottom-left above sticky bar (z-index 99970), toggle `.open` shows panel.

## Patches applied

- Removed global `.skiptranslate { display:none }`.
- Hide only `body > .skiptranslate` banner strip.
- Single `googleTranslateElementInit` + cookie `googtrans` language switch.
- Chat: visible toggle, panel display flex when open, safe-area bottom offset.
- Mobile typography clamp + 44px controls.
- prefers-reduced-motion respect.

## Mobile compliance targets

- 320 / 375 / 390 / 412 widths: no horizontal scroll.
- Translator menu usable; chat toggle ≥ 44×44.
- Sticky bar (WhatsApp / Book / Store) remains usable.
- Translated text reflows without covering CTAs.

## Deploy

Upload `RuffNeck_MOBILE_TECH_AUDIT_FIX.zip` to GitHub → Vercel Ready → hard refresh mobile.

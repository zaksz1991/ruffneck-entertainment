Pass 3 — Accessible service toggles
====================================
Changed:
- js/app.js — RN.services promotes .expand-hint to <button class="service-toggle">
  with aria-expanded + aria-controls; panels use hidden; card role=button removed
- css/cleanup.css — .service-toggle styles + focus-visible

Unchanged:
- Service titles, copy, lists, links
- forms.js, GAS, design system colours
- No full HTML rewrite of every card (progressive enhancement)

Test:
1. Tab to "View details" button — focus ring visible
2. Enter/Space toggles panel
3. Only one panel open at a time
4. Links inside panel work without closing via link click mishap
5. Screen reader announces expanded/collapsed

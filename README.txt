SPACING + ALIGNMENT — MOBILE & DESKTOP
======================================
css/rn-spacing.css   — spacing tokens, grids, touch targets
css/rn-site-ux.css   — prior UX + spacing merged

Also on HTML pages:
- /logo.png → /icon-192.png
- removed professional-ux.css & cleanup.css links (404)
- type="button" on buttons missing type
- blog grid default 1 column (then 2/3 via CSS breakpoints)

Breakpoints:
  phone:  1 column cards
  600px+: 2 columns
  960px+: 3 columns (blog); products up to 4 at 1100px+
  filters: horizontal scroll on small screens

NOT changed: Flutterwave, APIs, vercel.json rewrites

Upload preserving paths. Test phone 375px and desktop 1280px.

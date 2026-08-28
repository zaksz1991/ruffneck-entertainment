CLEANUP.CSS — post-repair polish
================================
Linked AFTER professional-ux.css / main.css

Implements audit goals safely:
- Uniform section + card padding (clamp)
- Fluid type scale
- Primary CTA contrast + hover + focus-visible
- Lead magnet submit highlight (gold) without forced pulse
- Mobile hero CTA stack
- No universal * { margin:0; padding:0 } (destructive)
- Brand cyan/navy (not unrelated cobalt)

Deploy:
  css/cleanup.css
  updated HTML files (link tags only)

Do not change GAS / form fields / Flutterwave.

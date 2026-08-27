CRITICAL CONTRAST FIX

Root causes found:
1. index.html forced .section-sub { color: #CBD5E1 } (light grey) on ALL sections including white backgrounds
2. blog.html global p { color: rgba(255,255,255,...) } made text invisible on white cards

Changed files ONLY:
- index.html (contrast CSS rule only — forms/IDs untouched)
- blog.html (contrast CSS overrides only)
- css/main.css (reinforcing override)

Deploy all three on Preview branch. Production not auto-deployed.

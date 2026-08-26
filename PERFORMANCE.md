# Performance implementation

## Code done
- Preload `/logo.png` (LCP-related)
- Logo: fetchpriority=high, dimensions retained
- Other images: loading=lazy + decoding=async where applied
- External scripts: defer when src= is present
- Vercel Cache-Control for static assets (1 year)
- HTML: must-revalidate

## You run after deploy
PageSpeed Insights (mobile) on:
1. https://ruffneck-entertainment.vercel.app/
2. https://ruffneck-entertainment.vercel.app/blog
3. https://ruffneck-entertainment.vercel.app/store

Targets: LCP ≤ 2.5s · INP ≤ 200ms · CLS ≤ 0.1

## If scores still low
- Compress large PNGs in Store/Blog (export WebP)
- Remove unused chat/translator scripts from blog/store if not needed
- Confirm og-image.png is ≤ 300KB

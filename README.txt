CLEAN store repair (stop stacking patches)

REMOVED:
- rn-store-loading-failsafe
- rn-store-emergency-reveal
- rn-store-force-visible / loading-override
- rn-store-nuclear-*
- CMS listProducts loaders
- body/html className wipe patterns

ADDED (only one block):
- #rn-store-clean-layout — no rotate/skew; grid; readable prices
- #rn-store-clean-finish — remove loaders only; no CMS wait

Deploy store.html → https://ruffneck-entertainment.vercel.app/store?clean=1
Private window + hard refresh. Scroll past hero.

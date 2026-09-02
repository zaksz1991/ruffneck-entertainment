WEB COMPONENTS IMPLEMENTATION
=============================

Files:
  /js/components/index.js          entry (import all)
  /js/components/rn-announce.js
  /js/components/rn-header.js
  /js/components/rn-filter-bar.js
  /js/components/rn-search.js
  /js/components/rn-footer.js
  /css/rn-site-ux.css              includes WC chrome styles

Usage examples:
  <rn-announce></rn-announce>
  <rn-header current="store" cart-count="0"></rn-header>
  <rn-filter-bar target="[data-product-card]" category-attr="data-category"></rn-filter-bar>
  <rn-search target="[data-product-card]" filter-bar="rn-filter-bar"></rn-search>
  <rn-footer></rn-footer>

  <script type="module" src="/js/components/index.js"></script>

Wired on:
  index, blog, store + secondary pages (module + CSS)
  blog: filter bar + search
  store: search (existing filters kept; payment untouched)

NOT changed:
  Flutterwave, openModal, initiatePayment, API routes, WhatsApp URL

Deploy entire folder structure preserving paths.

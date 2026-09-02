BLOG: ONE SEARCH ONLY
=====================
Live problem: multiple search UIs on /blog
  1) <rn-search> web component (from WC package)
  2) #rnBlogSearch (extra)
  3) #searchInput + filterBlog() (original)

This file keeps ONE visible field: #searchInput
Hides the others with CSS + removes <rn-search> tags.

Upload ONLY: blog.html
Then hard-refresh / Incognito on /blog

What was already on the server (from earlier deploys):
  /css/rn-interactions.css  — YES live
  /css/rn-spacing.css       — YES live
  /js/app.js                — YES live
  /js/rn-services-filter.js — YES live (Home services tabs)

What you may not "see" as a redesign:
  Service tab FILTERING only changes which cards show on Home — layout looks the same until you tap AI & Tech etc.
  Spacing CSS is incremental, not a full visual rebuild.

/**
 * RuffNeck Entertainment — Targeted Fixes v2
 * 1. Language on Homepage  2. Blog search+filters  3. Store search+filters
 * 4. Currency  5. Light UI polish
 * Does NOT touch Flutterwave, Google Apps Script, APIs, admin, payments
 */
(function () {
  "use strict";
  if (window.__RN_FIXES_V2__) return;
  window.__RN_FIXES_V2__ = true;

  function qs(s, r) { return (r || document).querySelector(s); }
  function qsa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function ensureLanguageSwitcher() {
    if (qs("#rnLangBtn") || qs("#rnFixedLangBtn")) return;
    if (!qs("#google_translate_element")) {
      var gt = document.createElement("div");
      gt.id = "google_translate_element";
      gt.setAttribute("aria-hidden", "true");
      gt.style.cssText = "position:absolute;left:-9999px;height:0;overflow:hidden;";
      document.body.appendChild(gt);
    }
    var wrap = document.createElement("div");
    wrap.className = "rn-lang";
    wrap.id = "rnLang";
    wrap.style.cssText = "position:fixed;top:14px;right:14px;z-index:10050;";
    function langBtn(code, short, name) {
      return '<button type="button" data-lang="'+code+'" data-label="'+short+'" role="menuitem" style="display:block;width:100%;text-align:left;padding:8px 12px;background:none;border:none;color:#e2e8f0;border-radius:8px;cursor:pointer;font-size:13px;font-family:inherit;">'+short+' '+name+'</button>';
    }
    wrap.innerHTML =
      '<button type="button" class="rn-lang-btn" id="rnLangBtn" aria-haspopup="true" aria-expanded="false" title="Translate page" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:999px;background:#0B1E3A;color:#fff;border:1px solid rgba(0,180,216,.45);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;"><span aria-hidden="true">🌐</span> <span id="rnLangLabel">EN</span></button>' +
      '<div class="rn-lang-menu" role="menu" id="rnLangMenu" style="display:none;position:absolute;right:0;top:112%;min-width:150px;background:#0B1E3A;border:1px solid rgba(0,180,216,.35);border-radius:12px;padding:6px;box-shadow:0 10px 28px rgba(0,0,0,.4);">' +
      langBtn("en","EN","English")+langBtn("ha","HA","Hausa")+langBtn("yo","YO","Yoruba")+langBtn("ig","IG","Igbo")+langBtn("fr","FR","French")+langBtn("es","ES","Spanish")+langBtn("ar","AR","Arabic") +
      "</div>";
    document.body.appendChild(wrap);
    var btn = qs("#rnLangBtn"), menu = qs("#rnLangMenu"), lab = qs("#rnLangLabel");
    function setLang(lang, label) {
      if (lab) lab.textContent = label || lang.toUpperCase();
      try { localStorage.setItem("rn_lang", lang); localStorage.setItem("rn_lang_label", label || lang.toUpperCase()); } catch (e) {}
      if (lang === "en") {
        document.cookie = "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
        document.cookie = "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=." + location.hostname;
        location.reload(); return;
      }
      document.cookie = "googtrans=/en/" + lang + ";path=/;";
      document.cookie = "googtrans=/en/" + lang + ";path=/;domain=." + location.hostname;
      location.reload();
    }
    if (btn && menu) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = menu.style.display === "block";
        menu.style.display = open ? "none" : "block";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
      });
      qsa("button[data-lang]", menu).forEach(function (b) {
        b.addEventListener("click", function () { setLang(b.getAttribute("data-lang"), b.getAttribute("data-label")); });
      });
      document.addEventListener("click", function () { menu.style.display = "none"; btn.setAttribute("aria-expanded", "false"); });
    }
    try { var savedL = localStorage.getItem("rn_lang_label"); if (savedL && lab) lab.textContent = savedL; } catch (e) {}
    if (!(window.google && window.google.translate)) {
      window.rnInitGoogleTranslate = function () {
        try {
          new google.translate.TranslateElement({ pageLanguage: "en", includedLanguages: "en,ha,yo,ig,fr,es,ar", autoDisplay: false, layout: google.translate.TranslateElement.InlineLayout.SIMPLE }, "google_translate_element");
        } catch (e) {}
      };
      var s = document.createElement("script");
      s.src = "//translate.google.com/translate_a/element.js?cb=rnInitGoogleTranslate";
      document.head.appendChild(s);
    }
  }

  function catAliases(cat) {
    cat = (cat || "all").toLowerCase();
    var map = { all:["all"], ai:["ai","automation"], ops:["ops","operations","operation"], operations:["ops","operations","operation"], marketing:["marketing","market"], career:["career","careers"], careers:["career","careers"], it:["it","it-support"], ethics:["ethics"], content:["content","prompts"], business:["business"], prompts:["prompts","content"] };
    return map[cat] || [cat];
  }
  function catMatches(cardCat, activeCat) {
    if (!activeCat || activeCat === "all") return true;
    var aliases = catAliases(activeCat);
    var c = (cardCat || "").toLowerCase();
    return aliases.indexOf(c) !== -1 || c.indexOf(activeCat) !== -1 || activeCat.indexOf(c) !== -1;
  }
  function getBlogSearchQuery() {
    var a = qs("#rnBlogSearch"), b = qs("#searchInput"), q = "";
    if (a && a.value) q = a.value; else if (b && b.value) q = b.value;
    return (q || "").trim().toLowerCase();
  }
  function getActiveBlogCat() {
    var btn = qs("#rnBlogCats button.active") || qs(".filter-btn.active") || qs("[data-cat].active");
    return btn ? (btn.getAttribute("data-cat") || "all") : "all";
  }
  function runBlogFilter() {
    var search = getBlogSearchQuery(), activeCat = getActiveBlogCat();
    var cards = qsa(".blog-card, .article-card, .rn-cms-post, #blogGrid > *, #cmsPostsGrid > *, .blog-grid > article, .blog-grid > div");
    var shown = 0;
    cards.forEach(function (card) {
      if (card.id === "blogSearchEmpty" || card.id === "searchEmpty") return;
      var cardCat = card.getAttribute("data-cat") || card.getAttribute("data-category") || "";
      var hay = ((card.getAttribute("data-title") || "") + " " + (card.getAttribute("data-name") || "") + " " + cardCat + " " + (card.textContent || "")).toLowerCase();
      var ok = catMatches(cardCat, activeCat) && (!search || hay.indexOf(search) !== -1);
      card.style.display = ok ? "" : "none";
      if (ok) { card.removeAttribute("hidden"); shown++; } else card.setAttribute("hidden", "");
    });
    var countEl = qs("#rnBlogSearchCount");
    if (countEl) countEl.textContent = shown === 0 && (search || (activeCat && activeCat !== "all")) ? "No articles match" : shown + " article" + (shown !== 1 ? "s" : "");
    var empty = qs("#blogSearchEmpty");
    if (empty) empty.style.display = shown === 0 && search ? "block" : "none";
  }
  function fixBlogSearch() {
    var rn = qs("#rnBlogSearch"), si = qs("#searchInput");
    function bind(el) {
      if (!el) return;
      el.addEventListener("input", function () {
        if (rn && si && el === rn) si.value = rn.value;
        if (rn && si && el === si) rn.value = si.value;
        runBlogFilter();
      });
      el.addEventListener("keyup", runBlogFilter);
      el.addEventListener("search", runBlogFilter);
    }
    bind(rn); bind(si);
    qsa(".filter-btn, #rnBlogCats button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var parent = btn.parentElement;
        if (parent) qsa("button, .filter-btn", parent).forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        setTimeout(runBlogFilter, 15);
      });
    });
    window.filterBlog = runBlogFilter;
    window.rnRunBlogFilter = runBlogFilter;
    setTimeout(runBlogFilter, 800);
    setTimeout(runBlogFilter, 2000);
  }

  function runStoreFilter() {
    if (typeof window.filterProducts === "function") {
      try { window.filterProducts(); return; } catch (e) { console.warn("filterProducts fallback", e); }
    }
    var activeBtn = qs(".filter-btn.active");
    var activeCat = activeBtn ? activeBtn.getAttribute("data-cat") || "all" : "all";
    var input = qs("#searchInput");
    var search = (input && input.value ? input.value : "").trim().toLowerCase();
    var cards = qsa(".product-card"), shown = 0;
    cards.forEach(function (card) {
      if (card.closest && card.closest(".rn-featured, .rn-store-featured")) return;
      var cat = card.getAttribute("data-cat") || "";
      var hay = ((card.getAttribute("data-name") || "") + " " + cat + " " + (card.textContent || "")).toLowerCase();
      var catMatch = !activeCat || activeCat === "all" || cat === activeCat || cat.indexOf(activeCat) !== -1;
      var match = !search || hay.indexOf(search) !== -1;
      var ok = catMatch && match;
      card.style.display = ok ? "" : "none";
      if (ok) { card.removeAttribute("hidden"); shown++; } else card.setAttribute("hidden", "");
    });
    var empty = qs("#searchEmpty");
    if (empty) empty.style.display = shown === 0 ? "block" : "none";
  }
  function fixStoreSearchAndFilters() {
    if (!qs(".product-card") && !qs("#searchInput")) return;
    var input = qs("#searchInput");
    if (input) { input.addEventListener("input", runStoreFilter); input.addEventListener("keyup", runStoreFilter); }
    qsa(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        qsa(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        setTimeout(runStoreFilter, 10);
      });
    });
    qsa(".search-btn, [data-search-btn]").forEach(function (btn) {
      btn.addEventListener("click", function (e) { e.preventDefault(); runStoreFilter(); });
    });
    window.rnRunStoreFilter = runStoreFilter;
  }

  function fixCurrency() {
    if (!qs("#currBtnNGN") && !qs("[data-ngn]")) return;
    var RATE = 1600;
    if (typeof window.currentCurrency === "undefined") {
      try { window.currentCurrency = localStorage.getItem("rn_store_currency") || "NGN"; } catch (e) { window.currentCurrency = "NGN"; }
    }
    if (typeof window.formatPrice !== "function") {
      window.formatPrice = function (ngnAmount) {
        var n = Number(ngnAmount) || 0;
        if (window.currentCurrency === "USD") return "$" + (n / RATE).toFixed(2);
        return "₦" + n.toLocaleString();
      };
    }
    if (typeof window.updateAllPriceDisplays !== "function") {
      window.updateAllPriceDisplays = function () {
        qsa(".price-val[data-ngn]").forEach(function (el) {
          var ngn = Number(el.getAttribute("data-ngn")) || 0;
          el.textContent = window.formatPrice(ngn);
        });
      };
    }
    var original = window.setCurrency;
    window.setCurrency = function (curr) {
      if (curr !== "NGN" && curr !== "USD") return;
      window.currentCurrency = curr;
      try { localStorage.setItem("rn_store_currency", curr); } catch (e) {}
      var ngnBtn = qs("#currBtnNGN"), usdBtn = qs("#currBtnUSD");
      if (ngnBtn) { ngnBtn.classList.toggle("active", curr === "NGN"); ngnBtn.setAttribute("aria-pressed", curr === "NGN" ? "true" : "false"); }
      if (usdBtn) { usdBtn.classList.toggle("active", curr === "USD"); usdBtn.setAttribute("aria-pressed", curr === "USD" ? "true" : "false"); }
      try { window.updateAllPriceDisplays(); } catch (e) {}
      if (typeof window.renderCart === "function") { try { window.renderCart(); } catch (e) {} }
      if (typeof original === "function" && original !== window.setCurrency) { try { original(curr); } catch (e) {} }
    };
    var ngnBtn = qs("#currBtnNGN"), usdBtn = qs("#currBtnUSD");
    if (ngnBtn) ngnBtn.addEventListener("click", function (e) { e.preventDefault(); window.setCurrency("NGN"); });
    if (usdBtn) usdBtn.addEventListener("click", function (e) { e.preventDefault(); window.setCurrency("USD"); });
    try {
      var saved = localStorage.getItem("rn_store_currency");
      if (saved === "USD" || saved === "NGN") window.setCurrency(saved);
      else window.updateAllPriceDisplays();
    } catch (e) { try { window.updateAllPriceDisplays(); } catch (e2) {} }
  }

  function applyUiPolish() {
    if (qs("#rn-fixes-ui")) return;
    var style = document.createElement("style");
    style.id = "rn-fixes-ui";
    style.textContent = ".product-card,.article-card,.blog-card,.rn-cms-post{transition:transform .2s ease,box-shadow .2s ease}.product-card:hover,.article-card:hover,.blog-card:hover,.rn-cms-post:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(0,180,216,.12)}.filter-btn.active,#rnBlogCats button.active{box-shadow:0 4px 12px rgba(11,30,58,.22)}.btn-primary,.btn-gold{transition:transform .15s ease,filter .15s ease}.btn-primary:hover,.btn-gold:hover{transform:translateY(-1px);filter:brightness(1.06)}#rnLangBtn:hover{border-color:#00B4D8!important}@media(max-width:640px){.filter-btn,.curr-btn{min-height:40px}}";
    document.head.appendChild(style);
  }

  function boot() {
    try { ensureLanguageSwitcher(); } catch (e) { console.warn("RN lang", e); }
    try { fixBlogSearch(); } catch (e) { console.warn("RN blog", e); }
    try { fixStoreSearchAndFilters(); } catch (e) { console.warn("RN store", e); }
    try { fixCurrency(); } catch (e) { console.warn("RN currency", e); }
    try { applyUiPolish(); } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

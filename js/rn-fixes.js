/**
 * RuffNeck Entertainment — Targeted Fixes
 * ---------------------------------------
 * Fixes ONLY:
 *  1. Language switcher missing on Homepage
 *  2. Blog search (ID mismatch: rnBlogSearch vs searchInput)
 *  3. Category filters reliability
 *  4. Currency switcher reliability
 *  5. Light UI polish helpers
 *
 * DOES NOT touch:
 *  - Flutterwave checkout
 *  - Google Apps Script
 *  - API routes (/api/cms/*, admin)
 *  - Payment / delivery / product IDs
 *  - Forms that already work
 */
(function () {
  "use strict";

  /* ============================================================
     1. LANGUAGE SWITCHER — ensure it exists on every page
     ============================================================ */
  function ensureLanguageSwitcher() {
    // Already present on Blog & Store
    if (document.getElementById("rnLangBtn") || document.getElementById("rnFixedLangBtn")) {
      return;
    }

    // Homepage is missing the HTML markup — inject it
    var header =
      document.querySelector("header .nav, .nav, header, #mainNav") ||
      document.body;

    var wrap = document.createElement("div");
    wrap.className = "rn-lang";
    wrap.id = "rnLang";
    wrap.style.cssText =
      "position:fixed;top:16px;right:16px;z-index:9999;";

    wrap.innerHTML =
      '<button type="button" class="rn-lang-btn" id="rnLangBtn" aria-haspopup="true" aria-expanded="false" title="Translate page" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:999px;background:#0B1E3A;color:#fff;border:1px solid rgba(0,180,216,.4);font-size:13px;font-weight:600;cursor:pointer;">' +
      '<span aria-hidden="true">🌐</span> <span id="rnLangLabel">EN</span>' +
      "</button>" +
      '<div class="rn-lang-menu" role="menu" id="rnLangMenu" style="display:none;position:absolute;right:0;top:110%;min-width:140px;background:#0B1E3A;border:1px solid rgba(0,180,216,.3);border-radius:12px;padding:6px;box-shadow:0 8px 24px rgba(0,0,0,.35);">' +
      '<button type="button" data-lang="en" data-label="EN" role="menuitem" style="display:block;width:100%;text-align:left;padding:8px 12px;background:none;border:none;color:#e2e8f0;border-radius:8px;cursor:pointer;font-size:13px;">EN English</button>' +
      '<button type="button" data-lang="ha" data-label="HA" role="menuitem" style="display:block;width:100%;text-align:left;padding:8px 12px;background:none;border:none;color:#e2e8f0;border-radius:8px;cursor:pointer;font-size:13px;">HA Hausa</button>' +
      '<button type="button" data-lang="yo" data-label="YO" role="menuitem" style="display:block;width:100%;text-align:left;padding:8px 12px;background:none;border:none;color:#e2e8f0;border-radius:8px;cursor:pointer;font-size:13px;">YO Yoruba</button>' +
      '<button type="button" data-lang="ig" data-label="IG" role="menuitem" style="display:block;width:100%;text-align:left;padding:8px 12px;background:none;border:none;color:#e2e8f0;border-radius:8px;cursor:pointer;font-size:13px;">IG Igbo</button>' +
      '<button type="button" data-lang="fr" data-label="FR" role="menuitem" style="display:block;width:100%;text-align:left;padding:8px 12px;background:none;border:none;color:#e2e8f0;border-radius:8px;cursor:pointer;font-size:13px;">FR French</button>' +
      '<button type="button" data-lang="es" data-label="ES" role="menuitem" style="display:block;width:100%;text-align:left;padding:8px 12px;background:none;border:none;color:#e2e8f0;border-radius:8px;cursor:pointer;font-size:13px;">ES Spanish</button>' +
      '<button type="button" data-lang="ar" data-label="AR" role="menuitem" style="display:block;width:100%;text-align:left;padding:8px 12px;background:none;border:none;color:#e2e8f0;border-radius:8px;cursor:pointer;font-size:13px;">AR Arabic</button>' +
      "</div>";

    // Hidden Google Translate mount point
    if (!document.getElementById("google_translate_element")) {
      var gt = document.createElement("div");
      gt.id = "google_translate_element";
      gt.setAttribute("aria-hidden", "true");
      gt.style.cssText = "position:absolute;left:-9999px;height:0;overflow:hidden;";
      document.body.appendChild(gt);
    }

    document.body.appendChild(wrap);

    // Wire the same behaviour your other pages already use
    var btn = document.getElementById("rnLangBtn");
    var menu = document.getElementById("rnLangMenu");
    var lab = document.getElementById("rnLangLabel");

    function setLang(lang, label) {
      if (lab) lab.textContent = label || lang.toUpperCase();
      try {
        localStorage.setItem("rn_lang", lang);
        localStorage.setItem("rn_lang_label", label || lang.toUpperCase());
      } catch (e) {}

      if (lang === "en") {
        document.cookie = "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
        document.cookie =
          "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=." +
          location.hostname;
        location.reload();
        return;
      }
      document.cookie = "googtrans=/en/" + lang + ";path=/;";
      document.cookie =
        "googtrans=/en/" + lang + ";path=/;domain=." + location.hostname;
      location.reload();
    }

    if (btn && menu) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = menu.style.display === "block";
        menu.style.display = open ? "none" : "block";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
      });
      menu.querySelectorAll("button[data-lang]").forEach(function (b) {
        b.addEventListener("click", function () {
          setLang(b.getAttribute("data-lang"), b.getAttribute("data-label"));
        });
      });
      document.addEventListener("click", function () {
        menu.style.display = "none";
        btn.setAttribute("aria-expanded", "false");
      });
    }

    // Restore saved label
    try {
      var savedL = localStorage.getItem("rn_lang_label");
      if (savedL && lab) lab.textContent = savedL;
    } catch (e) {}

    // Load Google Translate if not already present
    if (!(window.google && window.google.translate)) {
      window.rnInitGoogleTranslate = function () {
        try {
          new google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,ha,yo,ig,fr,es,ar",
              autoDisplay: false,
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            "google_translate_element"
          );
        } catch (e) {}
      };
      var s = document.createElement("script");
      s.src =
        "//translate.google.com/translate_a/element.js?cb=rnInitGoogleTranslate";
      document.head.appendChild(s);
    }
  }

  /* ============================================================
     2. BLOG SEARCH — fix ID mismatch (rnBlogSearch vs searchInput)
     ============================================================ */
  function fixBlogSearch() {
    var input =
      document.getElementById("rnBlogSearch") ||
      document.getElementById("searchInput");
    if (!input) return;

    // Make both IDs work
    if (input.id === "rnBlogSearch" && !document.getElementById("searchInput")) {
      // alias so older filterBlog code that looks for searchInput still works
      input.setAttribute("data-alias", "searchInput");
    }

    function runFilter() {
      if (typeof window.filterBlog === "function") {
        window.filterBlog();
        return;
      }
      // Fallback filter if filterBlog is broken / missing
      var q = (input.value || "").trim().toLowerCase();
      var activeBtn =
        document.querySelector(".filter-btn.active, [data-cat].active, button.active[data-cat]");
      var cat = activeBtn
        ? activeBtn.getAttribute("data-cat") || "all"
        : "all";

      var cards = document.querySelectorAll(
        ".blog-card, .article-card, [data-cat].blog-item, .blog-grid > article, .blog-grid > div"
      );
      var shown = 0;

      cards.forEach(function (card) {
        var cardCat = (card.getAttribute("data-cat") || "").toLowerCase();
        var text = (
          (card.getAttribute("data-name") || "") +
          " " +
          (card.textContent || "")
        ).toLowerCase();

        var catOk =
          !cat || cat === "all" || cardCat === cat || cardCat.indexOf(cat) !== -1;
        var searchOk = !q || text.indexOf(q) !== -1;
        var ok = catOk && searchOk;

        card.style.display = ok ? "" : "none";
        if (ok) shown++;
      });

      var countEl = document.getElementById("rnBlogSearchCount");
      if (countEl) {
        countEl.textContent =
          shown === 0 && (q || (cat && cat !== "all"))
            ? "No articles match"
            : shown + " article" + (shown !== 1 ? "s" : "");
      }
    }

    input.addEventListener("input", runFilter);
    input.addEventListener("keyup", runFilter);

    // Also bind filter buttons
    document
      .querySelectorAll(".filter-btn, [data-cat], button[data-cat]")
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          setTimeout(runFilter, 20);
        });
      });

    // Expose for external calls
    window.rnRunBlogFilter = runFilter;
  }

  /* ============================================================
     3. STORE SEARCH + FILTERS — make reliable
     ============================================================ */
  function fixStoreSearchAndFilters() {
    var input = document.getElementById("searchInput");
    if (!input && !document.querySelector(".product-card")) return;

    function runFilter() {
      if (typeof window.filterProducts === "function") {
        window.filterProducts();
        return;
      }
      // Fallback
      var activeBtn = document.querySelector(".filter-btn.active");
      var activeCat = activeBtn
        ? activeBtn.getAttribute("data-cat") || "all"
        : "all";
      var search = (input && input.value ? input.value : "").trim().toLowerCase();
      var cards = document.querySelectorAll(".product-card");
      var shown = 0;

      cards.forEach(function (card) {
        if (card.closest && card.closest(".rn-featured, .rn-store-featured")) {
          // keep featured section visible
          return;
        }
        var cat = card.getAttribute("data-cat") || "";
        var hay = (
          (card.getAttribute("data-name") || "") +
          " " +
          cat +
          " " +
          (card.textContent || "")
        ).toLowerCase();

        var catMatch =
          !activeCat ||
          activeCat === "all" ||
          cat === activeCat ||
          cat.indexOf(activeCat) !== -1;
        var match = !search || hay.indexOf(search) !== -1;
        var ok = catMatch && match;

        card.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
    }

    if (input) {
      input.addEventListener("input", runFilter);
      input.addEventListener("keyup", runFilter);
    }

    document.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document
          .querySelectorAll(".filter-btn")
          .forEach(function (b) {
            b.classList.remove("active");
          });
        btn.classList.add("active");
        setTimeout(runFilter, 10);
      });
    });

    window.rnRunStoreFilter = runFilter;
  }

  /* ============================================================
     4. CURRENCY — ensure setCurrency + price updates work
     ============================================================ */
  function fixCurrency() {
    // Only run on store page
    if (!document.getElementById("currBtnNGN") && !document.querySelector("[data-ngn]")) {
      return;
    }

    var RATE = 1600; // 1 USD = ₦1600 — change if needed

    // Ensure global currentCurrency exists
    if (typeof window.currentCurrency === "undefined") {
      try {
        window.currentCurrency =
          localStorage.getItem("rn_store_currency") || "NGN";
      } catch (e) {
        window.currentCurrency = "NGN";
      }
    }

    // Safe formatPrice if missing
    if (typeof window.formatPrice !== "function") {
      window.formatPrice = function (ngnAmount) {
        var n = Number(ngnAmount) || 0;
        if (window.currentCurrency === "USD") {
          return "$" + (n / RATE).toFixed(2);
        }
        return "₦" + n.toLocaleString();
      };
    }

    // Safe updateAllPriceDisplays if missing / broken
    if (typeof window.updateAllPriceDisplays !== "function") {
      window.updateAllPriceDisplays = function () {
        document.querySelectorAll(".price-val[data-ngn]").forEach(function (el) {
          var ngn = Number(el.getAttribute("data-ngn")) || 0;
          el.textContent = window.formatPrice(ngn);
        });
      };
    }

    // Enhance existing setCurrency or create it
    var originalSetCurrency = window.setCurrency;
    window.setCurrency = function (curr) {
      if (curr !== "NGN" && curr !== "USD") return;
      window.currentCurrency = curr;
      try {
        localStorage.setItem("rn_store_currency", curr);
      } catch (e) {}

      var ngnBtn = document.getElementById("currBtnNGN");
      var usdBtn = document.getElementById("currBtnUSD");
      if (ngnBtn) {
        ngnBtn.classList.toggle("active", curr === "NGN");
        ngnBtn.setAttribute("aria-pressed", curr === "NGN" ? "true" : "false");
      }
      if (usdBtn) {
        usdBtn.classList.toggle("active", curr === "USD");
        usdBtn.setAttribute("aria-pressed", curr === "USD" ? "true" : "false");
      }

      if (typeof window.updateAllPriceDisplays === "function") {
        window.updateAllPriceDisplays();
      }
      if (typeof window.renderCart === "function") {
        try {
          window.renderCart();
        } catch (e) {}
      }

      // Call original if it existed and is different
      if (typeof originalSetCurrency === "function" && originalSetCurrency !== window.setCurrency) {
        try {
          originalSetCurrency(curr);
        } catch (e) {}
      }
    };

    // Bind buttons (in case onclick is missing or broken)
    var ngnBtn = document.getElementById("currBtnNGN");
    var usdBtn = document.getElementById("currBtnUSD");
    if (ngnBtn) {
      ngnBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.setCurrency("NGN");
      });
    }
    if (usdBtn) {
      usdBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.setCurrency("USD");
      });
    }

    // Apply saved currency on load
    try {
      var saved = localStorage.getItem("rn_store_currency");
      if (saved === "USD" || saved === "NGN") {
        window.setCurrency(saved);
      } else {
        window.updateAllPriceDisplays();
      }
    } catch (e) {
      window.updateAllPriceDisplays();
    }
  }

  /* ============================================================
     5. LIGHT UI POLISH (safe, no layout breaks)
     ============================================================ */
  function applyUiPolish() {
    var style = document.createElement("style");
    style.id = "rn-fixes-ui";
    style.textContent =
      ".product-card,.article-card,.blog-card{transition:transform .2s ease,box-shadow .2s ease}" +
      ".product-card:hover,.article-card:hover,.blog-card:hover{transform:translateY(-4px);box-shadow:0 12px 28px rgba(0,180,216,.12)}" +
      ".filter-btn.active{box-shadow:0 4px 12px rgba(11,30,58,.25)}" +
      ".btn-primary,.btn-gold{transition:transform .15s ease,filter .15s ease}" +
      ".btn-primary:hover,.btn-gold:hover{transform:translateY(-1px);filter:brightness(1.06)}" +
      "#rnLangBtn:hover{border-color:#00B4D8!important}" +
      "@media(max-width:640px){.filter-btn,.curr-btn{min-height:40px}}";
    if (!document.getElementById("rn-fixes-ui")) {
      document.head.appendChild(style);
    }
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    try {
      ensureLanguageSwitcher();
    } catch (e) {
      console.warn("RN language fix", e);
    }
    try {
      fixBlogSearch();
    } catch (e) {
      console.warn("RN blog search fix", e);
    }
    try {
      fixStoreSearchAndFilters();
    } catch (e) {
      console.warn("RN store search fix", e);
    }
    try {
      fixCurrency();
    } catch (e) {
      console.warn("RN currency fix", e);
    }
    try {
      applyUiPolish();
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

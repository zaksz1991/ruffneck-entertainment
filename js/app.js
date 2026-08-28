/**
 * RuffNeck Entertainment — single application controller (Pass 1 JS cleanup)
 * One init for: navigation, services, chat, language menu, theme, media, analytics.
 * Forms remain in /js/forms.js (unchanged).
 */
(function () {
  "use strict";

  var RN = window.RN || {};
  if (RN.initialized) return;
  RN.initialized = true;
  window.RN = RN;

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function initOnce(el, key, setup) {
    if (!el || el.dataset[key] === "true") return;
    el.dataset[key] = "true";
    setup(el);
  }

  /* ---------- Analytics ---------- */
  RN.analytics = function () {
    window.rnTrack = function (name, params) {
      try {
        params = params || {};
        if (typeof window.gtag === "function") window.gtag("event", name, params);
        if (Array.isArray(window.dataLayer)) {
          window.dataLayer.push(Object.assign({ event: name }, params));
        }
      } catch (e) {}
    };

    if (document.documentElement.dataset.rnAnalytics === "true") return;
    document.documentElement.dataset.rnAnalytics = "true";

    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a, button");
      if (!a) return;
      var href = (a.getAttribute("href") || "").toLowerCase();
      var text = (a.textContent || "").trim().slice(0, 80);
      if (href.indexOf("wa.me") !== -1 || href.indexOf("whatsapp") !== -1) {
        window.rnTrack("whatsapp_click", { link_text: text });
      } else if (href.indexOf("calendly") !== -1) {
        window.rnTrack("consultation_start", { link_text: text });
      } else if (href.indexOf("/store") !== -1) {
        window.rnTrack("store_view", { link_text: text });
      } else if (href.indexOf("/blog") !== -1) {
        window.rnTrack("blog_navigation", { link_text: text });
      }
    });
  };

  /* ---------- Theme ---------- */
  RN.theme = function () {
    var btn = qs("#rnThemeBtn, .rn-theme-btn, [data-action='toggle-theme']");
    function apply(dark) {
      document.documentElement.classList.toggle("rn-dark", !!dark);
      try {
        localStorage.setItem("rn_theme", dark ? "dark" : "light");
      } catch (e) {}
      if (btn) btn.setAttribute("aria-pressed", dark ? "true" : "false");
    }
    // FOUC preference already applied in <head>; only bind toggle here
    initOnce(btn || document.documentElement, "rnThemeBound", function () {
      if (!btn) return;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        apply(!document.documentElement.classList.contains("rn-dark"));
      });
    });
  };

  /* ---------- Navigation ---------- */
  RN.navigation = function () {
    var btn = qs("#hamburger");
    var menu = qs("#mobileMenu");
    if (!btn || !menu) return;

    initOnce(btn, "rnNavBound", function () {
      function setOpen(open) {
        menu.classList.toggle("open", open);
        menu.classList.toggle("is-open", open);
        btn.classList.toggle("is-open", open);
        if (open) menu.removeAttribute("hidden");
        else menu.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.classList.toggle("nav-open", open);
      }

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(!menu.classList.contains("open"));
      });

      qsa("a", menu).forEach(function (a) {
        a.addEventListener("click", function () {
          setOpen(false);
        });
      });

      document.addEventListener("click", function (e) {
        if (!menu.classList.contains("open")) return;
        if (menu.contains(e.target) || btn.contains(e.target)) return;
        setOpen(false);
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setOpen(false);
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 920) setOpen(false);
      });

      setOpen(false);
    });
  };

  /* ---------- Services accordion + show-all ---------- */
  RN.services = function () {
    function ensureInner(popup) {
      if (!popup || qs(".rn-acc-inner", popup)) return;
      var inner = document.createElement("div");
      inner.className = "rn-acc-inner";
      while (popup.firstChild) inner.appendChild(popup.firstChild);
      popup.appendChild(inner);
    }

    function setHint(card, open) {
      var h = qs(".expand-hint", card);
      if (!h) return;
      h.innerHTML = open
        ? 'Hide details <span class="expand-chevron" aria-hidden="true">⌃</span>'
        : 'View details <span class="expand-chevron" aria-hidden="true">⌄</span>';
    }

    function closeCard(card) {
      card.classList.remove("open");
      card.setAttribute("aria-expanded", "false");
      setHint(card, false);
    }

    function openCard(card) {
      qsa(".service-card.open").forEach(function (c) {
        if (c !== card) closeCard(c);
      });
      card.classList.add("open");
      card.setAttribute("aria-expanded", "true");
      setHint(card, true);
    }

    function toggleCard(card) {
      if (card.classList.contains("open")) closeCard(card);
      else openCard(card);
    }

    function bindCard(card) {
      if (card.getAttribute("data-rn-acc") === "1") return;
      card.setAttribute("data-rn-acc", "1");
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-expanded", "false");
      ensureInner(qs(".service-popup", card));

      card.addEventListener("click", function (e) {
        if (e.target.closest("a")) return;
        e.preventDefault();
        toggleCard(card);
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleCard(card);
        }
        if (e.key === "Escape" && card.classList.contains("open")) closeCard(card);
      });
    }

    qsa(".service-card").forEach(bindCard);

    var showBtn = qs("#showAllServices") || qs("#rnSvcToggle");
    if (showBtn) {
      initOnce(showBtn, "rnShowAllBound", function (btn) {
        var extras = qsa(".service-card.rn-svc-extra");
        if (!extras.length) {
          btn.style.display = "none";
          return;
        }
        document.body.classList.remove("rn-show-all-services");
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = "Show all services (" + extras.length + " more)";
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          var open = document.body.classList.toggle("rn-show-all-services");
          btn.setAttribute("aria-expanded", open ? "true" : "false");
          btn.textContent = open
            ? "Show fewer services"
            : "Show all services (" + extras.length + " more)";
          if (open) {
            try {
              extras[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
            } catch (err) {}
          }
          qsa(".service-card").forEach(bindCard);
        });
      });
    }
  };

  /* ---------- Chat ---------- */
  RN.chat = function () {
    window.rnToggleChat = function () {
      var bubble = qs("#rnChatBubble");
      var panel = qs("#rnChatPanel");
      if (!bubble || !panel) return;
      var open = !bubble.classList.contains("open");
      bubble.classList.toggle("open", open);
      panel.classList.toggle("is-open", open);
      panel.style.setProperty("display", open ? "flex" : "none", "important");
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      var t = qs("#rnChatToggle");
      if (t) t.setAttribute("aria-expanded", open ? "true" : "false");
    };

    var toggle = qs("#rnChatToggle");
    initOnce(toggle || document.documentElement, "rnChatBound", function () {
      if (toggle) {
        toggle.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          window.rnToggleChat();
        });
      }
      var closer = qs("#rnChatPanel .rn-chat-close, .rn-chat-close, #rnNChatClose");
      if (closer) {
        closer.addEventListener("click", function (e) {
          e.preventDefault();
          var bubble = qs("#rnChatBubble");
          var panel = qs("#rnChatPanel");
          if (bubble) bubble.classList.remove("open");
          if (panel) {
            panel.classList.remove("is-open");
            panel.style.setProperty("display", "none", "important");
            panel.setAttribute("aria-hidden", "true");
          }
          if (toggle) toggle.setAttribute("aria-expanded", "false");
        });
      }
      document.addEventListener("keydown", function (e) {
        if (e.key !== "Escape") return;
        var bubble = qs("#rnChatBubble");
        var panel = qs("#rnChatPanel");
        if (!bubble || !bubble.classList.contains("open")) return;
        bubble.classList.remove("open");
        if (panel) {
          panel.classList.remove("is-open");
          panel.style.setProperty("display", "none", "important");
        }
      });
    });
  };

  /* ---------- Language menu (UI only; Google Translate init kept separate if present) ---------- */
  RN.language = function () {
    var btn =
      qs("#rnFixedLangBtn") ||
      qs("#rnLangBtn") ||
      qs(".rn-lang-btn");
    var menu =
      qs("#rnFixedLangMenu") ||
      qs(".rn-lang-menu") ||
      (btn && btn.parentElement && qs(".rn-lang-menu", btn.parentElement));

    if (!btn) return;

    initOnce(btn, "rnLangBound", function () {
      function setOpen(open) {
        if (menu) {
          menu.classList.toggle("open", open);
          menu.style.display = open ? "block" : "none";
        }
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      }

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = menu
          ? !(menu.classList.contains("open") || menu.style.display === "block")
          : false;
        setOpen(open);
      });

      document.addEventListener("click", function (e) {
        if (!menu) return;
        if (btn.contains(e.target) || menu.contains(e.target)) return;
        setOpen(false);
      });

      if (menu) {
        qsa("button[data-lang], a[data-lang]", menu).forEach(function (b) {
          b.addEventListener("click", function () {
            setOpen(false);
          });
        });
      }
    });
  };

  /* ---------- Media ---------- */
  RN.media = function () {
    if (document.documentElement.dataset.rnMedia === "true") return;
    document.documentElement.dataset.rnMedia = "true";

    qsa("img:not([loading])").forEach(function (img) {
      if (!img.closest("header") && !img.closest("#nav") && !img.closest(".nav")) {
        img.setAttribute("loading", "lazy");
        img.setAttribute("decoding", "async");
      }
    });

    // Social link labels if missing
    qsa("a[href]").forEach(function (a) {
      if (a.getAttribute("aria-label")) return;
      var h = (a.getAttribute("href") || "").toLowerCase();
      if (h.indexOf("facebook") !== -1) a.setAttribute("aria-label", "Facebook");
      else if (h.indexOf("instagram") !== -1) a.setAttribute("aria-label", "Instagram");
      else if (h.indexOf("twitter") !== -1 || h.indexOf("x.com") !== -1)
        a.setAttribute("aria-label", "X (Twitter)");
      else if (h.indexOf("wa.me") !== -1 || h.indexOf("whatsapp") !== -1)
        a.setAttribute("aria-label", "WhatsApp");
    });
  };

  /* ---------- Boot ---------- */
  function init() {
    RN.analytics();
    RN.theme();
    RN.navigation();
    RN.services();
    RN.chat();
    RN.language();
    RN.media();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

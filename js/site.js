(function () {
  // Theme
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var saved = localStorage.getItem('rn_theme');
  if (saved) {
    root.setAttribute('data-theme', saved);
    if (toggle) toggle.textContent = saved === 'light' ? '☼' : '☾';
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('rn_theme', next);
      toggle.textContent = next === 'light' ? '☼' : '☾';
    });
  }

  // Mobile menu
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    function closeMenu() {
      mobileMenu.hidden = true;
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    function openMenu() {
      mobileMenu.hidden = false;
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (mobileMenu.hidden) openMenu();
      else closeMenu();
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', function (e) {
      if (mobileMenu.hidden) return;
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
    });
  }

  // Service expand
  document.querySelectorAll('.service-card .expand-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var card = btn.closest('.service-card');
      var details = card.querySelector('.card-details');
      if (!details) return;
      var open = details.hidden;
      // accordion
      document.querySelectorAll('.service-card .card-details').forEach(function (d) {
        d.hidden = true;
      });
      document.querySelectorAll('.service-card .expand-btn').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        b.textContent = 'View details';
      });
      if (open) {
        details.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = 'Hide details';
      }
    });
  });

  // Show more services
  var showBtn = document.getElementById('showAllServices');
  if (showBtn) {
    showBtn.addEventListener('click', function () {
      document.querySelectorAll('.more-service').forEach(function (c) {
        c.hidden = false;
      });
      showBtn.style.display = 'none';
    });
  }
})();

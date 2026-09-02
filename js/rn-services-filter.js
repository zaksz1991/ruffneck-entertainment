
/**
 * Homepage services: tab filters + Show all services
 * Matches data-filter on .tab-btn to data-category on .service-card
 */
(function () {
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var tabs = document.querySelectorAll('.services-tabs .tab-btn, .tab-btn[data-filter]');
    var cards = function () {
      return document.querySelectorAll('#services .service-card, .service-card[data-category]');
    };
    var showAllBtn = document.getElementById('showAllServices');

    function applyFilter(filter) {
      filter = filter || 'all';
      var list = cards();
      var visible = 0;
      list.forEach(function (card) {
        var cat = card.getAttribute('data-category') || '';
        var match = filter === 'all' || cat === filter;
        // When filtering a category, also show extra cards in that category
        card.hidden = !match;
        card.style.display = match ? '' : 'none';
        if (match) {
          card.classList.remove('rn-svc-hidden');
          visible++;
        } else {
          card.classList.add('rn-svc-hidden');
        }
      });
      // Update show-all label
      if (showAllBtn) {
        var hiddenExtras = document.querySelectorAll('.service-card.rn-svc-extra[style*="display: none"], .service-card.rn-svc-extra[hidden]');
        // Simpler: count extras not visible
        var extraTotal = document.querySelectorAll('.service-card.rn-svc-extra').length;
        var extraVisible = 0;
        document.querySelectorAll('.service-card.rn-svc-extra').forEach(function (c) {
          if (!c.hidden && c.style.display !== 'none') extraVisible++;
        });
        var more = Math.max(0, extraTotal - extraVisible);
        if (filter === 'all') {
          // optional collapse extras until Show all — keep all visible when "all"
          showAllBtn.textContent = extraTotal ? 'Show all services' : 'Show all services';
        } else {
          showAllBtn.textContent = 'Show all services';
        }
      }
      tabs.forEach(function (btn) {
        var on = (btn.getAttribute('data-filter') || '') === filter;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    tabs.forEach(function (btn) {
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
      btn.addEventListener('click', function () {
        applyFilter(btn.getAttribute('data-filter') || 'all');
      });
    });

    if (showAllBtn) {
      showAllBtn.addEventListener('click', function () {
        // Reveal every service card
        cards().forEach(function (card) {
          card.hidden = false;
          card.style.display = '';
          card.classList.remove('rn-svc-hidden');
        });
        // Reset tabs to All
        applyFilter('all');
        var grid = document.querySelector('#services .services-grid, #services');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Initial: show all (or respect .active tab)
    var active = document.querySelector('.tab-btn.active[data-filter]');
    applyFilter(active ? active.getAttribute('data-filter') : 'all');
  });
})();

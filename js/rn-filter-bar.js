/**
 * <rn-filter-bar
 *   target="[data-product-card]"
 *   category-attr="data-category"
 *   categories="all,ai-career,prompts,templates"
 *   labels='{"all":"All products"}'
 * ></rn-filter-bar>
 * Client-side only. Dispatches "rn-filter" event.
 */
class RnFilterBar extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rnReady) return;
    this.dataset.rnReady = '1';
    this.active = 'all';
    this.render();
    this.bind();
    this.apply('all');
  }

  getCategories() {
    const raw = this.getAttribute('categories');
    if (raw) return raw.split(',').map((s) => s.trim()).filter(Boolean);
    return ['all', 'ai-career', 'prompts', 'templates', 'design', 'business', 'it-support'];
  }

  getLabels() {
    const defaults = {
      all: 'All products',
      'ai-career': 'AI careers',
      prompts: 'Prompts and content',
      templates: 'CVs and career documents',
      design: 'Marketing resources',
      business: 'Business systems',
      'it-support': 'IT services',
      content: 'Content',
      careers: 'Careers',
      operations: 'Operations',
      marketing: 'Marketing',
      ethics: 'Ethics',
    };
    try {
      const custom = this.getAttribute('labels');
      if (custom) return { ...defaults, ...JSON.parse(custom) };
    } catch (_) {}
    return defaults;
  }

  render() {
    const cats = this.getCategories();
    const labels = this.getLabels();
    this.classList.add('rn-filter-bar');
    this.innerHTML = `
      <div class="rn-filter-row" role="toolbar" aria-label="Categories">
        ${cats
          .map(
            (c, i) => `
          <button type="button"
            class="filter-chip${i === 0 ? ' is-active' : ''}"
            data-filter="${c}"
            aria-pressed="${i === 0 ? 'true' : 'false'}">
            ${labels[c] || c}
          </button>`
          )
          .join('')}
      </div>`;
  }

  bind() {
    this.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn || !this.contains(btn)) return;
      const filter = btn.getAttribute('data-filter') || 'all';
      this.active = filter;
      this.querySelectorAll('[data-filter]').forEach((b) => {
        const on = b === btn;
        b.setAttribute('aria-pressed', String(on));
        b.classList.toggle('is-active', on);
      });
      this.apply(filter);
    });
  }

  apply(filter) {
    const sel = this.getAttribute('target') || '[data-product-card], .product-card, .blog-card, .article-card';
    const attr = this.getAttribute('category-attr') || 'data-category';
    const query = (this._searchQuery || '').toLowerCase();
    let visible = 0;
    document.querySelectorAll(sel).forEach((card) => {
      const cat =
        card.getAttribute(attr) ||
        card.getAttribute('data-cat') ||
        card.getAttribute('data-category') ||
        '';
      const text = (card.textContent || '').toLowerCase();
      const catOk = filter === 'all' || cat === filter || cat.indexOf(filter) !== -1;
      const searchOk = !query || text.indexOf(query) !== -1;
      const show = catOk && searchOk;
      card.hidden = !show;
      if (show) {
        card.style.removeProperty('display');
        visible++;
      } else {
        card.style.display = 'none';
      }
    });
    const status = document.querySelector(this.getAttribute('status') || '#catalog-status, #blog-status');
    if (status) {
      status.textContent = visible
        ? `${visible} item${visible === 1 ? '' : 's'} shown`
        : 'No items match your filters';
    }
    this.dispatchEvent(
      new CustomEvent('rn-filter', { bubbles: true, detail: { filter, visible, query } })
    );
  }

  setSearchQuery(q) {
    this._searchQuery = q || '';
    this.apply(this.active || 'all');
  }
}

if (!customElements.get('rn-filter-bar')) {
  customElements.define('rn-filter-bar', RnFilterBar);
}
export { RnFilterBar };

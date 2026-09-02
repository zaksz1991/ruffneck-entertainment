class RnSearch extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rnReady) return;
    this.dataset.rnReady = '1';
    const ph = this.getAttribute('placeholder') || 'Search...';
    this.classList.add('rn-search');
    this.innerHTML = `<label class="rn-search__label"><span class="sr-only">Search</span><input type="search" class="rn-search__input" placeholder="${ph}" autocomplete="off"/></label>`;
    const input = this.querySelector('input');
    const run = () => {
      const q = (input.value || '').trim();
      const bar = document.querySelector(this.getAttribute('filter-bar') || 'rn-filter-bar');
      if (bar && typeof bar.setSearchQuery === 'function') { bar.setSearchQuery(q); return; }
      const sel = this.getAttribute('target') || '[data-product-card], .blog-card, .article-card, .product-card';
      const lower = q.toLowerCase();
      document.querySelectorAll(sel).forEach(card => {
        const text = (card.textContent || '').toLowerCase();
        const show = !lower || text.indexOf(lower) !== -1;
        card.hidden = !show;
        card.style.display = show ? '' : 'none';
      });
    };
    input.addEventListener('input', run);
    input.addEventListener('search', run);
  }
}
if (!customElements.get('rn-search')) customElements.define('rn-search', RnSearch);
export { RnSearch };

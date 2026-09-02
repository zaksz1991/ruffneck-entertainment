class RnHeader extends HTMLElement {
  static get observedAttributes() { return ['cart-count']; }
  connectedCallback() {
    if (this.dataset.rnReady) return;
    this.dataset.rnReady = '1';
    this.render();
    this.bind();
  }
  attributeChangedCallback() {
    const el = this.querySelector('[data-cart-count]');
    if (el) el.textContent = this.getAttribute('cart-count') || '0';
  }
  render() {
    const count = this.getAttribute('cart-count') || '0';
    const cur = (this.getAttribute('current') || '').toLowerCase();
    const link = (href, label, key) => {
      const a = cur === key ? ' aria-current="page"' : '';
      return `<a href="${href}"${a}>${label}</a>`;
    };
    this.innerHTML = `<header class="rn-wc-header site-header"><div class="rn-wc-header__inner">
      <a class="rn-wc-logo" href="/"><img src="/logo.png" width="36" height="36" alt="RuffNeck Entertainment" onerror="this.style.display='none'"/><span>RuffNeck</span></a>
      <nav class="rn-wc-nav" aria-label="Primary">${link('/','Home','home')}${link('/store','Store','store')}${link('/blog','Blog','blog')}${link('/#services','Services','services')}${link('https://wa.me/2348033807856','Support','support')}</nav>
      <div class="rn-wc-actions">
        <button type="button" class="rn-wc-cart" data-cart aria-label="Open cart">Cart <span class="rn-wc-cart-count" data-cart-count>${count}</span></button>
        <button type="button" class="rn-wc-menu" data-menu aria-expanded="false" aria-controls="rn-wc-panel" aria-label="Open menu">☰</button>
      </div></div>
      <div class="rn-wc-panel" id="rn-wc-panel" data-panel hidden>
        ${link('/','Home','home')}${link('/store','Store','store')}${link('/blog','Blog','blog')}${link('/#services','Services','services')}${link('https://wa.me/2348033807856','Support','support')}
      </div></header>`;
  }
  bind() {
    this.querySelector('[data-cart]')?.addEventListener('click', () => {
      if (typeof window.toggleCart === 'function') window.toggleCart();
      else window.location.href = '/store';
    });
    const menuBtn = this.querySelector('[data-menu]');
    const panel = this.querySelector('[data-panel]');
    menuBtn?.addEventListener('click', () => {
      const open = panel.hasAttribute('hidden');
      if (open) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
  }
}
if (!customElements.get('rn-header')) customElements.define('rn-header', RnHeader);
export { RnHeader };

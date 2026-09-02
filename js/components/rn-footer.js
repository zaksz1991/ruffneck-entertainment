class RnFooter extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rnReady) return;
    this.dataset.rnReady = '1';
    this.classList.add('rn-footer','site-footer');
    this.innerHTML = `<p>© RuffNeck Entertainment · <a href="/">Home</a> · <a href="/store">Store</a> · <a href="/blog">Blog</a> · <a href="https://wa.me/2348033807856">WhatsApp</a></p>`;
  }
}
if (!customElements.get('rn-footer')) customElements.define('rn-footer', RnFooter);
export { RnFooter };

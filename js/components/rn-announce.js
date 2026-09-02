class RnAnnounce extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rnReady) return;
    this.dataset.rnReady = '1';
    this.classList.add('rn-announce');
    this.setAttribute('role', 'note');
    if (this.getAttribute('text')) { this.textContent = this.getAttribute('text'); return; }
    this.innerHTML = 'Practical AI &amp; digital systems for Nigerian professionals · <a href="/store">Digital store</a> · <a href="https://wa.me/2348033807856">WhatsApp support</a>';
  }
}
if (!customElements.get('rn-announce')) customElements.define('rn-announce', RnAnnounce);
export { RnAnnounce };

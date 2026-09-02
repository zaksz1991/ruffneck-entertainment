/**
 * <rn-announce></rn-announce>
 * Optional attributes:
 *   text — override default message (plain text; links stay default)
 * Does not alter external URLs.
 */
class RnAnnounce extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rnReady) return;
    this.dataset.rnReady = '1';
    this.classList.add('rn-announce');
    this.setAttribute('role', 'note');
    const custom = this.getAttribute('text');
    if (custom) {
      this.textContent = custom;
      return;
    }
    this.innerHTML =
      'Practical AI &amp; digital systems for Nigerian professionals · ' +
      '<a href="/store">Digital store</a> · ' +
      '<a href="https://wa.me/2348033807856">WhatsApp support</a>';
  }
}

if (!customElements.get('rn-announce')) {
  customElements.define('rn-announce', RnAnnounce);
}
export { RnAnnounce };

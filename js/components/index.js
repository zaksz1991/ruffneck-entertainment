import './rn-announce.js';
import './rn-header.js';
import './rn-filter-bar.js';
import './rn-search.js';
import './rn-footer.js';
const syncCart = () => {
  const native = document.getElementById('cartCount');
  const header = document.querySelector('rn-header');
  if (native && header) header.setAttribute('cart-count', native.textContent || '0');
};
document.addEventListener('DOMContentLoaded', () => {
  syncCart();
  const native = document.getElementById('cartCount');
  if (native && 'MutationObserver' in window) {
    new MutationObserver(syncCart).observe(native, {childList:true, characterData:true, subtree:true});
  }
});

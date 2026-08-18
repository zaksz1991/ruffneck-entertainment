/**
 * RuffNeck Entertainment – Lead Magnet Form Handler
 * Commercial-grade version with better UX and error handling
 */

const LEAD_MAGNET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycby0mX6rqzDHVPy1deNqpHAnBC_f0QRL5f0jL5Bdwxfo4e4AFDO2flbCkV8fjIoT-1w/exec';
// ⬆️ REPLACE the URL above with your NEW Google Apps Script Web App URL after deploying

const PDF_URL = 'https://ruffneck-entertainment.vercel.app/20_AI_Prompts_RuffNeck.pdf';

function submitLeadMagnet(event) {
  event.preventDefault();

  const nameInput  = document.getElementById('lmName');
  const emailInput = document.getElementById('lmEmail');
  const msgEl      = document.getElementById('lmMsg');
  const btn        = document.getElementById('lmSubmitBtn');

  const name  = (nameInput?.value || '').trim();
  const email = (emailInput?.value || '').trim().toLowerCase();

  // Reset message
  msgEl.style.display = 'none';
  msgEl.textContent = '';

  // Validation
  if (!name || name.length < 2) {
    showMessage(msgEl, 'Please enter your full name.', 'error');
    nameInput?.focus();
    return false;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage(msgEl, 'Please enter a valid email address.', 'error');
    emailInput?.focus();
    return false;
  }

  // Loading state
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  // Demo / placeholder check
  if (!LEAD_MAGNET_WEBHOOK_URL || LEAD_MAGNET_WEBHOOK_URL.includes('PLACEHOLDER')) {
    setTimeout(() => {
      showMessage(msgEl, '✅ Got it! (Demo mode — update the webhook URL to send real emails.)', 'success');
      resetButton(btn, originalText);
      document.getElementById('leadMagnetForm')?.reset();
    }, 700);
    return false;
  }

  // Send to Google Apps Script
  fetch(LEAD_MAGNET_WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors', // Required for Apps Script from browser
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      type: 'lead_magnet',
      customer_name: name,
      customer_email: email,
      resource: '20 AI Prompts for Nigerian Businesses',
      pdf_url: PDF_URL,
      date: new Date().toISOString(),
      source: window.location.href
    })
  })
  .then(() => {
    // Success UI
    showMessage(msgEl, '✅ Check your email! Your free guide is on its way.', 'success');
    resetButton(btn, originalText);
    document.getElementById('leadMagnetForm')?.reset();

    // Optional: track conversion
    if (typeof gtag === 'function') {
      gtag('event', 'generate_lead', {
        event_category: 'Lead Magnet',
        event_label: '20 AI Prompts'
      });
    }
  })
  .catch((err) => {
    console.error('Lead magnet error:', err);
    showMessage(msgEl, 'Something went wrong. Please try again or WhatsApp us on +234 803 380 7856.', 'error');
    resetButton(btn, originalText);
  });

  return false;
}

function showMessage(el, text, type) {
  if (!el) return;
  el.style.display = 'block';
  el.textContent = text;
  el.style.color = type === 'error' ? '#EF4444' : '#00B4D8';
}

function resetButton(btn, text) {
  if (!btn) return;
  btn.textContent = text;
  btn.disabled = false;
  btn.style.opacity = '1';
}

// Expose globally for the onsubmit attribute
window.submitLeadMagnet = submitLeadMagnet;

/**
 * RuffNeck Entertainment – Lead Magnet Form Handler
 * Final commercial version
 */

const LEAD_MAGNET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycby0mX6rqzDHVPy1deNqpHAnBC_f0QRL5f0jL5Bdwxfo4e4AFDO2flbCkV8fjIoT-1w/exec';
const PDF_URL = 'https://ruffneck-entertainment.vercel.app/20_AI_Prompts_RuffNeck.pdf';
const CALENDLY_URL = 'https://calendly.com/hassanzakariyabiz/30min';

function submitLeadMagnet(event) {
  event.preventDefault();

  const nameInput  = document.getElementById('lmName');
  const emailInput = document.getElementById('lmEmail');
  const msgEl      = document.getElementById('lmMsg');
  const btn        = document.getElementById('lmSubmitBtn');
  const form       = document.getElementById('leadMagnetForm');

  const name  = (nameInput?.value || '').trim();
  const email = (emailInput?.value || '').trim().toLowerCase();

  // Reset
  if (msgEl) {
    msgEl.style.display = 'none';
    msgEl.textContent = '';
  }

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
  btn.style.opacity = '0.75';

  fetch(LEAD_MAGNET_WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
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
    // Success – replace form with thank-you state
    showSuccessState(form, name);
    
    // Analytics
    if (typeof gtag === 'function') {
      gtag('event', 'generate_lead', {
        event_category: 'Lead Magnet',
        event_label: '20 AI Prompts'
      });
    }
  })
  .catch((err) => {
    console.error('Lead magnet error:', err);
    showMessage(msgEl, 'Something went wrong. Please try again or WhatsApp +234 803 380 7856.', 'error');
    resetButton(btn, originalText);
  });

  return false;
}

function showSuccessState(form, name) {
  if (!form) return;

  form.innerHTML = `
    <div style="text-align:center; padding: 8px 0;">
      <div style="font-size: 36px; margin-bottom: 12px;">✅</div>
      <h3 style="color: #0A0F1E; font-size: 18px; margin: 0 0 8px;">Thank you${name ? ', ' + name.split(' ')[0] : ''}!</h3>
      <p style="color: #64748b; font-size: 14px; margin: 0 0 16px; line-height: 1.5;">
        Your free guide is on its way to your email.<br>
        Check your inbox (and spam folder just in case).
      </p>
      <a href="${PDF_URL}" target="_blank" rel="noopener"
         style="display:inline-block; background:#00C2FF; color:#0A0F1E; 
                font-weight:700; padding:12px 22px; border-radius:8px; 
                text-decoration:none; font-size:14px; margin-bottom:12px;">
        Download PDF Now →
      </a>
      <p style="color: #64748b; font-size: 13px; margin: 16px 0 8px;">
        Want personalised AI support for your business?
      </p>
      <a href="${CALENDLY_URL}" target="_blank" rel="noopener"
         style="display:inline-block; border:1.5px solid #00C2FF; color:#00C2FF; 
                font-weight:600; padding:10px 18px; border-radius:8px; 
                text-decoration:none; font-size:13px;">
        Book a Free 30-min Call
      </a>
    </div>
  `;
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

window.submitLeadMagnet = submitLeadMagnet;

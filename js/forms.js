/**
 * RuffNeck Entertainment – All Website Forms
 * Lead Magnet | Contact | Webinar Notify
 */

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycby0mX6rqzDHVPy1deNqpHAnBC_f0QRL5f0jL5Bdwxfo4e4AFDO2flbCkV8fjIoT-1w/exec';
const PDF_URL = 'https://ruffneck-entertainment.vercel.app/20_AI_Prompts_RuffNeck.pdf';
const CALENDLY_URL = 'https://calendly.com/hassanzakariyabiz/30min';

function postToWebhook(payload) {
  // Apps Script web apps often require opaque no-cors POSTs from the browser.
  // Success is confirmed operationally via Sheet row + email, not response body.
  return fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
}

/* ───────── Lead Magnet ───────── */
var __rnLeadSubmitting = false;

function submitLeadMagnet(event) {
  event.preventDefault();

  const nameInput  = document.getElementById('lmName');
  const emailInput = document.getElementById('lmEmail');
  const consentEl  = document.getElementById('lmConsent');
  const msgEl      = document.getElementById('lmMsg');
  const btn        = document.getElementById('lmSubmitBtn');
  const form       = document.getElementById('leadMagnetForm');

  if (__rnLeadSubmitting) return false;

  const name  = (nameInput && nameInput.value || '').trim();
  const email = (emailInput && emailInput.value || '').trim().toLowerCase();
  const consent = !!(consentEl && consentEl.checked);

  if (msgEl) {
    msgEl.style.display = 'none';
    msgEl.textContent = '';
    msgEl.className = '';
    msgEl.removeAttribute('role');
  }

  if (!name || name.length < 2) {
    showMsg(msgEl, 'Please enter your full name.', true);
    if (nameInput) nameInput.focus();
    return false;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMsg(msgEl, 'Please enter a valid email address.', true);
    if (emailInput) emailInput.focus();
    return false;
  }
  if (consentEl && !consent) {
    showMsg(msgEl, 'Please confirm consent to receive the guide and related updates.', true);
    consentEl.focus();
    return false;
  }

  if (!btn || !form) return false;

  const original = btn.textContent;
  __rnLeadSubmitting = true;
  btn.textContent = 'Sending...';
  btn.disabled = true;
  btn.setAttribute('aria-busy', 'true');
  btn.style.opacity = '0.75';

  const utm = (function () {
    try {
      return new URLSearchParams(window.location.search).get('utm_source') || '';
    } catch (e) {
      return '';
    }
  })();

  const payload = {
    type: 'lead_magnet',
    customer_name: name,
    customer_email: email,
    consent: consent ? 'yes' : 'no',
    resource: '20 AI Prompts for Nigerian Businesses',
    pdf_url: PDF_URL,
    date: new Date().toISOString(),
    source: window.location.href,
    page: window.location.href,
    utm_source: utm
  };

  postToWebhook(payload)
    .then(function () {
      // no-cors responses are opaque — treat network acceptance as submitted,
      // and always offer instant PDF download as a reliable fallback.
      showLeadSuccess(form, name);
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'Lead Magnet',
          event_label: '20 AI Prompts',
          lead_type: 'ai_prompt_guide'
        });
      }
      if (typeof window.rnTrack === 'function') {
        window.rnTrack('generate_lead', { lead_type: 'ai_prompt_guide' });
      }
    })
    .catch(function () {
      showMsg(
        msgEl,
        'We could not reach the server. Download the guide below or WhatsApp +234 803 380 7856.',
        true
      );
      if (msgEl) {
        msgEl.innerHTML =
          'We could not complete the request. ' +
          '<a href="' + PDF_URL + '" target="_blank" rel="noopener">Download the PDF</a> ' +
          'or WhatsApp <a href="https://wa.me/2348033807856">+234 803 380 7856</a>.';
        msgEl.style.display = 'block';
        msgEl.style.color = '#EF4444';
      }
      btn.textContent = original;
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
      btn.style.opacity = '1';
      __rnLeadSubmitting = false;
    });

  return false;
}

function showLeadSuccess(form, name) {
  if (!form) return;
  const first = (name || '').split(' ')[0];
  form.innerHTML =
    '<div style="text-align:center;padding:8px 0;" role="status" aria-live="polite">' +
    '<div style="font-size:36px;margin-bottom:12px;" aria-hidden="true">✅</div>' +
    '<h3 style="color:#0A0F1E;font-size:18px;margin:0 0 8px;">Thank you' +
    (first ? ', ' + first : '') +
    '!</h3>' +
    '<p style="color:#64748b;font-size:14px;margin:0 0 16px;line-height:1.5;">' +
    'Your free guide is on its way by email. Check inbox and spam if needed.<br>' +
    'You can also download it instantly below.</p>' +
    '<a href="' + PDF_URL + '" target="_blank" rel="noopener" ' +
    'style="display:inline-block;background:#00C2FF;color:#0A0F1E;font-weight:700;' +
    'padding:12px 22px;border-radius:8px;text-decoration:none;font-size:14px;margin-bottom:12px;">' +
    'Download PDF Now →</a>' +
    '<p style="color:#64748b;font-size:13px;margin:16px 0 8px;">Want personalised AI support?</p>' +
    '<a href="' + CALENDLY_URL + '" target="_blank" rel="noopener" ' +
    'style="display:inline-block;border:1.5px solid #00C2FF;color:#00C2FF;font-weight:600;' +
    'padding:10px 18px;border-radius:8px;text-decoration:none;font-size:13px;">' +
    'Book a Free 30-min Call</a>' +
    '</div>';
  __rnLeadSubmitting = false;
}

/* ───────── Contact Form ───────── */
function initContactForm() {
  const form = document.querySelector('form.contact-form');
  if (!form) return;

  // Remove Formspree dependency – handle via Apps Script
  form.removeAttribute('action');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('.form-submit, button[type="submit"]');
    const first = (form.querySelector('[name="first_name"], #fname')?.value || '').trim();
    const last  = (form.querySelector('[name="last_name"], #lname')?.value || '').trim();
    const email = (form.querySelector('[name="email"], #email')?.value || '').trim().toLowerCase();
    const phone = (form.querySelector('[name="phone"], #phone')?.value || '').trim();
    const service = (form.querySelector('[name="service"], #service')?.value || '').trim();
    const message = (form.querySelector('[name="message"], #message')?.value || '').trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const original = btn ? btn.textContent : '';
    if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }

    postToWebhook({
      type: 'contact',
      first_name: first,
      last_name: last,
      email: email,
      phone: phone,
      service: service,
      message: message,
      date: new Date().toISOString(),
      source: window.location.href
    })
    .then(() => {
      if (btn) {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = '#22c55e';
        btn.style.color = '#fff';
      }
      form.reset();
      setTimeout(() => {
        if (btn) {
          btn.textContent = original || 'Send Message →';
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }
      }, 4000);
    })
    .catch(() => {
      if (btn) {
        btn.textContent = 'Error — Try Again';
        btn.disabled = false;
      }
    });
  });
}

/* ───────── Webinar Notify ───────── */
function notifyWebinar() {
  const emailInput = document.getElementById('webinarEmail');
  const msgEl = document.getElementById('webinarMsg');
  if (!emailInput) return;

  const email = emailInput.value.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (msgEl) {
    msgEl.style.display = 'block';
    msgEl.style.color = '#00F0FF';
    msgEl.textContent = 'Sending...';
  }

  postToWebhook({
    type: 'webinar',
    email: email,
    date: new Date().toISOString(),
    source: window.location.href
  })
  .then(() => {
    if (msgEl) {
      msgEl.textContent = "✅ You're on the list! We'll notify you when dates are confirmed.";
    }
    emailInput.value = '';
    setTimeout(() => { if (msgEl) msgEl.style.display = 'none'; }, 6000);
  })
  .catch(() => {
    if (msgEl) {
      msgEl.style.color = '#EF4444';
      msgEl.textContent = 'Something went wrong. WhatsApp +234 803 380 7856';
    }
  });
}

function showMsg(el, text, isError) {
  if (!el) return;
  el.style.display = 'block';
  el.textContent = text;
  el.style.color = isError ? '#EF4444' : '#00B4D8';
}

// Init
window.submitLeadMagnet = submitLeadMagnet;
window.notifyWebinar = notifyWebinar;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}

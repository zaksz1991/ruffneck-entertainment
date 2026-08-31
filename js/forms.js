/**
 * RuffNeck Entertainment – All Website Forms
 * Lead Magnet | Contact | Webinar Notify
 */

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycby0mX6rqzDHVPy1deNqpHAnBC_f0QRL5f0jL5Bdwxfo4e4AFDO2flbCkV8fjIoT-1w/exec';
const PDF_URL = 'https://ruffneck-entertainment.vercel.app/20_AI_Prompts_RuffNeck.pdf';
const CALENDLY_URL = 'https://calendly.com/hassanzakariyabiz/30min';

function postToWebhook(payload) {
  return fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload)
  });
}

/* ───────── Lead Magnet ───────── */
function submitLeadMagnet(event) {
  event.preventDefault();

  const nameInput  = document.getElementById('lmName');
  const emailInput = document.getElementById('lmEmail');
  const msgEl      = document.getElementById('lmMsg');
  const btn        = document.getElementById('lmSubmitBtn');
  const form       = document.getElementById('leadMagnetForm');

  const name  = (nameInput?.value || '').trim();
  const email = (emailInput?.value || '').trim().toLowerCase();

  if (msgEl) { msgEl.style.display = 'none'; msgEl.textContent = ''; }

  if (!name || name.length < 2) {
    showMsg(msgEl, 'Please enter your full name.', true);
    nameInput?.focus();
    return false;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMsg(msgEl, 'Please enter a valid email address.', true);
    emailInput?.focus();
    return false;
  }

  const original = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;
  btn.style.opacity = '0.75';

  postToWebhook({
    type: 'lead_magnet',
    customer_name: name,
    customer_email: email,
    resource: '20 AI Prompts for Nigerian Businesses',
    pdf_url: PDF_URL,
    date: new Date().toISOString(),
    source: window.location.href
  })
  .then(() => {
    showLeadSuccess(form, name);
    if (typeof gtag === 'function') {
      gtag('event', 'generate_lead', { event_category: 'Lead Magnet', event_label: '20 AI Prompts' });
    }
  })
  .catch(() => {
    showMsg(msgEl, 'Something went wrong. WhatsApp us: +234 803 380 7856', true);
    btn.textContent = original;
    btn.disabled = false;
    btn.style.opacity = '1';
  });

  return false;
}

function showLeadSuccess(form, name) {
  if (!form) return;
  const first = name.split(' ')[0];
  form.innerHTML =
    '<div style="text-align:center;padding:8px 0;">' +
    '<div style="font-size:36px;margin-bottom:12px;">✅</div>' +
    '<h3 style="color:#0A0F1E;font-size:18px;margin:0 0 8px;">Thank you' + (first ? ', ' + first : '') + '!</h3>' +
    '<p style="color:#64748b;font-size:14px;margin:0 0 16px;line-height:1.5;">Your free guide is on its way to your email.<br>Check inbox (and spam) if needed.</p>' +
    '<a href="' + PDF_URL + '" target="_blank" rel="noopener" style="display:inline-block;background:#00C2FF;color:#0A0F1E;font-weight:700;padding:12px 22px;border-radius:8px;text-decoration:none;font-size:14px;margin-bottom:12px;">Download PDF Now →</a>' +
    '<p style="color:#64748b;font-size:13px;margin:16px 0 8px;">Want personalised AI support?</p>' +
    '<a href="' + CALENDLY_URL + '" target="_blank" rel="noopener" style="display:inline-block;border:1.5px solid #00C2FF;color:#00C2FF;font-weight:600;padding:10px 18px;border-radius:8px;text-decoration:none;font-size:13px;">Book a Free 30-min Call</a>' +
    '</div>';
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

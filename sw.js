// RuffNeck Entertainment — Service Worker
// Provides offline access to previously-visited pages and static assets.
// Does NOT cache payment processing, form submissions, or chatbot responses —
// those always require a live internet connection.

const CACHE_NAME = 'ruffneck-cache-v1';

// Core files to cache immediately on install so the site works offline
// the very first time, even before a visitor has browsed around.
const PRECACHE_URLS = [
  '/',
  '/store',
  '/blog',
  '/manifest.json',
  '/favicon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png'
];

// ── INSTALL: pre-cache core pages ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ── ACTIVATE: clean up old cache versions ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// ── FETCH: network-first for pages, cache-first for static assets ──
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests — never intercept payment/API calls (POST etc.)
  if (req.method !== 'GET') return;

  // Never cache Flutterwave, Google Analytics, Apps Script webhook, or third-party calls —
  // these must always hit the live network for correctness and security.
  const url = new URL(req.url);
  const skipCaching = [
    'flutterwave.com',
    'google-analytics.com',
    'googletagmanager.com',
    'script.google.com',
    'hooks.zapier.com',
    'calendly.com'
  ].some((domain) => url.hostname.includes(domain));

  if (skipCaching) return; // let the browser handle it normally, no SW interference

  const isHTMLPage = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isHTMLPage) {
    // Network-first: try to get the freshest version; fall back to cache if offline
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match('/'))
        )
    );
  } else {
    // Cache-first for static assets (images, icons) — faster repeat loads
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        }).catch(() => cached);
      })
    );
  }
});

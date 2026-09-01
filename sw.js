// RuffNeck Entertainment — Service Worker (fixed)
// Skips /api/* so CMS calls cannot hang page loading.

const CACHE_NAME = 'ruffneck-v2026-09-01-noload';

const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(function(){})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never intercept APIs, analytics, payments, or third-party — browser handles these
  if (url.pathname.indexOf('/api/') === 0) return;
  const skip = [
    'flutterwave.com',
    'google-analytics.com',
    'googletagmanager.com',
    'script.google.com',
    'hooks.zapier.com',
    'calendly.com',
    'vercel-insights',
    'translate.google'
  ].some((domain) => url.hostname.includes(domain) || url.href.includes(domain));
  if (skip) return;

  const isHTMLPage = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isHTMLPage) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          try {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone)).catch(function(){});
          } catch (e) {}
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/')))
    );
  } else {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) => {
            try {
              const resClone = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone)).catch(function(){});
            } catch (e) {}
            return res;
          })
          .catch(() => cached);
      })
    );
  }
});

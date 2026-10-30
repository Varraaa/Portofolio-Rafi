/**
 * SERVICE WORKER - CACHING & OFFLINE CAPABILITY
 * M Rafi Hibatulloh Portfolio
 */

const CACHE_NAME = 'rafi-portfolio-v1';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'about.html',
  'projects.html',
  'certificate.html',
  'contact.html',
  'css/style.css',
  'css/variables.css',
  'css/animations.css',
  'js/main.js',
  'js/animations.js',
  'js/projects.js',
  'manifest.json',
  'assets/jas.jpeg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('PWA cache prefetch item missed:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        return networkResponse;
      }).catch(() => {
        if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
          return caches.match('index.html');
        }
      });
    })
  );
});


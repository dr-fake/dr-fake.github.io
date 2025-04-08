const CACHE_NAME = 'gyatmaster-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Include any additional assets that are part of your static template:
  // '/styles.css',
  // '/script.js'
];

// On install, cache the static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// On fetch, serve cached assets when available
self.addEventListener('fetch', event => {
  // We only want to intercept GET requests for same-origin assets.
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return the cached asset or fetch from network if not available.
        return response || fetch(event.request);
      })
  );
});

// On activate, clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

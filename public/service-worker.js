self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('unknown-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/icons/128.png',
        '/icons/256.png',
        '/icons/512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

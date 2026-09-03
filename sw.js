// Service Worker - Talya Martins Fotografia (PWA Offline Real)
const CACHE_NAME = 'talya-fotografia-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './talya-perfil.jpg',
  './hero-talya.jpg',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('PWA: Cacheando arquivos do site para modo offline...');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.warn('Cache parcial:', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => {
        if (k !== CACHE_NAME) return caches.delete(k);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          if (event.request.method === 'GET' && event.request.url.startsWith('http')) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});

const STATIC_CACHE_NAME = 'budget-tracker-static-cache-v1';
const STATIC_CACHE_ASSETS = [
    '/',
    'index.html',
    'manifest.json',
    'index.js',
    'styles.css',
    'icons/icon-192x192.png',
    'icons/icon-512x512.png'
];

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => cache.addAll(STATIC_CACHE_ASSETS))
            .then(() => self.skipWaiting())
            .then(() => console.log('Service worker successfully installed'))
            .catch((err) => console.log('Something went wrong with installing service worker:', err))
    );
});

const STATIC_CACHE_NAME = 'budget-tracker-static-cache-v1';
const RUNTIME_CACHE_NAME = 'budget-tracker-runtime-cache-v1';
const STATIC_CACHE_ASSETS = [
    '/',
    'index.html',
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

self.addEventListener('activate', evt => {
    const currentCaches = [STATIC_CACHE_NAME, RUNTIME_CACHE_NAME];
    evt.waitUntil(
        caches.keys()
            .then(cacheNames =>
                cacheNames.filter(
                    cacheName => !currentCaches.includes(cacheName)
                )
            )
            .then(cachesToDelete =>
                Promise.all(
                    cachesToDelete.map(cacheToDelete =>
                        caches.delete(cacheToDelete)
                    )
                )
            )
            .then(() => self.clients.claim())
            .then(() => console.log('Service worker successfully activated'))
            .catch(err => console.log("Something went wrong with activating the service worker:", err))
    );
});

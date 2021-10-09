const STATIC_CACHE_NAME = 'budget-tracker-static-cache-v1';
const RUNTIME_CACHE_NAME = 'budget-tracker-runtime-cache-v1';
const STATIC_CACHE_ASSETS = [
    '/',
    'index.html',
    'index.js',
    'styles.css',
    'icons/icon-192x192.png',
    'icons/icon-512x512.png',
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js@2.8.0'
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

self.addEventListener("fetch", evt => {
    if (evt.request.method !== "GET") {
        evt.respondWith(fetch(evt.request));
        return;
    }

    if (evt.request.url.includes('/api/transaction')) {
        evt.respondWith(
            caches.open(RUNTIME_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                    .then(response => {
                        cache.put(evt.request, response.clone());
                        return response;
                    })
                    // Offline behavior
                    .catch(() => caches.match(evt.request));
            })
        );
        return;
    }

    evt.respondWith(
        caches.match(evt.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse
                }



                return caches.open(RUNTIME_CACHE_NAME)
                    .then(cache =>
                        fetch(evt.request).then(response =>
                            cache.put(evt.request, response.clone()).then(() =>
                                response
                            )
                        )
                    );
            })
    );
});

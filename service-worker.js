const CACHE_NAME = 'v1';
const urlsToCache = [
    '/',
    '/index.html',
	'/index',
	'/index1',
    '/index.css',
    '/game.js',
	'/favicon/site.webmanifest',
	'/img/flag.svg.raw',
	'/img/spritesheet4-.json',
	'/img/spritesheet4-4.json',
	'/img/spritesheet4-3.json',
	'/ndata',
	'/img/spritesheet4-2.json'
	
];

// Service Worker'ı kurma ve önbelleğe alma
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Önbellek açıldı');
                return cache.addAll(urlsToCache);
            })
            .catch(function(error) {
                console.error('Önbelleğe alma hatası:', error);
            })
    );
});

// Ağ isteklerini yakalama ve önbellekten cevap verme
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(function() {
                    console.error('Ağ isteği hatası:', event.request.url);
                });
            })
    );
});

// Eski önbelleği temizleme
self.addEventListener('activate', function(event) {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
const CACHE_NAME = 'version-1';
const urlsToCache = ['index.html', 'offline.html'];
const self = this;

//Install SW
self.addEventListener('install', (e)=> {
    console.log('Service worker: installed')
    self.skipWaiting();
     e.waitUntil(
         caches.open(CACHE_NAME)
         .then(cache => {
             console.log('Service worker: Caching files');
             return cache.addAll(urlsToCache);
         })
     )
})
//Listen for req.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request) 
                    .catch(() => caches.match('offline.html'))
            })
    )
});
//Activate service worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
            
    )
});
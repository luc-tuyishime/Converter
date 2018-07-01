var cacheName = "v2"
var cacheFiles = [
    "./",
    "./index.html",
    "./style.css",
    "./jquery.min.js",
    "./bootstrap.min.js",
    "./bootstrap.min.css",
    "./script.js"
]

self.addEventListener("install", function(e) {
    console.log("[ServiceWorker] Installed")

    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log("[serviceWorker] Caching cacheFiles")
            return cache.addAll(cacheFiles)
        })
    )
})

self.addEventListener("activate", function(e) {
    console.log("[ServiceWorker] Activated")

    e.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(thisCacheName) {
                if (thisCacheName !== cacheName) {
                    console.log("[ServiceWorker] Removing Cached file from the v1", thisCacheName)
                    return caches.delete(thisCacheName)
                }
            }))
        })
    )
})

self.addEventListener("fetch", function(e) {
    console.log("[ServiceWorker] fetching", e.request.url)

    e.respondWith(
        caches.match(e.request).then(function(response) {

            if (response) {

                console.log("[service worker] found in cache", e.request.url);
                return response;
            }

            var requestClone = e.request.clone();

            fetch(requestClone).then(function(response) {
                if (!response) {
                    console.log("[service worker] no response from fetch");
                    return response;
                }

                var responseClone = response.clone();
                caches.open(cacheName).then(function(cache) {
                    console.log("[ServiceWorker] new data new", e.request.url);
                    cache.put(e.request, responseClone);
                    return response;
                })
            }).catch(function(err) {
                console.log("[ServiceWorker] Error fetching & Caching");
            });

        })

    )
})
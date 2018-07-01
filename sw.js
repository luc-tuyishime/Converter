const cacheName = "v2";
const cacheFiles = [
    "./",
    "./index.html",
    "./style.css",
    "./jquery.min.js",
    "./bootstrap.min.js",
    "./bootstrap.min.css",
    "./script.js"
];

self.addEventListener("install", e => {
    console.log("[ServiceWorker] Installed");

    e.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log("[serviceWorker] Caching cacheFiles");
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener("activate", e => {
    console.log("[ServiceWorker] Activated");

    e.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(thisCacheName => {
                    if (thisCacheName !== cacheName) {
                        console.log(
                            "[ServiceWorker] Removing Cached file from the v1",
                            thisCacheName
                        );
                        return caches.delete(thisCacheName);
                    }
                })
            )
        )
    );
});

self.addEventListener("fetch", e => {
    console.log("[ServiceWorker] fetching", e.request.url);

    e.respondWith(
        caches.match(e.request).then(response => {
            if (response) {
                console.log("[service worker] found in cache", e.request.url);
                return response;
            }

            const requestClone = e.request.clone();

            fetch(requestClone)
                .then(response => {
                    if (!response) {
                        console.log("[service worker] no response from fetch");
                        return response;
                    }

                    const responseClone = response.clone();
                    caches.open(cacheName).then(cache => {
                        console.log("[ServiceWorker] new data new", e.request.url);
                        cache.put(e.request, responseClone);
                        return response;
                    });
                })
                .catch(err => {
                    console.log("[ServiceWorker] Error fetching & Caching");
                });
        })
    );
});
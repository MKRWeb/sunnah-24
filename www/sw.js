const CACHE_NAME = "sunnah-24-cache-v8-v4.3-modular";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./data/i18n-data.js",
  "./data/habits-duas-data.js",
  "./data/locations-data.js",
  "./storage.js",
  "./astronomy.js",
  "./ui.js",
  "./s24_apk_ota_manager.js",
  "./icon.svg",
  "./manifest.json",
  "./privacy.html"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn("Skipped caching optional asset:", asset, err);
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  if (e.request.mode === "navigate" || (e.request.headers.get("accept") || "").includes("text/html")) {
    e.respondWith(
      fetch(e.request)
        .then((networkRes) => {
          const copy = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy)).catch(() => {});
          return networkRes;
        })
        .catch(() =>
          caches.match(e.request, { ignoreSearch: true }).then(
            (cached) => cached || caches.match("./index.html", { ignoreSearch: true })
          )
        )
    );
    return;
  }

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((cached) => {
      const fetchPromise = fetch(e.request)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200 && networkRes.type === "basic") {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy)).catch(() => {});
          }
          return networkRes;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});


// const CACHE_NAME = "lumina-ai-v1";

// const urlsToCache = [
//   "/",
//   "/index.html",
// ];

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
//   );
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });

const CACHE_NAME = "lumina-ai-v3";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/whisper-flow-logo.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener("activate", (event) => {
  self.clients.claim();

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Never cache API requests
  if (
    event.request.url.includes("/api/") ||
    event.request.url.includes("/chat")
  ) {
    return;
  }

  // -----------------------------
  // HTML Pages (Network First)
  // -----------------------------
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put("/", clone);
            });
          }

          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match("/");

          if (cachedPage) {
            return cachedPage;
          }

          return new Response(
            "<h1>Offline</h1><p>Please connect to the internet once.</p>",
            {
              headers: {
                "Content-Type": "text/html",
              },
            }
          );
        })
    );

    return;
  }

  // -----------------------------
  // JS, CSS, Images, Fonts
  // Cache First
  // -----------------------------
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }

          return networkResponse;
        })
        .catch(() => {
          if (event.request.destination === "image") {
            return caches.match("/whisper-flow-logo.png");
          }

          return new Response("", {
            status: 404,
            statusText: "Not Found",
          });
        });
    })
  );
});
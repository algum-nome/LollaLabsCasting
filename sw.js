const CACHE = "lolla-v2"; // MUDE SEMPRE A VERSÃO

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  // NÃO CACHE FIREBASE
  if (e.request.url.includes("firebasestorage") || 
      e.request.url.includes("googleapis")) {
    return;
  }

  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

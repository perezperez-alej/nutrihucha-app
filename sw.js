// Service worker de La NutriHucha (cargador versión 2).
// Guarda el cargador y las fuentes para abrir al instante y sin conexión. La app (app.json) y
// version.json van siempre a la red: el cargador ya guarda la app descifrada en el móvil.
const CACHE = 'nutrihucha-cargador-2';
const BASICOS = ['./', 'index.html', 'manifest.webmanifest', 'iconos/icono-192.png', 'iconos/icono-512.png', 'iconos/icono-maskable.png'];

self.addEventListener('install', function (ev) {
  ev.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(BASICOS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (ev) {
  ev.waitUntil(caches.keys().then(function (claves) {
    return Promise.all(claves.filter(function (k) { return k.indexOf('nutrihucha-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (ev) {
  const url = new URL(ev.request.url);
  if (ev.request.method !== 'GET') return;
  // La API, la app cifrada y la versión: siempre a la red.
  if (url.origin === self.location.origin && /\/(app|version)\.json$/.test(url.pathname)) return;
  if (url.hostname === 'script.google.com' || url.hostname.endsWith('googleusercontent.com')) return;
  // Fuentes de Google: de la caché si están, y se guardan la primera vez.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    ev.respondWith(caches.open(CACHE).then(function (c) {
      return c.match(ev.request).then(function (r) {
        return r || fetch(ev.request).then(function (resp) { c.put(ev.request, resp.clone()); return resp; });
      });
    }));
    return;
  }
  // El cargador: primero la red (para no quedarse con uno viejo) y, sin conexión, la copia guardada.
  if (url.origin === self.location.origin) {
    ev.respondWith(caches.open(CACHE).then(function (c) {
      return fetch(ev.request).then(function (resp) {
        if (resp.ok) c.put(ev.request, resp.clone());
        return resp;
      }).catch(function () {
        return c.match(ev.request, { ignoreSearch: true }).then(function (r) { return r || c.match('index.html'); });
      });
    }));
  }
});

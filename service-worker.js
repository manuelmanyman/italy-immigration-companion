importScripts('./version.js');

const APP_VERSION = self.__IIC_VERSION__?.appVersion || 'dev';
const BUILD_TIMESTAMP = self.__IIC_VERSION__?.buildTimestamp || '';
const CACHE_PREFIX = 'iic-';
const APP_SHELL_CACHE = `${CACHE_PREFIX}app-shell-${APP_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}runtime-${APP_VERSION}`;
const CURRENT_CACHES = new Set([APP_SHELL_CACHE, RUNTIME_CACHE]);
const STATIC_ASSET_DESTINATIONS = new Set(['script', 'style', 'worker', 'manifest', 'image', 'font']);
const VERSIONED_ASSETS = [
  './styles.css',
  './app.js',
  './manifest.json',
  './locales/en.json',
  './locales/it.json',
  './locales/de.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
].map((path) => `${path}?v=${encodeURIComponent(APP_VERSION)}`);
const APP_SHELL = ['./', './index.html', './version.js', ...VERSIONED_ASSETS];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith(CACHE_PREFIX) && !CURRENT_CACHES.has(key))
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (event.data?.type === 'GET_VERSION' && event.ports[0]) {
    event.ports[0].postMessage({
      version: APP_VERSION,
      buildTimestamp: BUILD_TIMESTAMP,
      appShellCache: APP_SHELL_CACHE,
      runtimeCache: RUNTIME_CACHE
    });
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (isNavigationRequest(event.request)) {
    event.respondWith(handleNavigationRequest(event.request));
    return;
  }

  if (isStaticAssetRequest(event.request)) {
    event.respondWith(handleStaticAssetRequest(event.request, event));
    return;
  }

  event.respondWith(handleRuntimeRequest(event.request));
});

function isNavigationRequest(request) {
  if (request.mode === 'navigate') return true;
  const accept = request.headers.get('accept') || '';
  return request.destination === 'document' || accept.includes('text/html');
}

function isStaticAssetRequest(request) {
  const url = new URL(request.url);
  const scopePath = new URL(self.registration.scope).pathname;
  return STATIC_ASSET_DESTINATIONS.has(request.destination) || url.pathname.startsWith(`${scopePath}locales/`);
}

async function handleNavigationRequest(request) {
  const cache = await caches.open(APP_SHELL_CACHE);

  try {
    const networkRequest = new Request(request, { cache: 'no-store' });
    const response = await fetch(networkRequest);
    if (response && response.ok) {
      const clone = response.clone();
      await Promise.allSettled([
        cache.put(request, clone.clone()),
        cache.put('./index.html', clone)
      ]);
    }
    return response;
  } catch {
    return (await cache.match(request)) || (await cache.match('./index.html')) || Response.error();
  }
}

async function handleStaticAssetRequest(request, event) {
  const cache = await caches.open(APP_SHELL_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    if (!isVersionedRequest(request)) {
      event.waitUntil(fetchAndCache(request, cache).catch(() => {}));
    }
    return cached;
  }

  try {
    return await fetchAndCache(request, cache);
  } catch {
    return Response.error();
  }
}

async function handleRuntimeRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    return await fetchAndCache(request, cache);
  } catch {
    return (await cache.match(request)) || Response.error();
  }
}

async function fetchAndCache(request, cache) {
  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone()).catch(() => {});
  }
  return response;
}

function isVersionedRequest(request) {
  return new URL(request.url).searchParams.has('v');
}

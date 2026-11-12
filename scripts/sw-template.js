/* DayQuest service worker. Generated at build time by scripts/generate-sw.mjs — do not edit out/sw.js. */
/* eslint-disable */
const VERSION = "__VERSION__";
const CACHE = "dayquest-" + VERSION;
const PRECACHE = __PRECACHE__;
const OFFLINE_URL = "/offline/index.html";

// Install: download the whole static app so it works offline from now on.
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(PRECACHE.map((url) => new Request(url, { cache: "reload" })));
      await self.skipWaiting();
    })(),
  );
});

// Activate: remove caches from older versions and take control of open pages.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith("dayquest-") && k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

// Map a URL to the exported file that serves it (static export uses trailing slashes).
function candidates(url) {
  const path = url.pathname;
  if (path.endsWith("/")) return [path + "index.html"];
  if (/\.[a-z0-9]+$/i.test(path)) return [path];
  return [path + "/index.html", path + ".html", path];
}

// Fetch: cache first (everything is versioned per build), then network, then offline page.
// HEAD is handled too: the Next.js router sends HEAD requests for links.
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" && request.method !== "HEAD") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const head = request.method === "HEAD";

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      for (const candidate of candidates(url)) {
        const hit = await cache.match(candidate);
        if (hit) return head ? new Response(null, { status: hit.status, headers: hit.headers }) : hit;
      }
      try {
        const response = await fetch(request);
        if (!head && response.ok && response.type === "basic") cache.put(request, response.clone());
        return response;
      } catch (error) {
        if (request.mode === "navigate") {
          const offline = await cache.match(OFFLINE_URL);
          if (offline) return offline;
        }
        return Response.error();
      }
    })(),
  );
});

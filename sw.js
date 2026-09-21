const CACHE='dhplay-v1.1.5';
const ASSETS=['./','./index.html','./styles.css?v=1.1.5','./responsive.css?v=1.1.5','./reports.css','./updates.css?v=1.1.5','./app.js?v=1.1.5','./offline-db.js?v=1.1.5','./update-checker.js?v=1.1.5','./version.json','./supabase-config.js?v=1.1.5','./manifest.webmanifest','./icon-192.png','./icon-512.png','./dhplay-banner-v2.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));});

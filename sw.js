const CACHE='dhplay-v1.1.8';
const ASSETS=['./','./index.html','./styles.css?v=1.1.8','./responsive.css?v=1.1.8','./reports.css','./updates.css?v=1.1.8','./app.js?v=1.1.8','./offline-db.js?v=1.1.8','./update-checker.js?v=1.1.8','./version.json','./supabase-config.js?v=1.1.8','./manifest.webmanifest?v=1.1.8','./icon-192.png?v=1.1.8','./icon-512.png?v=1.1.8','./icon-maskable-512.png?v=1.1.8','./dhplay-banner-v3.webp?v=1.1.8'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));});

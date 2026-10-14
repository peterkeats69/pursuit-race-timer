const CACHE='pursuit-race-timer-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const names=await caches.keys();await Promise.all(names.filter(n=>n.startsWith('pursuit-race-timer-')&&n!==CACHE).map(n=>caches.delete(n)));await self.clients.claim()})())});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 const url=new URL(req.url);
 if(!url.pathname.startsWith(new URL('./',self.registration.scope).pathname))return;
 if(req.mode==='navigate'){
   event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match('./index.html')||await cache.match('./')||fetch(req)})());
   return;
 }
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
});

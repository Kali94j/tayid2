const C="tayid-v4",A=["./","./index.html","./style.css","./app.js","./manifest.json","./icon-192.png","./icon-512.png","./login-bg.jpg","./logo.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>Promise.all(A.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(r.method!=="GET"||(u.origin!==location.origin&&u.hostname!=="www.gstatic.com"))return;
e.respondWith(fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(C).then(c=>c.put(r,y))}return x}).catch(()=>caches.match(r).then(m=>m||caches.match("./index.html"))))});

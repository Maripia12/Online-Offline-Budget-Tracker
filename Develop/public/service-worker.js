const FILES_TO_CACHE = [
  "/",
  "/db.js",
  "/index.js",
  "/manifest.json",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

let PRE_CACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRE_CACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith("/api/")) {
    event.respondWith(
        caches.open(RUNTIME).then(cache =>{
            return fetch(event.request).then(response =>{
                if (response.status === 200){
                    cache.put(event.request.url, response.clone)
                }
                return response
            }).catch(err =>{
                return cache.match(event.request);
            })
        }).catch(err => console.log(err))
    );
    return
  };

  event.respondWith(fetch(event.request).catch(()=>{
      return caches.match(event.request).then((response)=>{
          if (response){
              return response
          } else if(event.request.header.get("accept").includes("text/html")){
              return caches.match("/")
          }
      })
    })
  );

});

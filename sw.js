const CACHE = 'v1',
    URLS = [
        'https://nirav-chotaliya.github.io/',
        'https://nirav-chotaliya.github.io/index.html',
        'https://nirav-chotaliya.github.io/app.js',
        'https://nirav-chotaliya.github.io/images/image.png'
    ],
    PIXEL_IMAGE = '/images/image.png'

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(URLS).then(self.skipWaiting());
    })
  );
});

self.addEventListener('fetch', function(event) {
  event
    .respondWith(caches.match(event.request)
    .then(response => {
        if(event.request.url.includes(PIXEL_IMAGE) && 
            !event.request.url.includes('timestamp')) {

            let arr =  event.request.url.split("?"),
                query = arr.length > 0 ? arr[1] : ''

            if(query.length === 0) {
                return
            }

            let translatedQuery = getTranslatedQuery(query),
                newRequest = new Request(arr[0] + '?' + translatedQuery)

            return fetch(newRequest).then(response => {
                let c = response.clone()  
                caches.open(CACHE).then(cache => {
                    cache.put(event.request, c);
                })
                return response
            }).catch(e => {
                console.log("Getting error :: ", e)
            });

        } else if (response !== undefined) {
            return response
        }

  }));

});

const getMappings = _ => {
    let mappings = new Map()

    mappings.set('interaction', 'event')
    mappings.set('client', 'customer')
    mappings.set('os_name', 'operating_system_name')
    mappings.set('x1', 'utm_source')
    mappings.set('x2', 'utm_medium')
    mappings.set('x3', 'utm_campaign')
    mappings.set('landing_url', 'campaign_url')

    return mappings
}

const getTranslatedQuery = query => {

    for (let [oldKey, newKey] of getMappings()) {
        query = query.replace(oldKey, newKey)
    }

    query = query + '&timestamp=' + (Date.now())
    return query
}
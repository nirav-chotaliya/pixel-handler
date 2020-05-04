// register service worker
if ('serviceWorker' in navigator) {
    navigator
        .serviceWorker
        .register('sw.js')
        .then(reg => console.log('SW registered!', reg))
        .catch(function(error) {
            console.log('Registration failed with ' + error);
        });
}

const PIXEL_IMAGE_URL = 'images/image.png?interaction=UserClick&client=ad_media&os_name=macos&x1=google&x2=email&x3=pdfconvert&landing_url=abcd1'

const firePixelImages = _ => {
    for(let i=0; i<=10; i++) {
        fetchResource(PIXEL_IMAGE_URL)
    }
}

const fetchResource = url => {
    fetch(url)
        .then(res => res.blob())
        .then(render)
        .catch(e => console.log("Got error : ", e))
}

const render = blob => {
    let container = document.getElementById('pixel-container'),
        img = document.createElement('img')

    container.appendChild(img)
    var url = URL.createObjectURL(blob)
    img.src = url;
}
  

window.onload = function() {
    firePixelImages()
}
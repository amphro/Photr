/**
 * Init the photr viewers for index.html
 */
(function(global) {

    function getImages() {
        var images = [];

        for (var i = 0; i < 10; i++) {
            var imageName = 'testImg' + i;
            images.push(new Image(imageName, imageName));
        }

        return images;
    }

    function viewFlickrImages(photoSetId) {
        var spinner = document.createElement('div');
        spinner.setAttribute('class', 'spinner');

        spinner.innerHTML =
            '<div class="rect1"></div>' +
            '<div class="rect2"></div>' +
            '<div class="rect3"></div>' +
            '<div class="rect4"></div>' +
            '<div class="rect5"></div>';

        var lightBox = new LightBox(spinner, 70, 110);

        var req = new XMLHttpRequest();
        req.addEventListener('readystatechange', function() {
            if (req.readyState === 4) {
                var json = JSON.parse(req.responseText);

                if (!json || !json.photoset || !json.photoset.photo) {
                    throw new Error('Not photos found: ' + JSON.stringify(json));
                }

                var photos = json.photoset.photo;
                var images = [];

                for (var i = 0, size = photos.length; i < size; i++) {
                    var photo = photos[i];
                    images.push(new Image(photo.title, photo.url_m, photo.height_m, photo.width_m));
                }

                var viewer = new PhotrViewer(null, images);
                lightBox.replace(viewer.ele, 350, 500);
            }
        });
        req.open('GET', '/flickrPhotos?photosetId=' + photoSetId);
        req.send();
    }

    global.addEventListener('load', function() {
        getById("viewFlickrPhotoset").addEventListener('click', function() {
            var photoSetId = getById("flickrPhotosetId").value;
            viewFlickrImages(photoSetId);
        });
    });
})(window);

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

    /**
     * Set a loading spinner in a new lightbox
     */
    function loading() {
        var spinner = document.createElement('div');
        spinner.setAttribute('class', 'spinner');

        spinner.innerHTML =
        '<div class="rect1"></div>' +
        '<div class="rect2"></div>' +
        '<div class="rect3"></div>' +
        '<div class="rect4"></div>' +
        '<div class="rect5"></div>';

        return new LightBox(spinner, 70, 110);
    }

    function get(url, callback) {
        var req = new XMLHttpRequest();
        req.addEventListener('readystatechange', function() {
            if (req.readyState === 4) {
                var json = JSON.parse(req.responseText);
                callback(json);
            }
        });
        req.open('GET', url);
        req.send();
    }

    function setError(lightBox, error) {
        var title = document.createElement('div');
        title.setAttribute('class', 'error');
        title.innerText = error;
        lightBox.replace(title, 70, 400);
    }

    function viewFlickrImages(photoSetId) {
        var lightBox = loading();

        get('/flickrPhotos?photosetId=' + photoSetId, function(json) {
            if (!json || !json.photoset || !json.photoset.photo) {
                console.debug('No photos found: ' + JSON.stringify(json));
                setError(lightBox, json.message || 'Error retrieving photos');
                return;
            }

            var photos = json.photoset.photo;
            var images = [];

            for (var i = 0, size = photos.length; i < size; i++) {
                var photo = photos[i];
                images.push(new Image(photo.title, photo.url_m, photo.height_m, photo.width_m));
            }

            var viewer = new PhotrViewer(null, images);
            lightBox.replace(viewer.ele, 350, 500);
        });
    }

    function searchGoogleImages(searchTerm) {
        var lightBox = loading();

        function resizeImg(width, height) {
            if (width > 500 || height > 300) {
                return resizeImg(Math.floor(width / 2), Math.floor(height / 2));
            }
            return { width: width, height: height };
        }

        get('/searchGoogleImages?searchString=' + searchTerm, function(json) {
            console.log(json);
            if (json.error) {
                setError(json.error.message);
                return;
            }
            if (!json.items) {
                setError('Error getting images. Please try again.');
                return;
            }
            if (json.items.length === 0) {
                setError('No images found.');
                return;
            }

            var photos = json.items;
            var images = [];
            var maxHeight = 0, maxWidth = 0;
            for (var i = 0, size = photos.length; i < size; i++) {
                var photo = photos[i];
                var newSize = resizeImg(photo.image.width, photo.image.height);
                maxHeight = maxHeight < newSize.height ? newSize.height : maxHeight;
                maxWidth = maxWidth < newSize.width ? newSize.width : maxWidth;
                images.push(new Image(photo.title, photo.link, newSize.height, newSize.width));
            }

            var viewer = new PhotrViewer(null, images);
            lightBox.replace(viewer.ele, maxHeight, maxWidth);
        });
    }

    global.addEventListener('load', function() {
        getById("viewFlickrPhotoset").addEventListener('click', function() {
            var photoSetId = getById("flickrPhotosetId").value;
            viewFlickrImages(photoSetId);
        });

        getById("viewGoogleResults").addEventListener('click', function() {
            var searchTerm = getById("googleSearchTerm").value;
            searchGoogleImages(searchTerm);
        });
    });
})(window);

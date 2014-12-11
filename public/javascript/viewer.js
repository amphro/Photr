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

    global.addEventListener('load', function() {
        var viewer = new PhotrViewer(getById('yahooImageSearch'), getImages());

    });
})(window);

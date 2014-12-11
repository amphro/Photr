(function(global) {
    /**
    * Helper method to get an element from the dom by ID
    */
    function getById(id) {
        return global.document.getElementById(id);
    }

    /**
    * Represents an image that may or may not be rendered to the dom
    */
    function Image(name, src) {
        this.name = name;
        this.src = src;
    }

    /**
    * Create a dom element and append as a child of srcEle
    */
    Image.prototype.renderTo = function(srcEle) {
        if (!this.element) {
            this.element = document.createElement('img');
            this.element.setAttribute('src', this.src);
            this.element.setAttribute('class', 'tile');
            this.element.setAttribute('alt', this.name);
            this.element.setAttribute('title', this.name);
        }
        srcEle.appendChild(this.element);
    };

    /**
     * Remove the image element from the dom and memory
     */
    Image.prototype.destroy = function() {
        this.element.parentNode.removeChild(this.element);
        delete this.element;
    };

    function getImages() {
        var images = [];

        for (var i = 0; i < 10; i++) {
            var imageName = 'testImg' + i;
            images.push(new Image(imageName, imageName));
        }

        return images;
    }

    global.addEventListener('load', function() {
        var viewer = getById('imageContainer'),
            images = getImages(),
            index = 0;

        // No need to do anything if there are no images
        if (images.length > 0) {
            // Start with the first image
            images[0].renderTo(viewer);

            var prev = getById('prev'),
                next = getById('next');

            prev.removeAttribute('disabled')
            next.removeAttribute('disabled')

            prev.addEventListener('click', function onPrev() {
                // Is there a previous image?
                if (index > 0) {
                    images[index].destroy();
                    images[--index].renderTo(viewer);
                }
            });

            next.addEventListener('click', function onNext() {
                // Is there a next image?
                if (index < images.length - 1) {
                    images[index].destroy();
                    images[++index].renderTo(viewer);
                }
            });
        }


    });
})(window);

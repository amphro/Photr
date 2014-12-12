/**
* A photr button
*/
function Button(ele, name, className, clickHandler) {
    this.button = document.createElement('button');
    this.button.setAttribute('class', className);
    this.button.innerText = name;
    //Disabled by default
    this.disable();
    this.button.addEventListener('click', clickHandler);

    ele.appendChild(this.button);
}

Button.prototype.enable = function() {
    this.button.removeAttribute('disabled');
}

Button.prototype.disable = function() {
    this.button.setAttribute('disabled', true);
}

/**
 * Represents an photr viewer, which is a collection of
 * images and a way to cycle through them.
 */
function PhotrViewer(ele, images) {
    if (!ele || !ele.tagName || !ele.tagName.match(/^div$/i)) {
        //throw new Error('Need a div element to create a photr viewer');
        ele = document.createElement('div');
    }

    this.ele = ele;
    this.ele.setAttribute('class', 'photrViewer');

    this.images = images;

    this.imageContainer = document.createElement('div');
    this.imageContainer.setAttribute('class', 'imageContainer');

    this.prevButton = new Button(this.ele, '<', 'left', this.previous.bind(this));
    this.ele.appendChild(this.imageContainer);
    this.nextButton = new Button(this.ele, '>', 'right', this.next.bind(this));

    this.currentImageIndex = 0;

    // No need to do anything if there are no images
    if (this.images.length > 0) {
        // Start with the first image
        this.images[0].renderTo(this.imageContainer);
        this.updateNavigationButtons();
    }
}

/**
 * Update the next and previous buttons based on the current index
 */
PhotrViewer.prototype.updateNavigationButtons = function() {
    this.hasPrevious() ? this.prevButton.enable() : this.prevButton.disable();
    this.hasNext() ? this.nextButton.enable() : this.nextButton.disable();
}

/**
 * Returns true if this viewer has a previous image to display
 */
PhotrViewer.prototype.hasPrevious = function() {
    return this.currentImageIndex > 0;
};

/**
 * Display the previous image, disable the previous button
 * if there is not another previous, and enable next if there
 * is a next image.
 */
PhotrViewer.prototype.previous = function() {
    if (this.hasPrevious()) {
        this.images[this.currentImageIndex].destroy();
        this.images[--this.currentImageIndex].renderTo(this.imageContainer);
    }

    // Now that we moved the index, update the buttons...
    this.updateNavigationButtons();
};

/**
* Returns true if this viewer has a next image to display
*/
PhotrViewer.prototype.hasNext = function() {
    return this.currentImageIndex < this.images.length - 1;
};

/**
 * Display the next image, disable the next button
 * if there is not another next, and enable previous if there
 * is a previous image.
 */
PhotrViewer.prototype.next = function() {
    if (this.hasNext()) {
        this.images[this.currentImageIndex].destroy();
        this.images[++this.currentImageIndex].renderTo(this.imageContainer);
    }

    // Now that we moved the index, update the buttons...
    this.updateNavigationButtons();
};

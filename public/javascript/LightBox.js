/**
 * A lightbox that can take any content. The consumer must pass in the
 * height and width so we can properly center the div in the screen.
 */
function LightBox(content, height, width) {
    this.glass = document.createElement('div');
    this.glass.setAttribute('class', 'glass');

    this.box = document.createElement('div');
    this.box.setAttribute('class', 'light-box');

    this.closeButton = document.createElement('div');
    this.closeButton.setAttribute('class', 'close');
    this.closeButton.innerText = 'X';
    this.closeButton.addEventListener('click', this.destroy.bind(this));

    if (typeof content.renderTo === 'function') {
        content.renderTo(this.box);
    } else {
        this.replace(content, height, width);
    }

    this.glass.appendChild(this.box);
    document.body.appendChild(this.glass);
    document.addEventListener('keydown', this.handleKey.bind(this));
}

/**
 * Replace the content in the lightbox. This first removes all child elements
 * of the lightbox then adds the new content.
 */
LightBox.prototype.replace = function(newContent, height, width) {
    var children = this.box.children;
    for (var i = children.length - 1; i >= 0; i--) {
        this.box.removeChild(children[i]);
    }
    this.box.appendChild(newContent);
    this.box.appendChild(this.closeButton);

    // We can't do this in CSS unless we know the height and width before hand.
    // Since we want to allow a light box with any size, make the caller pass it in.
    this.box.setAttribute('style',
        (height?'margin-top:-'+Math.floor(height/2)+'px;':'') +
        (width?'margin-left:-'+Math.floor(width/2)+'px;':''));
};

/**
 * Allow the box to close using the keyboard
 */
LightBox.prototype.handleKey = function(event) {
    var keyCode = event.keyCode || event.charCode || event.which;

    if (keyCode === /*Escape*/27 || keyCode === /*x*/88) {
        this.destroy();
    }
};


/**
 * Remove the lightbox from the dom and the event handler from the document
 */
LightBox.prototype.destroy = function() {
    document.removeEventListener(this.handelKey);
    document.body.removeChild(this.glass);
};

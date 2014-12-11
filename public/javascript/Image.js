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

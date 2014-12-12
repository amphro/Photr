/**
 * Represents an image that may or may not be rendered to the dom
 */
function Image(name, src, height, width) {
    this.name = name;
    this.src = src;
    this.height = height;
    this.width = width;
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

        if (this.height) {
            this.element.setAttribute('height', this.height);
        }

        if (this.width) {
            this.element.setAttribute('width', this.width);
        }
    }
    if (!this.nameElement) {
        this.nameElement = document.createElement('div');
        this.nameElement.innerText = this.name;
    }
    srcEle.appendChild(this.element);
    srcEle.appendChild(this.nameElement);
};

/**
 * Remove the image element from the dom and memory
 */
Image.prototype.destroy = function() {
    this.element.parentNode.removeChild(this.element);
    this.nameElement.parentNode.removeChild(this.nameElement);
    delete this.element;
    delete this.nameElement;
};

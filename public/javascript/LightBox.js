
function LightBox(content) {
    this.glass = document.createElement('div');
    this.glass.setAttribute('class', 'glass');

    this.box = document.createElement('div');
    this.box.setAttribute('class', 'light-box');

    if (typeof content.renderTo === 'function') {
        content.renderTo(this.box);
    } else {
        this.box.appendChild(content);
    }

    this.closeButton = document.createElement('div');
    this.closeButton.setAttribute('class', 'close');
    this.closeButton.innerText = 'X';
    this.closeButton.addEventListener('click', this.destroy.bind(this));

    this.box.appendChild(this.closeButton);
    this.glass.appendChild(this.box);
    document.body.appendChild(this.glass);
    document.addEventListener('keydown', this.handelKey.bind(this));
}

LightBox.prototype.handelKey = function(event) {
    var keyCode = event.keyCode || event.charCode || event.which;

    if (keyCode === /*Escape*/27 || keyCode === /*x*/88) {
        this.destroy();
    }
}

LightBox.prototype.destroy = function() {
    document.removeEventListener(this.handelKey);
    document.body.removeChild(this.glass);
}

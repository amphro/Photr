/**
* Add some utility methods to the global variable
*/
(function(global) {
    if (!global.getById) {
        /**
        * Helper method to get an element from the dom by ID
        */
        global.getById = function getById(id) {
            return global.document.getElementById(id);
        };

        global.setText = function setText(ele, text) {
            ele.innerText = ele.textContent = text;
        }
    }
})(window);

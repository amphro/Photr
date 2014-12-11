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
    }


    if (!global.getByClassName) {
        /**
        * Helper method to get a single element from the dom by class name
        */
        global.getByClassName = function getByClassName(name, ele) {
            ele = ele || global.document;
            var elements = ele.getElementsByClassName(name);

            if (elements.length <= 0) {
                throw 'No elements with class name ' + name;
            }

            if (elements.length > 1) {
                console.warn('More than one element with class name ' + name + '. Returning the first one.');
            }

            return elements[0];
        };
    }

})(window);

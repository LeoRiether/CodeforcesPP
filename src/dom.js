/**
 * @file Utilities to manipulate the DOM
 */

module.exports = {
    $(query, element) {
        return (element || document).querySelector(query);
    },
    $$(query, element) {
        return (element || document).querySelectorAll(query);
    },
    on(element, event, handler) {
        element.addEventListener(event, handler);
    },
};
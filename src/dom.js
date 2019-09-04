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
    element(tag, attrs) {
        let el = document.createElement(tag);
        Object.assign(el, attrs);
        return el;
    },
};
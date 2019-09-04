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
    element(tag, { className, id, children }) {
        let el = document.createElement(tag);
        el.id = id || "";
        el.className = className || "";
        for (let c of children)
            el.appendChild(c);
        return el;
    },
};
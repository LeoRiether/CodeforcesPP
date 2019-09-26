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
    on(element, event, handler, options) {
        element.addEventListener(event, handler, options || {});
    },

    /**
     * @example dom.element('a', { className: "my-class", href: "codeforces.com" }); => Creates <a class="my-class" href="codeforces.com"></a>
     */
    element(tag, attrs) {
        let el = document.createElement(tag);
        if (!attrs) return el;

        if (attrs.children) {
            for (let c of attrs.children)
                el.appendChild(c);
            delete attrs.children;
        }
        Object.assign(el, attrs);
        Object.assign(el.style, attrs.style);
        return el;
    },
};
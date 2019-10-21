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
    element(tag, attrs, ...children) {
        let el;
        if (typeof tag === 'string') {
            el = document.createElement(tag);
        } else if (typeof tag === 'function') {
            el = tag(attrs);
        }

        if (children) {
            for (let c of children) {
                if (typeof c === 'string') {
                    el.appendChild(document.createTextNode(c));
                } else if (c instanceof Array) {
                    for (let cc of c)
                        el.appendChild(cc);
                } else {
                    el.appendChild(c);
                }
            }
        }

        Object.assign(el, attrs);
        return el;
    },

    fragment() {
        return document.createDocumentFragment();
    }
};
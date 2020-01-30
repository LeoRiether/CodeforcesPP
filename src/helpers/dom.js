/**
 * @file Utilities to manipulate the DOM
 */

function isEvent(str) {
    return str.length > 2 && str[0] == 'o' && str[1] == 'n' && str[2] >= 'A' && str[2] <= 'Z';
}

export default {
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
     * Works like React.createElement
     * Doesn't support a set of features, like dataset attributions, but should work for most purposes
     */
    element(tag, props, ...children) {
        let el;
        if (typeof tag === 'string') {
            el = document.createElement(tag);

            Object.assign(el, props); // Some properties like data-* and onClick won't do anything here...
            if (props) {
                // ...so we have to consider them here
                for (let key in props) {
                    if (key.startsWith('data-') || key == 'for')
                        el.setAttribute(key, props[key]);
                    else if (isEvent(key))
                        el.addEventListener(key.substr(2).toLowerCase(), props[key]);
                }
            }
        } else if (typeof tag === 'function') {
            el = tag(props);
        }

        for (let c of children) {
            if (typeof c === 'string') {
                el.appendChild(document.createTextNode(c));
            } else if (c instanceof Array) {
                el.append(...c);
            } else if (c) {
                el.appendChild(c);
            }
        }

        return el;
    },

    fragment(...children) {
        let frag = document.createDocumentFragment();
        for (let c of children) {
            if (typeof c === 'string') {
                frag.appendChild(document.createTextNode(c));
            } else if (c instanceof Array) {
                for (let cc of c)
                    frag.appendChild(cc);
            } else if (c) {
                frag.appendChild(c);
            }
        }
        return frag;
    }
};
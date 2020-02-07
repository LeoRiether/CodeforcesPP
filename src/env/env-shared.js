// DO NOT DIRECTLY IMPORT THIS
// import 'env.js' instead

import dom from '../helpers/dom';
import { once } from '../helpers/Functional';

export const version = process.env.VERSION;

/**
 * Decorates a function so, when called, it only runs when the DOM has loaded
 * @example
 * let write_sum = ready((x, y) => document.write(x + y));
 * write_sum(1, 2); // only writes when the DOM has loaded
 * @type (...a -> b) -> ...a -> Promise<b>
 */
export const ready = fn => (...args) => {
    if (document.readyState == 'complete') {
        return Promise.resolve(fn(...args));
    }

    return new Promise(res =>
        document.addEventListener('DOMContentLoaded', () => res(fn(...args)), { once: true }));
};

/**
 * @type Function -> Promise
 */
export const run_when_ready = fn => ready(fn)();

export const userHandle = once(ready(function () {
    const handle = dom.$('.lang-chooser').children[1].children[0].innerText.trim();
    return handle == 'Enter' ? 'tourist' : handle;
}));
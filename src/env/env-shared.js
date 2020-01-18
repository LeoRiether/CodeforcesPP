// DO NOT DIRECTLY REQUIRE THIS
// require('env.js') instead

/**
 * Decorates a function so, when called, it only runs when the DOM has loaded
 * @example
 * let write_sum = ready((x, y) => document.write(x + y));
 * write_sum(1, 2); // only writes when the DOM has loaded
 * @type (...a -> b) -> ...a -> Promise<b>
 */
export const ready = fn => (...args) => new Promise(res => {
    const resolver = () => res(fn(...args));

    if (document.readyState == 'complete') {
        resolver();
    } else {
        document.addEventListener('DOMContentLoaded', resolver, { once: true });
    }
});

export const userHandle = ready(function () {
    const handle = dom.$('.lang-chooser').children[1].children[0].innerText.trim();
    return handle == 'Enter' ? 'tourist' : handle;
});
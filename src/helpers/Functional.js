/**
 * @file Experimental functional library, kinda like Ramda, but not as sound
 */

export function curry(fn, arity=fn.length, ...args) {
    return arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);
}

/**
 * The same as Ramda's tryCatch:
 * `tryCatch` takes two functions, a `tryer` and a `catcher`. The returned
 * function evaluates the `tryer`; if it does not throw, it simply returns the
 * result. If the `tryer` *does* throw, the returned function evaluates the
 * `catcher` function and returns its result. Note that for effective
 * composition with this function, both the `tryer` and `catcher` functions
 * must return the same type of results.
 *
 * @param {Function} tryer The function that may throw.
 * @param {Function} catcher The function that will be evaluated if `tryer` throws.
 * @return {Function} A new function that will catch exceptions and send then to the catcher.
 */
export function tryCatch(tryer, catcher) {
    return (...args) => {
        try {
            return tryer(...args);
        } catch(err) {
            return catcher(err);
        }
    };
}

/**
 * Returns a new function that, when called, will try to call `fn`.
 * If `fn` throws, `def` will be returned instead
 * @param {Function} fn The function to try executing
 * @param {any} def The default value to return if `fn` throws
 * @return {Function}
 */
export function safe(fn, def) {
    return (...args) => {
        try {
            return fn(...args);
        } catch {
            return def;
        }
    };
}

/**
 * Takes a list of functions and returns a function that executes them in
 * left-to-right order, passing the return value of one to the next
 * @param {[]Function} fns The functions to be piped
 * @return {Function} The piped composition of the input functions
 */
export const pipe = (...fns) => arg => fns.reduce((acc, f) => f(acc), arg);

/**
 * Curried version of Array.prototype.map
 */
export const map = fn => arr => [].map.call(arr, fn);

/**
 * Curried version of Array.prototype.forEach
 */
export const forEach = fn => arr => [].forEach.call(arr, fn);

/**
 * @example zipBy2([1,2,3,4,5,6]) == [[1,2], [3,4], [5,6]]
 * @example zipBy2([1,2,3]) == [[1,2], [3, undefined]]
 * @return {Array}
 */
export function zipBy2(list) {
    let r = [];
    for (let i = 0; i < list.length; i += 2) {
        r.push([ list[i], list[i+1] ]);
    }
    return r;
}

export const flatten = list => list.reduce((acc, a) => acc.concat([].slice.call(a)), []);

export function once(fn) {
    let result, ran = false;
    return function(...args) {
        if (!ran) {
            ran = true;
            result = fn(...args);
        }
        return result;
    };
}

export const pluck = key => obj => obj[key];

export const capitalize = str =>
    str[0].toUpperCase() + str.slice(1).toLowerCase();

/**
 * Formats a keyboard event to a shortcut string
 * It's in Functional.js because putting it in shortcuts.js created a circular dependency, and I don't like warnings in my builds
 * @param {KeyboardEvent} event
 * @returns {String} a formatted shortcut string from the event, like "Ctrl+Shift+P"
 */
export function formatShortcut(event) {
    let res = "";

    if (event.metaKey) res += 'Meta+';
    if (event.ctrlKey) res += 'Ctrl+';
    if (event.altKey) res += 'Alt+';
    if (event.shiftKey) res += 'Shift+';

    res += event.key == ' ' ? 'Space' : capitalize(event.key);

    return res;
}

/**
 * Returns a debounced function that fires no more than once in a `delay` ms period
 * @param {Function} fn the function to debounce
 * @param {Number} delay the delay in milliseconds
 */
export function debounce(fn, delay) {
    let timeout;
    return function debounced(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = undefined;
            fn(...args);
        }, delay);
    };
}

export async function time(fn) {
    if (process.env.NODE_ENV == 'production') return fn();
    console.time('[CF++] ' + fn.name);
    await fn();
    console.timeEnd('[CF++] ' + fn.name);
}

export async function profile(fn) {
    if (process.env.NODE_ENV == 'production') return fn();
    console.profile(fn.name);
    await time(fn);
    console.profileEnd(fn.name);
}
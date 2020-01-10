/**
 * @file Experimental functional library, kinda like Ramda, but not as sound
 */

function curry(fn, arity=fn.length, ...args) {
    return arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);
}

module.exports = {
    curry: curry,

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
    tryCatch(tryer, catcher) {
        return (...args) => {
            try {
                return tryer(...args);
            } catch(err) {
                return catcher(err);
            }
        };
    },

    /**
     * Returns a new function that, when called, will try to call `fn`.
     * If `fn` throws, `def` will be returned instead
     * @param {Function} fn The function to try executing
     * @param {any} def The default value to return if `fn` throws
     * @return {Function}
     */
    safe(fn, def) {
        return (...args) => {
            try {
                return fn(...args);
            } catch {
                return def;
            }
        };
    },

    /**
     * Takes a list of functions and returns a function that executes them in
     * left-to-right order, passing the return value of one to the next
     * @param {[]Function} fns The functions to be piped
     * @return {Function} The piped composition of the input functions
     */
    pipe(...fns) {
        return arg =>
            fns.reduce((acc, f) => f(acc), arg);
    },

    /**
     * Curried version of Array.prototype.map
     */
    map: fn => arr => [].map.call(arr, fn),

    /**
     * Curried version of Array.prototype.forEach
     */
    forEach: fn => arr => [].forEach.call(arr, fn),

    /**
     * @example zipBy2([1,2,3,4,5,6]) == [[1,2], [3,4], [5,6]]
     * @example zipBy2([1,2,3]) == [[1,2], [3, undefined]]
     * @return {Array}
     */
    zipBy2(list) {
        let r = [];
        for (let i = 0; i < list.length; i += 2) {
            r.push([ list[i], list[i+1] ]);
        }
        return r;
    },

    flatten: list => list.reduce((acc, a) => acc.concat([].slice.call(a)), []),

    once(fn) {
        let result, ran = false;
        return (...args) => ran ? result : fn(...args);
    },

    pluck: key => obj => obj[key],
};
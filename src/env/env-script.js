// DO NOT DIRECTLY REQUIRE THIS
// require('env.js') instead

const { safe } = require('../helpers/Functional');

export function inject(fn) {
    fn();
}

export const version = typeof GM_info !== 'undefined' && GM_info.script.version;

export let storage = {
    get: key => Promise.resolve(localStorage.getItem(key))
                .then (safe(JSON.parse, {})),
    set: (key, value) => Promise.resolve(localStorage.setItem(key, JSON.stringify(value)))
};

export function Codeforces(fn, ...args) {
    return Promise.resolve(Codeforces[fn](...args));
}
// DO NOT DIRECTLY REQUIRE THIS
// require('env.js') instead

const { safe } = require('../helpers/Functional');

export function inject(fn, data) {
    return Promise.resolve(fn(data));
}

export function Codeforces(fn, ...args) {
    return Promise.resolve(unsafeWindow.Codeforces[fn](...args));
}

export const storage = {
    get: key => Promise.resolve(localStorage.getItem(key))
                .then (safe(JSON.parse, {})),
    set: (key, value) => Promise.resolve(localStorage.setItem(key, JSON.stringify(value)))
};

export const version = typeof GM_info !== 'undefined' && GM_info.script.version;

let csrf_cached;
export async function csrf() {
    if (!csrf_cached)
        csrf_cached = unsafeWindow.Codeforces.getCsrfToken();

    return csrf_cached;
}

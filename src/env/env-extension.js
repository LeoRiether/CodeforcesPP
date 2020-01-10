// DO NOT DIRECTLY REQUIRE THIS
// require('env.js') instead

const browser = require('webextension-polyfill');
const dom = require('../helpers/dom');
const { pluck } = require('../helpers/Functional');

export function inject(fn) {
    (document.body || document.head || document.documentElement).appendChild(
        <script>( {fn.toString()} )();</script>
    );
}

export let storage = {
    get: key => browser.storage.sync.get([key])
                .then (pluck(key)),
    set: (key, value) => browser.storage.sync.set({ [key]: value })
};

export function Codeforces(fn, ...args) {
    const cf = require('./cf_injection');
    return cf.run(fn, args);
}

export const version = browser.runtime.getManifest().version;

// shorter, unreadable version:
// export const csrf = (value => () => value = value || Codeforces.getCsrfToken())();
let csrf_cached;
export async function csrf() {
    if (!csrf_cached)
        csrf_cached = await Codeforces('getCsrfToken');

    return csrf_cached;
}

// DO NOT DIRECTLY REQUIRE THIS
// require('env.js') instead

const browser = require('webextension-polyfill');
const dom = require('../helpers/dom');
const { pluck } = require('../helpers/Functional');

const genID = (id => () => id++)(1); // magic

function injectScript(fn) {
    (document.body || document.head || document.documentElement).appendChild(
        <script>( {fn.toString()} )();</script>
    );
}

// resolveFnTable[id] = resolve function for the promise created on inject()
let resolveFnTable = {};

(function host() {
    window.addEventListener('message', event => {
        if (event.origin != window || event.data.for != 'host')
            return;

        const resolve = resolveFnTable[event.data.id];
        resolve(event.data.result);
        delete resolveFnTable[event.data.id];
    });
})();

injectScript(function client() {
    window.addEventListener('message', event => {
        if (event.origin != window || event.data.for != 'client')
            return;

        const result = eval(event.data.fn)(event.data.data);
        window.postMessage({
            for: 'host',
            id: event.data.id,
            result
        }, '*');
    });
});

export const inject = (fn, data) => new Promise(resolve => {
    const id = genID();

    resolveFnTable[id] = resolve;

    window.postMessage({
        for: 'client',
        id,
        fn: fn.toString(),
        data
    }, '*');
});

export function Codeforces(fname, ...args) {
    return inject(data => Codeforces[data.fname](...data.args), { fname, args });
}

export let storage = {
    get: key => browser.storage.sync.get([key])
                .then (pluck(key)),
    set: (key, value) => browser.storage.sync.set({ [key]: value })
};

export const version = browser.runtime.getManifest().version;

// shorter, unreadable version:
// export const csrf = (value => () => value = value || Codeforces.getCsrfToken())();
let csrf_cached;
export async function csrf() {
    if (!csrf_cached)
        csrf_cached = await Codeforces('getCsrfToken');

    return csrf_cached;
}
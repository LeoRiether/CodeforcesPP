// DO NOT DIRECTLY REQUIRE THIS
// require('env.js') instead

const browser = require('webextension-polyfill');
const messages = require('./messages');
const dom = require('../helpers/dom');

export function inject(fn) {
    (document.body || document.head || document.documentElement).appendChild(
        <script>( {fn.toString()} )();</script>
    );
}

export const version = browser.runtime.getManifest().version;

(async function (p) {
    console.log(await p);
})(browser.storage.sync.get(['cfpp']));

export let storage = {
    get: key => browser.storage.sync.get([key]),
    set: (key, value) => browser.storage.sync.set({ [key]: value })
};

export function Codeforces(fn, ...args) {
    return messages.post('CF::call', {  });
}
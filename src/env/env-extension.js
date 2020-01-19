// DO NOT DIRECTLY REQUIRE THIS
// require('env.js') instead

const browser = require('webextension-polyfill');
import dom from '../helpers/dom';
import { pluck } from '../helpers/Functional';

export const global = window;

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
        csrf_cached = global.Codeforces.getCsrfToken();

    return csrf_cached;
}
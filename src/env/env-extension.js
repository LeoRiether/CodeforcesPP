// DO NOT DIRECTLY REQUIRE THIS
// require('env.js') instead

import dom from '../helpers/dom';
import { safe, pluck } from '../helpers/Functional';

export const global = process.env.TARGET == 'extension' && window;

// function query() {

// }

// TODO: fix these
// export let storage = {
//     get: key => browser.storage.sync.get([key])
//                 .then (pluck(key)),
//     set: (key, value) => browser.storage.sync.set({ [key]: value })
// };

// export const version = browser.runtime.getManifest().version;

export const storage = {
    get: key => Promise.resolve(localStorage.getItem(key))
                .then (safe(JSON.parse, {})),
    set: (key, value) => Promise.resolve(localStorage.setItem(key, JSON.stringify(value)))
};

export const version = '0.1.2';
// DO NOT DIRECTLY REQUIRE THIS
// require('env.js') instead

import { safe } from '../helpers/Functional';

export const global = typeof unsafeWindow !== 'undefined' && unsafeWindow;

export const storage = {
    get: key => Promise.resolve(localStorage.getItem(key))
                .then (safe(JSON.parse, {})),
    set: (key, value) => Promise.resolve(localStorage.setItem(key, JSON.stringify(value)))
};

export const version = typeof GM_info !== 'undefined' && GM_info.script.version;

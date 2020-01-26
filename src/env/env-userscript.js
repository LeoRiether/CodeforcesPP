// DO NOT DIRECTLY IMPORT THIS
// import 'env.js' instead

import { safe } from '../helpers/Functional';

export const global = process.env.TARGET == 'userscript' && typeof unsafeWindow !== 'undefined' && unsafeWindow;

export const storage = {
    get: key => Promise.resolve(localStorage.getItem(key))
                .then (safe(JSON.parse, {})),
    set: (key, value) => Promise.resolve(localStorage.setItem(key, JSON.stringify(value)))
};
// Minimal browser polyfill for Chrome

export let onMessage, sendMessage, getURL, storage;

let shared;

if (typeof browser !== 'undefined') {
    // Firefox
    shared = browser;
    onMessage = fn => browser.runtime.onMessage.addListener(fn);
    sendMessage = browser.runtime.sendMessage.bind(browser.runtime);

    if (process.env.NODE_ENV == 'development') {
        // Firefox doesn't let me access storage without an add-on ID
        // so here's a mock
        storage = {
            get: async () => ({ cfpp: { darkTheme: true } }),
            async set() { /* nothing */ }
        };
    } else {
        storage = browser.storage.sync;
    }
} else {
    // Chrome
    shared = chrome;
    const isThenable = x => x && typeof x.then === 'function';
    const promisify = fn => (...args) => new Promise((res, rej) => {
        fn(...args, response =>
            chrome.runtime.lastError ? rej(chrome.runtime.lastError) : res(response));
    });

    function promisifyAll(obj, fns) {
        let ret = {};
        for (let fn of fns) {
            ret[fn] = promisify(obj[fn].bind(obj));
        }
        return ret;
    }

    onMessage = function(fn) {
        chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
            let response = fn(message, sender);
            if (isThenable(response))
                response.then(sendResponse);
            return true;
        });
    };

    sendMessage = message => new Promise(resolve =>
        chrome.runtime.sendMessage(message, {}, resolve));

    storage = promisifyAll(chrome.storage.sync, ['get', 'set']);
}

getURL = shared.runtime.getURL.bind(shared.runtime);

// sendMessage = data => Promise.resolve({
//     id: data.id,
//     type: 'bg result',
//     result: {
//         cfpp: {
//             darkTheme: true
//         }
//     }
// });
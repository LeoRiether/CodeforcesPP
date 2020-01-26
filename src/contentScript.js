const log = process.env.NODE_ENV === 'development'
            ? console.log
            : function(){};

// The injected script can't send messages to the background js
// So the content script shall act as a bridge between the two
window.addEventListener('message', e => {
    // TODO: test without polyfill
    // TODO: make my own lightweight semi-polyfill

    log('[content] Got', e.data);
    if (e.origin === window.origin && e.data.to == 'cs') {
        e.data.to = 'bg';

        browser.runtime
        .sendMessage(e.data)
        .then(r => { log("[content] GOT THE RESPONSE", r); return r; })
        .then(response => window.postMessage(response, window.origin));
    }
});
browser.runtime.onMessage.addListener(e => {
    log('[content] Got from bg', e);
    if (e.origin === window.origin)
        window.postMessage(e, window.origin);
});

let script = document.createElement('script');
script.src = browser.runtime.getURL('index.js');
script.id = 'codeforces++';
(document.body || document.head || document.documentElement).appendChild(script);
script.remove();
const log = process.env.NODE_ENV === 'development'
            ? console.log
            : function(){};

function respond(event, result) {
    window.postMessage({
        type: 'bg result',
        id: event.data.id,
        result: result,
        to: 'is',
    }, window.origin);
}

// The injected script can't send messages to the background js
// So the content script shall act as a bridge between the two
window.addEventListener('message', e => {
    log('[content] Got', e.data);

    if (e.origin != window.origin || e.data.to != 'cs')
        return;

    // TODO: error handling for the promises
    if (e.data.type == 'get storage') {
        browser.storage.sync.get([e.data.key])
        .then(result => respond(e, result));
    }
    else if (e.data.type == 'set storage') {
        browser.storage.sync.set({ [e.data.key]: e.data.value })
        .then(result => respond(e, result));
    }
    else {
        // Send to the background to handle
        e.data.to = 'bg';

        browser.runtime.sendMessage(e.data)
        .then(r => { log("[content] GOT THE RESPONSE", r); return r; })
        .then(response => window.postMessage(response, window.origin));
    }
});
browser.runtime.onMessage.addListener(e => {
    log('[content] Got from bg', e);
    window.postMessage(e, window.origin);
});

let script = document.createElement('script');
script.src = browser.runtime.getURL('index.js');
script.id = 'codeforces++';
(document.body || document.head || document.documentElement).appendChild(script);
script.remove();
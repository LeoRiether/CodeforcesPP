const log = process.env.NODE_ENV === 'development'
            ? console.log
            : function(){};

function success(id, result) {
    window.postMessage({
        type: 'bg result',
        id: id,
        result: result,
        to: 'is',
    }, window.origin);
}

function failure(id, error) {
    window.postMessage({
        type: 'error',
        id: id,
        error: error,
        to: 'is',
    }, window.origin);
}


// The injected script can't send messages to the background js
// So the content script shall act as a bridge between the two
window.addEventListener('message', e => {
    log('[content] Got', e.data);

    if (e.origin != window.origin || e.data.to != 'cs')
        return;

    const id = e.data.id;

    // TODO: error handling for the promises
    if (e.data.type == 'get storage') {
        browser.storage.sync
        .get([e.data.key])
        .then(result => success(id, result))
        .catch(err => failure(id, err));
    }
    else if (e.data.type == 'set storage') {
        browser.storage.sync
        .set({ [e.data.key]: e.data.value })
        .then(result => success(id, result))
        .catch(err => failure(id, err));
    }
    else {
        // Send to the background to handle
        e.data.to = 'bg';

        browser.runtime
        .sendMessage(e.data)
        .then(response => window.postMessage(response, window.origin))
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
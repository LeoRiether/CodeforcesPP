console.log(`[contentScript.js]`, chrome, chrome.tabs);

const b = typeof browser !== 'undefined' ? browser : chrome;
b.tabs.executeScript({
    file: '/index.js',
    runAt: 'document_start'
}, () => console.log('Notice: index injected'));
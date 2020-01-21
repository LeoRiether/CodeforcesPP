browser.runtime.onMessage.addListener(function(message, sender) {

    if (message === 'inject') {
        browser.tabs.executeScript(sender.tab.id, {
            file: '/index.js',
            runAt: 'document_start'
        });
        return;
    }

    // { type: 'load config', key: 'cfpp' }
    if (message.type === 'load config') {
        return browser.storage.sync.get([message.key]);
    }

    // { type: 'load config', key: 'cfpp', value: 'some string' }
    if (message.type === 'save config') {
        return browser.storage.sync.set({ [message.key]: message.value });
    }

});
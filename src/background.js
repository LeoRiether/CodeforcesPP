browser.runtime.onMessage.addListener(data => {
    console.log('Got message', data);

    if (data.to !== 'bg') return false;

    if (data.type == 'propagate config') {
        // Copied straight from popup.js
        function sendChangeToInjected(id, value) {
            // There are like 3 ways of sending messages around
            // what the fuck
            function send(tab) {
                browser.tabs.sendMessage(tab.id, {
                    type: 'config change',
                    to: 'is',
                    id,
                    value,
                });
            }

            browser.tabs
            .query({ url: '*://codeforces.com/*' })
            .then(tabs => tabs.forEach(send));
        }

        sendChangeToInjected(data.key, data.value);
        return Promise.resolve({ id: data.id, to: 'is', type: 'bg result' });
    }

});
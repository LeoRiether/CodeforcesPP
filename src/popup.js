import dom from './helpers/dom';
import * as events from './helpers/events';
import { Config, Shortcuts } from './env/config_ui';
import { defaultConfig } from './env/config';

let config;

function sendChangeToInjected(id, value) {
    // There are like 3 ways of sending messages around
    // what the fuck
    // Also it doesn't work some times. Fuck this.
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

function pushChange(id, value) {
    console.log(`#${id} changed to ${value}. Notifying clients.`);
    config[id] = value;
    events.fire(id, value);
    sendChangeToInjected(id, value);
    browser.storage.sync.set({ cfpp: config });
}

function pushShortcut(id, value) {
    console.log(`shortcut #${id} changed to ${value}. Notifying clients.`);
    config.shortcuts[id] = value;
    sendChangeToInjected('shortcuts', config.shortcuts);
    browser.storage.sync.set({ cfpp: config });
}

events.listen('darkTheme', on => {
    document.body.classList[on ? 'add' : 'remove']('dark');
});

(async function() {
    config = await browser.storage.sync.get(['cfpp']);
    config = config.cfpp;
    config = Object.assign({}, defaultConfig, config);

    if (config.darkTheme)
        document.body.classList.add('dark');

    document.body.appendChild(<div id="ui">
        <Config config={config} pushChange={pushChange} pullChange={events.listen} />
        <span className="hr"/>
        <Shortcuts shortcuts={config.shortcuts} pushChange={pushShortcut}/>
    </div>);
})();
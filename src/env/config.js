/**
 * @file Manages CF++ configuration with localStorage and creates the settings UI
 */

// TODO: needs some refactoring

import dom from '../helpers/dom';
import { objectDelta, safe } from '../helpers/Functional';
import * as events from '../helpers/events';
import env from './env';
import { Config } from './config_ui';

let config = {};
export const defaultConfig = {
    showTags:       true,
    style:          true,
    finder:         'Ctrl+Space',
    darkTheme:      false,
    standingsItv:   0,
    defStandings:   'Common',
    hideTestNumber: false,
    sidebarBox:     true
};

export function load() {
    // Get the data from localStorage because it's fast
    config = safe (JSON.parse, {}) (localStorage.cfpp);

    // Settings auto-extend when more are added in the script
    config = Object.assign({}, defaultConfig, config);

    if (process.env.TARGET == 'extension') {
        // Query the updated data (from browser.storage.sync) when the window is idle
        // Can be very slow on some browsers (like Opera)
        if ('requestIdleCallback' in env.global) {
            env.global.requestIdleCallback(updateFromSync, { timeout: 1000 });
        } else {
            updateFromSync();
        }
    } else {
        save();
    }
}

function updateFromSync() {
    return env.storage
    .get('cfpp')
    .then(data => {
        objectDelta(config, data)
        .forEach(key => {
            config[key] = data[key];
            events.fire(key, data[key]);
        });
    })
    .then(save);
}

export function reset() {
    config = defaultConfig;
    save();
}
export function save() {
    localStorage.cfpp = JSON.stringify(config);
    if (process.env.TARGET == 'extension') {
        env.storage.set('cfpp', config);
    }
}
export function commit(id) {
    events.fire(id, config[id]);
    save();
}

/**
 * Creates the interface to change the settings.
 */
export const createUI = process.env.TARGET == 'extension'
                 ? function(){ /* there's no createUI in extension mode */ }
                 : env.ready(function()
{
    // Some pages, like error pages and m2.codeforces, don't have a header
    // As there's no place to put the settings button, just abort
    if (!dom.$('.lang-chooser')) return;

    function pushChange(id, value) {
        // TODO: fix for extension, maybe
        config[id] = value;
        commit(id);
    }

    let modal = (
        <div className="cfpp-config cfpp-modal cfpp-hidden">
            <div className="cfpp-modal-background" onClick={closeUI}/>
            <div className="cfpp-modal-inner">
                <Config config={config} pushChange={pushChange} pullChange={events.listen} />
            </div>
        </div>
    );

    // Create the button that shows the modal
    let modalBtn = <a className="cfpp-config-btn">[++]</a>
    dom.on(modalBtn, 'click', ev => {
        ev.preventDefault();
        modal.classList.remove('cfpp-hidden');
    });
    dom.on(document, 'keyup', keyupEvent => { // pressing ESC also closes the UI
        if (keyupEvent.key == 'Escape')
            closeUI();
    });

    // Append the created elements to the DOM
    document.body.appendChild(modal);
    dom.$('.lang-chooser').children[0].prepend(modalBtn);
});

export function closeUI() {
    dom.$('.cfpp-config').classList.add('cfpp-hidden');
    save();
}

export const get = key => config[key];
export const set = (key, value) => { config[key] = value; commit(key); };
export const toggle = key => set(key, !config[key]);
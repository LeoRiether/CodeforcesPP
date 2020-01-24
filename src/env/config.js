/**
 * @file Manages CF++ configuration with localStorage and creates the settings UI
 */

// TODO: needs some refactoring

import dom from '../helpers/dom';
import { safe } from '../helpers/Functional';
import * as events from '../helpers/events';
import env from './env';

let config = {};
const defaultConfig = {
    showTags:       true,
    style:          true,
    finder:         'Ctrl+Space',
    darkTheme:      false,
    standingsItv:   0,
    defStandings:   'Common',
    hideTestNumber: false,
    sidebarBox:     true
};

async function load() {
    config = await env.storage.get('cfpp');

    // Settings auto-extend when more are added in the script
    config = Object.assign({}, defaultConfig, config);
    save();
}

function reset() {
    config = defaultConfig;
    save();
}

function save() {
    env.storage.set('cfpp', config);
}

function commit(id) {
    events.fire(id, config[id]);
    save();
}

/**
 * Creates the interface to change the settings.
 */
const createUI = process.env.TARGET == 'extension' && false
                 ? function(){ /* there's no createUI in extension mode */ }
                 : env.ready(function() {
    // Some pages, like error pages and m2.codeforces, don't have a header
    // As there's no place to put the settings button, just abort
    if (!dom.$('.lang-chooser')) return;

    function prop(title, type, id, data) {
        return { title, type, id, data };
    }

    let modalProps = [
        prop('"Show Tags" button', 'toggle', 'showTags'),
        prop('Sidebar Action Box', 'toggle', 'sidebarBox'),
        prop('Default standings', 'select', 'defStandings', ['Common', 'Friends']),
        prop('Custom Style', 'toggle', 'style'),
        prop('Update standings every ___ seconds (0 to disable)', 'number', 'standingsItv'),
        prop('Finder keyboard shortcut', 'text', 'finder'),
        prop('Hide "on test X" in verdicts', 'toggle', 'hideTestNumber'),
        prop('Dark Theme', 'toggle', 'darkTheme'),
    ];

    if (process.env.NODE_ENV == 'development') {
        modalProps.push(
            prop('Version', 'text', 'version')
        );
    }

    function makeToggle({id}) {
        let checkbox =
            <input id={id}
                   checked={config[id]}
                   type="checkbox"/>;

        dom.on(checkbox, 'change', () => {
            // Update property value when the checkbox is toggled
            config[id] = checkbox.checked;
            commit(id);
        });

        events.listen(id, value => checkbox.checked = value);

        return checkbox;
    }

    function makeNumber({id}) {
        let input = <input id={id} value={config[id] || 0} type="number"/>

        dom.on(input, 'input', () => {
            // Update property value when the number changes
            config[id] = +input.value;
            commit(id);
        });

        return input;
    }

    function makeSelect({id, data}) {
        let select = <select id={id}/>;
        data
            .map(option =>
                <option value={option}
                        selected={option == config[id]}>
                    {option}
                </option>
            )
            .forEach(opt => select.appendChild(opt));

        dom.on(select, 'change', () => {
            // Update property value when the number changes
            config[id] = select.value;
            commit(id);
        });

        return select;
    }

    function makeText({id}) {
        let input = <input id={id} value={config[id]} type="text"/>
        dom.on(input, 'change', () => {
            config[id] = input.value;
            commit(id);
        });

        return input;
    }

    let make = {
        'toggle': makeToggle,
        'number': makeNumber,
        'select': makeSelect,
        'text':   makeText,
    };

    // Create the actual nodes based on the props
    modalProps = modalProps.map(p => {
        let node;
        if (typeof make[p.type] === 'function') {
            node = make[p.type](p);
        } else {
            node = document.createTextNode(`${p.type} does not have a make function! Please check the createUI function on config.js`);
        }

        if (p.type == 'toggle') {
            // Toggles come before their labels
            return (
                <div>
                    {node}
                    <label style="margin-left: 0.5em;" for={p.id}>{p.title}</label>
                </div>
            );
        }

        return (
            <div>
                <label for={p.id}>{p.title}</label>
                {node}
            </div>
        );
    });

    let modal = (
        <div className="cfpp-config cfpp-modal cfpp-hidden">
            <div className="cfpp-modal-background" onClick={closeUI}/>
            <div className="cfpp-modal-inner">
                {modalProps}
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

function closeUI() {
    dom.$('.cfpp-config').classList.add('cfpp-hidden');
    save();
}

export default {
    createUI,
    closeUI,
    get: key => config[key],
    set: (key, value) => { config[key] = value; commit(key); },
    toggle: key => { config[key] = !config[key]; commit(key); },
    load,
    reset,
    save,

    // Events stuff
    listen: events.listen,
    fire: events.fire,
};
/**
 * @file Manages CF++ configuration with localStorage and creates the settings UI
 */

let dom = require('./dom');
const { safe } = require('./Functional');

let config = {};
const defaultConfig = {
    showTags:  true,
    style:     true,
    searchBtn: true,
    finder:    'Ctrl+Space',
    darkMode:  false,
    standingsItv:   0,
    defStandings:   'Common',
    hideTestNumber: false,
};
    
function load() {
    config = safe(JSON.parse, {})(localStorage.cfpp);

    // Settings auto-extend when more are added in the script
    config = Object.assign({}, defaultConfig, config);
    save();
}

function reset() {
    config = defaultConfig;
    save();
}

function save() {
    localStorage.cfpp = JSON.stringify(config);
}

/**
 * Creates the interface to change the settings.
 */
function createUI() {
    // Some pages, like error pages and m2.codeforces, don't have a header
    // As there's no place to put the settings button, just abort
    if (!dom.$('.lang-chooser')) return;

    function prop(title, type, id, data) {
        return { title, type, id, data };
    }

    let modalProps = [
        prop('"Show Tags" button', 'toggle', 'showTags'),
        prop('Default standings', 'select', 'defStandings', ['Common', 'Friends']),
        prop('Custom Style', 'toggle', 'style'),
        prop('"Google It" button', 'toggle', 'searchBtn'),
        prop('Update standings every ___ seconds (0 to disable)', 'number', 'standingsItv'),
        prop('Finder keyboard shortcut', 'text', 'finder'),
        prop('Hide "on test X" in verdicts', 'toggle', 'hideTestNumber'),
    ];

    function makeToggle({id}) {
        let checkbox = 
            <input id={id}
                   checked={config[id]} 
                   type="checkbox"/>;

        dom.on(checkbox, 'change', () => {
            // Update property value when the checkbox is toggled
            config[id] = checkbox.checked;
            save();
        });

        return checkbox;
    }

    function makeNumber({id}) {
        let input = <input id={id} value={config[id] || 0} type="number"/>

        dom.on(input, 'input', () => {
            // Update property value when the number changes
            config[id] = +input.value;
            save();
        });

        return input;
    }

    function makeSelect({id, data}) {
        let input = <select id={id}/>;
        data
            .map(option => 
                <option value={option}
                        selected={option == config[id]}>
                    {option}
                </option>
            )
            .forEach(opt => input.appendChild(opt));

        dom.on(input, 'change', () => {
            // Update property value when the number changes
            config[id] = input.value;
            save();
        });

        return input;
    }

    function makeText({id}) {
        let input = <input id={id} value={config[id]} type="text"/>
        dom.on(input, 'change', () => {
            config[id] = input.value;
            save();
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
                Refresh the page to apply changes
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
}

function closeUI() {
    dom.$('.cfpp-config').classList.add('cfpp-hidden');
    save();
}

module.exports = {
    createUI,
    closeUI,
    get: key => config[key],
    set: (key, value) => { config[key] = value; save(); },
    load,
    reset,
    save,
};
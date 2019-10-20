/**
 * @file Manages CF++ configuration with localStorage and creates the settings UI
 */

let dom = require('./dom');

let config = {};
const defaultConfig = {
    showTags:  true,
    style:     true,
    searchBtn: true,
    standingsItv: 0,
    defStandings: 'Common',
};
    
function load() {
    config = localStorage.cfpp;
    try {
        config = JSON.parse(config) || {};
    } catch {
        config = {};
    }

    // Settings auto-extend when more are added in the script
    config = Object.assign({}, defaultConfig, config);
    save();
}

// TODO: consider promisifying reset and save (maybe load too (maybe everything!))
function reset() {
    config = defaultConfig;
    save();
}

function save() {
    localStorage.cfpp = JSON.stringify(config);
}

/**
 * Creates the interface to change the settings.
 * The modal created has the following structure:
 * <div class="cfpp-config cfpp-modal cfpp-hidden">
 *      <div class="cfpp-modal-background"></div>
 *      <div class="cfpp-modal-inner">
 *          <!-- All the settings -->
 *      </div>
 * </div>
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
    ];

    function makeToggle({id}) {
        let checkbox = dom.element('input', { 
            type:     'checkbox',
            checked:  config[id],
            id:       id,
        });
        dom.on(checkbox, 'change', () => {
            // Update property value when the checkbox is toggled
            config[id] = checkbox.checked;
            save();
        });

        return checkbox;
    }

    function makeNumber({id}) {
        let input = dom.element('input', { 
            type:     'number',
            value:    config[id] || 0,
            id:       id,
        });

        dom.on(input, 'input', () => {
            // Update property value when the number changes
            config[id] = +input.value;
            save();
        });

        return input;
    }

    function makeSelect({id, data}) {
        let input = dom.element('select', { id: id });
        data
            .map(option => 
                dom.element('option', {
                    value: option,
                    innerText: option,
                    selected: option == config[id]
                })
            )
            .forEach(opt => input.appendChild(opt));

        dom.on(input, 'change', () => {
            // Update property value when the number changes
            config[id] = input.value;
            save();
        });

        return input;
    }

    let make = {
        'toggle': makeToggle,
        'number': makeNumber,
        'select': makeSelect,
    };

    // Create the actual nodes based on the props
    modalProps = modalProps.map(p => {
        let label = dom.element('label', { innerText: p.title });
        label.setAttribute('for', p.id);
        
        let node;
        if (typeof make[p.type] === 'function') {
            node = make[p.type](p);
        } else {
            node = document.createTextNode(`${p.type} does not have a make function! Please check the createUI function on config.js`);
        }
        
        return dom.element('div', { 
            children: [ label, node ] 
        });
    });

    // Create the modal and its children
    let modalInner = dom.element('div', { className: 'cfpp-modal-inner' , children: modalProps });
    modalInner.append('Refresh the page to apply changes'); // TODO: not this

    let modalBg = dom.element('div', { className: 'cfpp-modal-background' });
    dom.on(modalBg, 'click', closeUI); // clicking on the background closes the UI
    dom.on(document, 'keyup', keyupEvent => { // pressing ESC also closes the UI
        const key = keyupEvent.code || keyupEvent.key;
        if (key == 'Escape')
            closeUI();
    });

    let modal = dom.element('div', { 
        className: 'cfpp-config cfpp-modal cfpp-hidden',
        children: [ modalBg, modalInner ]
    });

    // Create the button that shows the modal
    let modalBtn = dom.element('a', { 
        className: 'cfpp-config-btn', 
        innerText: "[++]"
    });
    dom.on(modalBtn, 'click', ev => {
        ev.preventDefault();
        modal.classList.remove('cfpp-hidden');
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
    set: (key, value) => config[key] = value,
    load,
    reset,
    save,
};
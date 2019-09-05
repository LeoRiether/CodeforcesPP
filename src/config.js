/**
 * @file Manages CF++ configuration with localStorage and creates the settings UI
 */

let dom = require('./dom');

let config = {};
const defaultConfig = {
    showTags:  true,
    style:     true,
    searchBtn: true,
    isOk:      true, // In case the config is overwritten by something not-JSON (e.g. a bool), this will tell us
};
    
function load() {
    config = localStorage.cfpp;
    config = config ? JSON.parse(config) : false;
    if (!config || !config.isOk) {
        reset();
    }
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
 * The modal created has the following structure:
 * <div class="cfpp-config cfpp-modal cfpp-hidden">
 *      <div class="cfpp-modal-background"></div>
 *      <div class="cfpp-modal-inner">
 *          <!-- All the settings -->
 *      </div>
 * </div>
 */
function createUI() {
    function prop(title, type, id) {
        return { title, type, id };
    }

    let modalProps = [
        prop('"Show Tags" button', 'toggle', 'showTags'),
        prop('Custom Style', 'toggle', 'style'),
        prop('"Google It" button', 'toggle', 'searchBtn'),
    ];

    // Create the actual nodes based on the props
    modalProps = modalProps.map(p => {
        if (p.type == 'toggle') {
            let wrapper = dom.element('div');

            let checkbox = dom.element('input', { 
                type:     'checkbox',
                checked:  config[p.id],
                id:       p.id,
            });
            dom.on(checkbox, 'change', () => {
                // Update property value when the checkbox is toggled
                config[p.id] = checkbox.checked;
                save();
            });

            let label = dom.element('label', { innerText: p.title });
            label.setAttribute('for', p.id);

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            return wrapper;
        }
    });

    // Create the modal and its children
    let modalInner = dom.element('div', { className: 'cfpp-modal-inner' , children: modalProps });
    modalInner.append('Refresh the page to apply changes'); // TODO: not this

    let modalBg = dom.element('div', { className: 'cfpp-modal-background' });
    dom.on(modalBg, 'click', closeUI); // clicking on the background closes the UI

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

    // TODO: Jesus fucking Christ I need a unified .css file for everything
    // FIXME: what am I doing
    // PRIORITY: highest
    let style = `
    .cfpp-hidden {
        display: none;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .cfpp-config-btn {
        font-size: 22px !important;
        cursor: pointer;
    }

    .cfpp-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 101;
    }
    .cfpp-modal-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #00000087;
    }
    .cfpp-modal-inner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50vw;
        background: white;
        padding: 2em;
        border-radius: 6px;
    }
    .cfpp-config-inner>div {
        margin-bottom: 0.5em;
    }

    .cfpp-config label {
        margin-left: 0.5em;
    }
    `;
    document.body.appendChild(dom.element('style', {
        innerHTML: style
    }));
}

/**
 * Toggles the UI's visibility
 */
function closeUI() {
    save();
    dom.$('.cfpp-config').classList.add('cfpp-hidden');
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
/**
 * @file Adds a search pop-up to navigate Codeforces
 */

let dom = require('./dom');

// TODO
function bindEvents(input, results) {

}

// Create can be called many times, but will only run once
// Returns a promise
let createPromise = undefined;
function create() {
    if (createPromise !== undefined) {
        return createPromise;
    }
    
    createPromise = new Promise((res, rej) => {
        let input = dom.element('input', {
            type: 'text',
            className: 'finder-input',
            placeholder: 'Search anything'
        });

        let results = dom.element('div', {
            className: 'finder-results'
        });

        bindEvents(input, results);

        const modalInner = dom.element('div', {
            className: 'finder-inner',
            children: [ input, results ]
        });

        const background = dom.element('div', { className: 'cfpp-modal-background' });
        dom.on(document, 'keyup', (e) => {
            if (e.key == 'Escape')
                close();
        });
        dom.on(background, 'click', close);

        const modal = dom.element('div', {
            className: 'cfpp-modal cfpp-hidden',
            children: [ background, modalInner ]
        });

        document.body.appendChild(modal);
        res({ modal, input, results });
    });
    return createPromise;
}

async function open() {
    const { modal, input } = await create();
    modal.classList.remove('cfpp-hidden');
    input.focus();
}

async function close() {
    const { modal, input } = await create();
    modal.classList.add('cfpp-hidden');
    input.value = "";
}

module.exports = { create, open, close };
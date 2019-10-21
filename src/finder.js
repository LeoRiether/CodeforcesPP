/**
 * @file Adds a search pop-up to navigate Codeforces
 */

let dom = require('./dom');

// TODO
function bindEvents(input, results) {
    
}

// Create can be called many times, but will only create the finder once
// Returns a promise
let createPromise = undefined;
function create() {
    if (createPromise !== undefined) {
        return createPromise;
    }
    
    createPromise = new Promise((res, rej) => {
        let input = <input type="text" className="finder-input" placeholder="Search anything"/>;
        let results = <div className="finder-results"></div>;

        let modal = 
            <div className="cfpp-modal cfpp-hidden">
                <div className="cfpp-modal-background" onClick={close}/>
                <div className="finder-inner">
                    {input}
                    {results}
                </div>
            </div>;

        dom.on(document, 'keyup', e => {
            if (e.key == 'Escape')
                close();
        });

        bindEvents(input, results);

        document.body.appendChild(modal);
        res({ modal, input, results });
    });
    return createPromise;
}

async function open() {
    let { modal, input } = await create();
    modal.classList.remove('cfpp-hidden');
    input.focus();
}

async function close() {
    let { modal, input } = await create();
    modal.classList.add('cfpp-hidden');
    input.value = "";
}

module.exports = { create, open, close };
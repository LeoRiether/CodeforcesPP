/**
 * @file Adds a button to easily check the editorial/tutorial for a problem
 */

// FIXME: modal overflows viewport when the tutorial is too big
// TODO:

let dom = require('./dom');

let modalLoaded = false;

function showModal() {
    dom.$('.cfpp-tutorial').classList.remove('cfpp-hidden');
}

function loadModal(deadline) {
    if (modalLoaded && !deadline) {
        showModal();
        return;
    }

    if (deadline && deadline.timeRemaining() <= 0)
        return;
    
    modalLoaded = true;

    // Create the modal and its children
    let modalInner = dom.element('div', { className: 'cfpp-modal-inner' });
    modalInner.append('loading...');

    let modalBg = dom.element('div', { className: 'cfpp-modal-background' });
    dom.on(modalBg, 'click', () => { // clicking on the background closes the UI
        dom.$('.cfpp-tutorial').classList.add('cfpp-hidden');
    });

    let modal = dom.element('div', { 
        className: 'cfpp-tutorial cfpp-modal cfpp-hidden',
        children: [ modalBg, modalInner ]
    });

    // Puts the modal in the HTML
    document.body.appendChild(modal);

    // Get the problem ID
    let matches = location.pathname.match(/\/problemset\/problem\/(\d+)\/(.+)|\/contest\/(\d+)\/problem\/(.+)/i);
    let pcode;
    if (matches[1])
        pcode = matches[1] + matches[2];
    else if (matches[3])
        pcode = matches[3] + matches[4];
    else {
        modalInner.innerText = `Failed to get the problem code...`;
        return;
    }

    // Get the CSRF Token
    // lol
    const csrf = document.querySelector('.csrf-token').dataset.csrf;

    // Finally, load the tutorial
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/data/problemTutorial');

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhr.setRequestHeader('X-Csrf-Token', csrf);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.responseType = 'json';

    xhr.onload = () => {
        if (xhr.response && xhr.response.success) {
            modalInner.innerHTML = xhr.response.html;
            MathJax.Hub.Queue(() => MathJax.Hub.Typeset(modalInner));
        } else {
            modalInner.innerText = "Something went wrong!";
        }
    };

    xhr.onerror = () => {
        modalInner.innerText = `Failed to fetch tutorial! Here's an error code: ${xhr.status}`;
    };

    xhr.send(`problemCode=${pcode}&csrf_token=${csrf}`);
}

// createBtn might be a little bit too long for a "creates a button" function

/**
 * Creates a "Tutorial" button. 
 * When clicked, the button will create a modal and fill it with the tutorial's content
 */
module.exports = function createBtn(url) {
    let btn = dom.element('a', { innerText: 'Tutorial', style: { cursor:'pointer' } });
    dom.on(btn, 'click', () => {
        loadModal();
        showModal();
    });

    // Load the tutorial if we're idle
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadModal, { timeout: 10000 });
    }
    
    let menu = dom.$('.second-level-menu-list');
    menu.appendChild(dom.element('li', { children: [ btn ] }));
}
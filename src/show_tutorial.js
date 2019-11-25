/**
 * @file Adds a button to easily check the editorial/tutorial for a problem
 */

let dom = require('./dom');

let modalLoaded = false;

function showModal() {
    dom.$('.cfpp-tutorial').classList.remove('cfpp-hidden');
}

function closeModal() {
    dom.$('.cfpp-tutorial').classList.add('cfpp-hidden');
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
    let modalInner = <div className="cfpp-modal-inner">loading...</div>
    let modal =
        <div className="cfpp-modal cfpp-tutorial cfpp-hidden">
            <div className="cfpp-modal-background" onClick={closeModal}/>
            {modalInner}
        </div>;

    dom.on(document, 'keyup', keyupEvent => {
        if (keyupEvent.key == 'Escape')
        closeModal();
    });
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
    const csrf = (Codeforces && Codeforces.getCsrfToken()) || document.querySelector('.csrf-token').dataset.csrf;

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

/**
 * Creates a "Tutorial" button.
 * When clicked, the button will create a modal and fill it with the tutorial's content
 */
module.exports = function createBtn() {
    let btn = <a className="cfpp-tutorial-btn" style="cursor: pointer;"> Tutorial </a>;
    dom.on(btn, 'click', () => {
        loadModal();
        showModal();
    });

    // Load the tutorial if we're idle
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadModal, { timeout: 10000 });
    }

    dom.$('.second-level-menu-list').appendChild( <li>{btn}</li> );
}
/**
 * @file Adds a button to easily check the editorial/tutorial for a problem
 */

import dom from '../helpers/dom';
import env from '../env/env';

let modalLoaded = false;

function showModal() {
    dom.$('.cfpp-tutorial').classList.remove('cfpp-hidden');
}

function closeModal() {
    dom.$('.cfpp-tutorial').classList.add('cfpp-hidden');
}

/**
 * Queries the tutorial page and resolves with the HTML *string* returned by the Codeforces API
 * Assumes the document has been loaded completely already (because install() is decorated with env.ready)
 * @param {String} problemCode - see getProblemCode()
 * @returns {Promise<String>}
 */
const getTutorialHTML = problemCode => new Promise(function(resolve, reject) {
    const csrf = env.global.Codeforces.getCsrfToken();

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/data/problemTutorial');

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhr.setRequestHeader('X-Csrf-Token', csrf);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.responseType = 'json';

    xhr.onload = () => {
        if (xhr.response && xhr.response.success) {
            resolve(xhr.response.html);
        } else {
            reject("couldn't query the API");
        }
    };

    xhr.onerror = () => reject("couldn't query the API");

    xhr.send(`problemCode=${problemCode}&csrf_token=${csrf}`);
});

/**
 * @returns {String} the problem code
 * @example extractProblemCode("/contest/998/problem/D") //=> "998D"
 */
async function extractProblemCode(url) {
    let matches = url.match(/\/problemset\/problem\/(\d+)\/(.+)|\/contest\/(\d+)\/problem\/(.+)/i);
    if (matches[1])
        return matches[1] + matches[2];
    if (matches[3])
        return matches[3] + matches[4];

    throw "couldn't get problem code from URL";
}

async function loadModal(deadline) {
    if (modalLoaded || !deadline) {
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

    return extractProblemCode(location.pathname)
          .then (getTutorialHTML)
          .then (html => modalInner.innerHTML = html)
          .then (() => MathJax.Hub.Queue(() => MathJax.Hub.Typeset(modalInner)))
          .catch (err => modalInner.innerText = `Failed to load the tutorial: ${err}`);
}

/**
 * Creates a "Tutorial" button.
 * When clicked, the button will create a modal and fill it with the tutorial's content
 */
export const install = env.ready(function() {
    const problemRegex = /\/problemset\/problem\/|\/contest\/\d+\/problem\/\w/i;
    if (!problemRegex.test(location.pathname)) return;

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
});

export function uninstall() { }
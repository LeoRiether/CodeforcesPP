/**
 * @file Hides/Shows "on test X" in verdicts
 */

let dom = require('./dom');
let config = require('./config');

/**
 * "Wrong answer on test " => "Wrong answer"
 * @param e - a text node
 */
function isolateVerdict(e) {
    const idx = e.nodeValue.indexOf(' on test');
    if (idx !== -1) {
        e.nodeValue = e.nodeValue.substring(0, idx);
    }
}

let ready = false;
function init() {
    if (ready) return;
    ready = true;

    // Proxy Codeforces.showMessage to hide the test case
    if (Codeforces && Codeforces.showMessage) {
        let _showMessage = Codeforces.showMessage;

        Codeforces.showMessage = function (message) {
            if (config.get('hideTestNumber')) {
                const index = message.indexOf(' on test');
                if (index !== -1) {
                    message = message.substring(0, index);
                }    
            }
            _showMessage(message);
        };
    }

    // Subscribe to Codeforces submisions pubsub
    if (window.submissionsEventCatcher) {
        const channel = window.submissionsEventCatcher.channels[0];
        window.submissionsEventCatcher.subscribe(channel, data => {
            if (!config.get('hideTestNumber')) return;

            if (data.t === 's') {
                const el = dom.$(`[data-a='${data.d[0]}'] .status-verdict-cell span`);
                if (el)
                    isolateVerdict(el.childNodes[0]);
            }
        });
    }
}


function hide() {
    init();

    config.set('hideTestNumber', true);

    document.documentElement.classList.add('verdict-hide-number');

    dom.$$('.verdict-rejected,.verdict-waiting')
        .forEach(e => isolateVerdict(e.childNodes[0]));
}

function show() {
    config.set('hideTestNumber', false);
    
    if (!document.documentElement.classList.contains('verdict-hide-number')) return;
    document.documentElement.classList.remove('verdict-hide-number');

    dom.$$('.verdict-rejected,.verdict-waiting')
        .forEach(e => {
            e.childNodes[0].nodeValue += ' on test ';
        });
}

function toggle() {
    if (config.get('hideTestNumber')) {
        show();
    } else {
        hide();
    }
}

module.exports = { hide, show, toggle, init };
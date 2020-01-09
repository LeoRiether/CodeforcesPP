/**
 * @file Hides/Shows "on test X" in verdicts
 */

const dom = require('../helpers/dom');
const config = require('../env/config');
const { safe } = require('../helpers/Functional');

const pluckVerdictRegex = / on (pre)?test ?\d*$/;
const pluckVerdict = s => s.replace(pluckVerdictRegex, '');

const pluckVerdictOnNode = safe(n => {
    let c = n.childNodes[0];
    c.nodeValue = pluckVerdict(c.nodeValue);
}, '');

let ready = false;
export function init() {
    // !
    // TODO: this doesn't work on the browser extension!!!
    // !

    if (ready) return;
    ready = true;

    // Proxy Codeforces.showMessage to hide the test case
    if (Codeforces && Codeforces.showMessage) {
        let _showMessage = Codeforces.showMessage;

        Codeforces.showMessage = function (message) {
            if (config.get('hideTestNumber')) {
                message = pluckVerdict(message);
            }
            _showMessage(message);
        };
    }

    // Subscribe to Codeforces submisions pubsub
    if (unsafeWindow.submissionsEventCatcher) {
        const channel = unsafeWindow.submissionsEventCatcher.channels[0];
        unsafeWindow.submissionsEventCatcher.subscribe(channel, data => {
            if (!config.get('hideTestNumber')) return;

            if (data.t === 's') {
                const el = dom.$(`[data-a='${data.d[0]}'] .status-verdict-cell span`);
                pluckVerdictOnNode(el);
            }
        });
    }
}


export function install() {
    if (!config.get('hideTestNumber')) return;

    init();

    document.documentElement.classList.add('verdict-hide-number');

    dom.$$('.verdict-rejected,.verdict-waiting')
        .forEach(pluckVerdictOnNode);
}

export function uninstall() {
    if (!document.documentElement.classList.contains('verdict-hide-number')) return;
    document.documentElement.classList.remove('verdict-hide-number');

    dom.$$('.verdict-rejected,.verdict-waiting')
        .forEach(e => {
            e.childNodes[0].nodeValue += ' on test ';
        });
}

export function toggle() {
    config.set('hideTestNumber', !config.get('hideTestNumber'));
}
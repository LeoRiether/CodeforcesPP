/**
 * @file Hides tags on the /problemset page for the problems you didn't solve yet
 */

const dom = require('../helpers/dom');
const config = require('../env/config');
const env = require('../env/env');

const changeNoACsDisplay = env.ready(function (display) {
    // Get problems that don't have an AC
    let noACs = dom.$$('.problems tr:not(.accepted-problem)');
    for (let p of noACs) {
        // Hide them hackfully!
        let k = p.children[1].children[1] || {};
        k = k.style || {};
        k.display = display;
    }
});

export function install() {
    if (config.get('showTags') && dom.$('.problems'))
        changeNoACsDisplay('none');
}

export const uninstall = changeNoACsDisplay.bind(null, 'block');
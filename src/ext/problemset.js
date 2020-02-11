/**
 * @file Hides tags on the /problemset page for the problems you didn't solve yet
 */

import dom from '../helpers/dom';
import * as config from '../env/config';
import env from '../env/env';

function changeNoACsDisplay(display) {
    // Get problems that don't have an AC
    let noACs = dom.$$('.problems tr:not(.accepted-problem)');
    for (let p of noACs) {
        // Hide them hackfully!
        let k = p.children[1].children[1] || {};
        k = k.style || {};
        k.display = display;
    }
}

export const install = env.ready(function() {
    if (config.get('showTags') && dom.$('.problems'))
        changeNoACsDisplay('none');
});

export const uninstall = () => changeNoACsDisplay('block');
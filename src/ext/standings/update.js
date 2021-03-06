/**
 * @file Updates the standings page automatically after some given interval
 */

import dom from '../../helpers/dom';
import env from '../../env/env';
import * as config from '../../env/config';
import * as events from '../../helpers/events';
import { getStandingsPageContent, runScripts } from './common';

// FIXME: cf-predictor deltas dissapear after reloading standings

/**
 * Updates the main standings and fires the "standings updated" event
 */
function update() {
    // Load the main standings
    const upd = getStandingsPageContent(location.href)
        .then(env.ready(content => {
            dom.$('#pageContent').replaceWith(content);
            return content;
        }))
        .catch(err => console.error("Couldn't load the standings. Reason: ", err));

    const evt = events.fire('standings updated');

    // After everything has been updated, run the scripts
    Promise.all([ upd, evt ])
        .then(([ content, _ ]) => runScripts(content));
}

let intervalID = 0;
export function install() {
    if (intervalID)
        uninstall();

    const standingsItv = +config.get('standingsItv');
    if (standingsItv > 0 && location.pathname.includes('/standings')) {
        intervalID = setInterval(update, standingsItv * 1000);
    }
}

export function uninstall() {
    clearInterval(intervalID);
    intervalID = 0;
}
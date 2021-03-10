/**
 * @file Manages the "twin" standings container.
 * If you're in the div1 standings, the twin will be div2, or vice versa.
 */

import dom from '../../helpers/dom';
import env from '../../env/env';
import * as config from '../../env/config';
import * as events from '../../helpers/events';
import { getStandingsPageContent, runScripts } from './common';
import { once } from '../../helpers/Functional';

// Returns a bunch of information about the current contest
function gatherInfo() {
    const pageContent = dom.$('#pageContent');
    const name = dom.$('.contest-name', pageContent).innerText;
    const id = +/\/contest\/(\d+)\//.exec(location.href)[1]; // just finds the /contest/{ID} and converts to a number
    const div = +(/Div\. (\d)/i.exec(name) || [])[1];
    const twinID = div == 1 ? (id + 1) : (id - 1);
    return { pageContent, name, id, div, twinID };
}

const verifyTwinExists = once(async info => {
    if (info.div != 1 && info.div != 2)
        return false;

    const API_URL = contestID => `//codeforces.com/api/contest.standings?contestId=${contestID}&count=1&from=1`;

    let curFetch = fetch(API_URL(info.id))
        .then(res => res.json());

    let twinFetch = fetch(API_URL(info.twinID))
        .then(res => res.json());

    // Contests are twins if they start at the same time!
    return Promise.all([curFetch, twinFetch])
        .then(([cur, twin]) => (cur.status == 'OK' && twin.status == 'OK' &&
                                cur.result.contest.startTimeSeconds == twin.result.contest.startTimeSeconds));
});

const twinURL = once(info =>
    location.href.replace(`/${info.id}/`, `/${info.twinID}/`));

/**
 * Updates the container for the twin standings
 */
export const update = env.ready(function() {
    let container = dom.$('#cfpp-twin-standings');
    if (!container)
        return;

    const url = twinURL();
    return getStandingsPageContent(url)
        .then(content => {
            dom.$('.toggle-show-unofficial', content).remove();
            dom.$('.source-and-history-div', content).remove();
            dom.$('.history-div', content).remove();
            dom.$('.second-level-menu', content).remove();

            if (container.children.length) {
                container.children[0].replaceWith(content);
            } else {
                container.appendChild(content);
            }
        })
        .catch(err => console.error("Couldn't load twin standings. Reason: ", err));
});

const listenToStandingsUpdates = once(() =>
    events.listen('standings updated', update) // If the main standings updated, we should too
);

export const install = env.ready(async function() {
    const shouldInstall = config.get('standingsTwin');
    const isProblemsetStandings = location.pathname.includes('/problemset/standings');
    const isStandings = location.pathname.includes('/standings');
    if (!shouldInstall || isProblemsetStandings || !isStandings)
        return;

    let info = gatherInfo();
    if (!await verifyTwinExists(info))
        return;

    // Initialize twinURL (only runs once and memoizes result, so we can call without `info` later)
    // kind of a hack, I'm sorry
    twinURL(info);

    // Create standings container
    let container = <div id="cfpp-twin-standings"></div>;
    info.pageContent.parentNode.appendChild(container);

    update().then(() => runScripts(container));
    listenToStandingsUpdates();
});

export function uninstall() {
    let container = dom.$('#cfpp-twin-standings');
    if (container)
        container.remove();
}
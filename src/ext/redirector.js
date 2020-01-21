/**
 * @file Replaces links to pages you often don't want to go to. e.g. '/members' in the groups page, where you'd rather go directly to '/contests'
 */

import dom from '../helpers/dom';
import config from '../env/config';

// Replaces /members by /contests on the groups page
function groups() {
    dom.$$('.datatable a.groupName')
        .forEach(link => link.href = link.href.replace('/members', '/contests'));
}


// Redirects every /standings page to a 'friends only' standings page
function friendsStandings() {
    let links = document.getElementsByTagName('a');
    for (let link of links) {
        if (link.href.endsWith('/standings')) {
            link.href += '/friends/true';
        }
    }
}

// Redirects contest registrants to friends registrants
function registrants() {
    dom.$$('.contestParticipantCountLinkMargin').forEach(e => e.href += '/friends/true');
}

// Redirects /problemset/standings to the contest standings you actually want
function problemsetStandings(contestID) {
    let links = dom.$$('.second-level-menu-list a');
    for (let link of links) {
        if (link.href.endsWith('/problemset/standings')) {
            link.href = link.href.replace('problemset', 'contest/' + contestID);
            return;
        }
    }
}

// Adds a /virtual button on gym pages
function gymVirtual() {
    dom.$('#sidebar').children[0].insertAdjacentHTML('afterend', `
        <div class="roundbox sidebox">
            <div class="caption titled">→ Virtual participation</div>
            <form style="text-align:center; margin:1em;" action="${location.href}/virtual" method="get">
                <input type="submit" value="Start virtual contest">
            </form>
        </div>
    `);
}

export function install() {
    if ((/\/groups\/with\//i).test(location.pathname)) {
        groups();
    }

    // Always do this *before* friendsStandings() because of endsWith('/problemset/standings')
    const contestIDMatch = location.pathname.match(/problemset\/problem\/(\d+)/i);
    if (contestIDMatch) {
        problemsetStandings(contestIDMatch[1]);
    }

    if (config.get('defStandings') == 'Friends' && !/\/standings/i.test(location.pathname)) {
        friendsStandings();
    }

    if (dom.$('.contestParticipantCountLinkMargin')) {
        registrants();
    }

    // /gym/:ID or /group/:GroupID/contest/:ID
    if (/gym\/\d+$/i.test(location.pathname) || /group\/[a-zA-Z0-9]+\/contest\/\d+$/i.test(location.pathname)) {
        gymVirtual();
    }
}

export function uninstall() { }
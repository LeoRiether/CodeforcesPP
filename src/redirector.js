/**
 * @file Replaces links to pages you often don't want to go to. e.g. '/members' in the groups page, where you'd rather go directly to '/contests'
 */

let dom = require('./dom');
let config = require('./config');

// Replaces /members by /contests on the groups page
function groups() {
    let links = dom.$$('.datatable a.groupName');
    for (let link of links) {
        link.href = link.href.replace("/members", "/contests");
    }
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
    dom.$('.contestParticipantCountLinkMargin').href += '/friends/true';
}

// Redirects /problemset/standings to the contest standings you actually want
function problemsetStandings(contestID) {
    let links = dom.$$('.second-level-menu-list a');
    for (let link of links) {
        if (link.href.endsWith('/problemset/standings')) {
            link.href = link.href.replace('problemset', contestID);
            break;
        }
    }
}

module.exports = function() {
    if ((/\/groups\/with\//i).test(location.pathname)) {
        groups();
    }

    // Always do this *before* friendsStandings() because of endsWith('/problemset/standings')
    const contestIDMatch = location.pathname.match(/problemset\/problem\/(\d+)/i);
    if (contestIDMatch.length > 0) {
        problemsetStandings(contestIDMatch.groups[1]);
    }

    if (config.get('defStandings') == 'Friends' && !/\/standings/i.test(location.pathname)) {
        friendsStandings();
    }

    if (dom.$('.contestParticipantCountLinkMargin')) {
        registrants();
    }
};
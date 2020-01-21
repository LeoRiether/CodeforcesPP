/**
 * @file Provides drowdown menus for the main navbar, for better site navigation
 */

import dom from '../helpers/dom';
import env from '../env/env';

export const install = env.ready(async function() {
    const handle = await env.userHandle;

    let oldNav = dom.$('.main-menu-list');
    let newNav = <nav className="cfpp-navbar"/>;

    // Without this the dropdowns don't appear
    oldNav.parentNode.parentNode.style.overflow = 'visible';

    let keys = {
        "/": {},
        "/groups": {
            "My Groups": `/groups/with/${handle}`,
            "My Teams": `/teams/with/${handle}`,
        },
        "/problemset": {
            "Status": "/problemset/status",
            "Friends Status": "/problemset/status?friends=on",
            "My Submissions": `/submissions/${handle}`,
            "Favourites": `/favourite/problems`,
            "ACM SGU": "/problemsets/acmsguru",
        },
        "/contests": {
            "My Contests": `/contests/with/${handle}`,
            "My Problems": `/contests/writer/${handle}`,
        },
        "/gyms": {
            "Mashups": "/mashups",
        },
        "/ratings": {
            "Friends": "/ratings/friends/true",
        },
    };

    let other = <div className="cfpp-navbar-item">
                    <a href="#">Other</a>
                </div>;
    let ddOther = <div className="cfpp-dropdown" />;

    // Iterate over all nav items and include them the new navbar
    for (let item of oldNav.children) {
        let link = item.children[0]; // <a> tag

        let newItem = <div className="cfpp-navbar-item">{link}</div>

        // Add dropdown menu, if needed
        const href = link.getAttribute('href');
        if (keys[href]) {
            let dropdown = <div className="cfpp-dropdown"/>

            for (let ddText in keys[href]) {
                dropdown.appendChild(
                    <a href={keys[href][ddText]}>
                        {ddText}
                    </a>
                );
            }

            if (dropdown.children.length) {
                newItem.appendChild(dropdown);
            }
            newNav.appendChild(newItem);
        } else {
            ddOther.appendChild(<a href={href}>{link}</a>);
        }
    }

    other.appendChild(ddOther);
    newNav.appendChild(other);

    oldNav.replaceWith(newNav);

    // Change Codeforces logo to Codeforces++
    let logo = dom.$('#header img');
    if (logo && logo.getAttribute('src').endsWith('codeforces-logo-with-telegram.png')) {
        logo.setAttribute('src', 'https://github.com/LeoRiether/CodeforcesPP/raw/master/assets/codeforcespp.png');
    }
});

export function uninstall() {}
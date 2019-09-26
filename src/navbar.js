/**
 * @file Provides drowdown menus for the main navbar, for better site navigation
 */

let dom = require('./dom');

module.exports = function() {
    // Get user handle
    const handle = dom.$('.lang-chooser').children[1].children[0].innerText.trim();

    let oldNav = dom.$('.main-menu-list');
    let newNav = dom.element('nav', { className: 'cfpp-navbar' });

    // Without this the dropdowns don't appear
    oldNav.parentNode.parentNode.style.overflow = 'visible';

    let keys = {
        "/groups": {
            "My Groups": `/groups/with/${handle}`,
            "My Teams": `/teams/with/${handle}`,
        },
        "/problemset": {
            "Status": "/problemset/status",
            "Friends Status": "/problemset/status?friends=on",
            "My Submissions": `/submissions/${handle}`,
            "Favourites": `/favourite/problems`,
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

    // Iterate over all nav items and include them the new navbar
    for (let item of oldNav.children) {
        let link = item.children[0]; // <a> tag

        // Create new item and append the old <a> to it
        let newItem = dom.element('div', {
            className: 'cfpp-navbar-item',
            children: [ link ],
        });

        // Add dropdown menu, if needed 
        const href = link.getAttribute('href');
        if (keys[href]) {
            let dropdown = dom.element('div', { className: 'cfpp-dropdown' });

            for (let ddText in keys[href]) {
                let ddItem = dom.element('a', {
                    innerText: ddText,
                    href: keys[href][ddText]
                });
                dropdown.appendChild(ddItem);
            }

            newItem.appendChild(dropdown);
        }

        newNav.appendChild(newItem);
    }

    oldNav.replaceWith(newNav);


    // Create styling for the new menu
    const style = `
    .cfpp-navbar {
        margin-left: 1.5em;
    }
    .cfpp-navbar-item {
        display: inline-block;
        position: relative;
        margin-right: 1.5em;
    }
    .cfpp-navbar-item>a {
        color: #212121;
    }
    .cfpp-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        width: 200%;
        z-index: 99;
        display: none;
        background: #212121;
        padding: 1em;
        box-shadow: 1px 7px 19px #00000054;
    }
    .cfpp-dropdown a {
        display: block;
        color: #E0E0E0;
    }
    .cfpp-navbar-item:hover .cfpp-dropdown,
    .cfpp-navbar-item:focus-within .cfpp-dropdown {
        display: block;
    }
    `;

    let styleTag = dom.element('style', { innerHTML: style });    
    document.body.appendChild(styleTag);
};
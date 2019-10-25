/**
 * @file Adds a search pop-up to navigate Codeforces
 */

let dom = require('./dom');
let config = require('./config');

let isOpen = false;

//! Idea: give every searchable a fuzzy distance number based on the input,
//! then sort by this criteria and hide every searchable below a certain threshold.
//! As we've gotta move stuff around, its' probably best to implement a virtual DOM system
//!
//! Idea rejected! New, simpler system: filter by subsequence match and sort by last time clicked only once

// TODO: every info I need is pulled from the DOM. Refactor to have a JS model of the search that syncs with the html

/**
 * Kinda like a React component
 * I'm basically rolling my own React at this point
 */
function Result(props) {
    if (props.href) {
        return (
            <li data-key={props.key} data-search={props.title.toLowerCase()}>
                <a href={props.href}>{props.title}</a>
            </li>
        );
    } else {
        return (
            <li data-key={props.key} data-search={props.title.toLowerCase()}>
                  <a href="#" onClick={props.onClick}>{props.title}</a>
            </li>
        );
    }
}

let extensions = {
    common(handle) {
        return [
            { key: "contests",   title: "Contests",       href: "/contests" },
            { key: "problemset", title: "Problemset",     href: "/problemset" },
            { key: "psetting",   title: "Problemsetting", href: `/contests/with/${handle}` },
            { key: "subms",      title: "Submissions",    href: `/submissions/${handle}` },
            { key: "groups",     title: "Groups",         href: `/groups/with/${handle}` },
            { key: "profile",    title: "Profile",        href: `/profile/${handle}` },
            { key: "cfviz",      title: "CfViz",          href: "https://cfviz.netlify.com" },
            { key: "favs",       title: "Favourites",     href: "/favourite/problems" },
            { key: "teams",      title: "Teams",          href: `/teams/with/${handle}` },
            { key: "status",     title: "Status",         href: "/problemset/status" },
            { key: "fstatus",    title: "Friends Status", href: "/problemset/status?friends=on" },
            { key: "gym",        title: "Gym",            href: "/gyms" },
            { key: "blog",       title: "Blog",           href: `/blog/handle/${handle}` },
            { key: "mashups",    title: "Mashups",        href: "/mashups" },
            { key: "rating",     title: "Rating",         href: "/ratings" }
        ];
    },

    problem() {
        return [
            { 
                key: "tutorial", 
                title: "Problem: Tutorial", 
                onClick() {
                    close();
                    dom.$('.cfpp-tutorial-btn').click();  
                }
            },
            {
                key: "submit",
                title: "Problem: Submit",
                onClick() {
                    close();
                    dom.$('#sidebar .submit').click()
                }
            }
        ];
    },

    contest(baseURL, id, isGym) {
        const name = isGym ? 'Gym' : 'Contest';
        baseURL += `${name.toLowerCase()}/${id}`;
        const standingsFriends = config.get('defStandings') === 'Friends' ? '/friends/true' : '';
        return [
            { key: "cstandings",   title: `${name}: Standings`,         href: `${baseURL}/standings/${standingsFriends}` },
            { key: "cproblems",    title: `${name}: Problems`,          href: `${baseURL}` },
            { key: "csubmit",      title: `${name}: Submit`,            href: `${baseURL}/submit` },
            { key: "csubmissions", title: `${name}: Submissions`,       href: `${baseURL}/my` },
            { key: "cinvoc",       title: `${name}: Custom Invocation`, href: `${baseURL}/customtest` },
            { key: "cstatus",      title: `${name}: Status`,            href: `${baseURL}/status` },
            { key: "virtual",      title: `${name}: Virtual`,           href: `${baseURL}/virtual` }
        ];
    },

    groups() {
        try {
            return (JSON.parse(localStorage.userGroups) || [])
                .map(([name, id]) => {
                    if (!(/^[\d\w]+$/).test(id)) {
                        // Backwards compatibility with [name, href]
                        id = id.match(/\/group\/([\d\w]+)/)[1];
                    }

                    return {
                        key: `group_${id}`,
                        title: `Group: ${name}`,
                        href: `/group/${id}/contests`
                    }
                });
        } catch {
            return [];
        }
    },
};

/**
 * Bind search and navigation events (Input, ArrowDown, ArrowUp, ...)
 */
function bindEvents(input, results) {
    dom.on(input, 'input', () => {
        const value = input.value.toLowerCase();
        for (let r of results.children) {
            if (includesSubseq(r.dataset.search, value)) {
                r.style.display = "";
            } else {
                r.style.display = "none";
            }
        }
    });

    dom.on(input, 'keydown', e => {
        if (e.key == 'Enter') {
            for (let r of results.children) {
                if (r.style.display == "") {
                    r.children[0].click();
                    increasePriority(r.dataset.key);
                    close();
                    break;
                }
            }
        } else if (e.key == 'ArrowUp') {
            let focus = results.children[results.children.length-1];
            while (focus && focus.style.display != "")
                focus = focus.previousElementSibling;
            
            if (focus !== null) {
                focus.children[0].focus();
                focus.children[0].scrollIntoViewIfNeeded();
            }
            e.preventDefault();
        } else if (e.key == 'ArrowDown') {
            let focus = results.children[0];
            while (focus && focus.style.display != "")
                focus = focus.nextElementSibling;
            
            if (focus !== null) {
                focus.children[0].focus();
                focus.children[0].scrollIntoViewIfNeeded();
            }
            e.preventDefault();
        }
    });

    dom.on(results, 'keydown', e => {
        let sibling = undefined;
        if (e.key == 'ArrowDown') {
            sibling = document.activeElement.parentElement.nextElementSibling;
            while (sibling && sibling.style.display != "") {
                sibling = sibling.nextElementSibling;
            }
        } else if (e.key == 'ArrowUp') {
            sibling = document.activeElement.parentElement.previousElementSibling;
            while (sibling && sibling.style.display != "") {
                sibling = sibling.previousElementSibling;
            }
        }

        if (sibling === null) { // no sibling
            input.focus();
            putCursorAtEnd(input);
            results.scrollTop = 0;
            e.preventDefault(); // prevent putCursorAtEnd from not working correctly, and scrolling
        } else if (sibling !== undefined) { // there's a sibling
            sibling.children[0].focus();
            sibling.children[0].scrollIntoViewIfNeeded();
            e.preventDefault(); // prevent scrolling
        }
    });

    dom.on(results, 'click', e => {       
        increasePriority(e.target.parentElement.dataset.key);
    });
}

function resultList() {
    // Get user handle
    const handle = dom.$('.lang-chooser').children[1].children[0].innerText.trim();

    let data = [];
    if (/\/problemset\/problem\/|\/contest\/\d+\/problem\/\w/i.test(location.pathname)) {
        data = data.concat(extensions.problem());
    }

    // Is it a contest?
    let contestMatch = location.href.match(/\/contest\/(\d+)/i);
    if (contestMatch) {
        const baseURL = location.href.substring(0, location.href.indexOf('contest'));
        data = data.concat(extensions.contest(baseURL, contestMatch[1], false));
    }
    
    // Is it a gym contest?
    contestMatch = location.href.match(/\/gym\/(\d+)/i);
    if (contestMatch) {
        const baseURL = location.href.substring(0, location.href.indexOf('gym'));
        data = data.concat(extensions.contest(baseURL, contestMatch[1], true));
    }

    data = data.concat(extensions.groups());
    data = data.concat(extensions.common(handle));

    // Sort the data by priority
    let priority;
    try {
        priority = JSON.parse(localStorage.finderPriority) || {};
    } catch {
        priority = {};
    }
    data = data.sort((a, b) => (priority[b.key] || 0) - (priority[a.key] || 0));    

    return data;   
}

// Create can be called many times, but will only create the finder once
// Returns a promise
let createPromise = undefined;
function create() {
    if (createPromise !== undefined) {
        return createPromise;
    }
    
    createPromise = new Promise((res, rej) => {
        let input = <input type="text" className="finder-input" placeholder="Search anything"/>;
        let results = <ul className="finder-results" />;

        let modal = 
            <div className="cfpp-modal cfpp-hidden" tabindex="0">
                <div className="cfpp-modal-background" onClick={close}/>
                <div className="finder-inner" tabindex="0">
                    {input}
                    {results}
                </div>
            </div>;

        dom.on(document, 'keyup', e => {
            if (e.key == 'Escape')
                close();
        });

        results.append(...resultList().map(props => 
            <Result {...props} />
        ));

        bindEvents(input, results);

        document.body.appendChild(modal);
        res({ modal, input, results });
    });
    return createPromise;
}

async function open() {
    if (isOpen) return;
    isOpen = true;
    let { modal, input } = await create();
    modal.classList.remove('cfpp-hidden');
    input.focus();
}

async function close() {
    if (!isOpen) return;
    isOpen = false;
    let { modal, input, results } = await create();
    modal.classList.add('cfpp-hidden');
    input.value = "";
    [].forEach.call(results.children, r => r.style.display = "");
}

/**
 * Increases the priority of a finder key in localStorage.finderPriority
 */
function increasePriority(key) {
    let fp;
    try {
        fp = JSON.parse(localStorage.finderPriority) || {};
    } catch {
        fp = {};
    }

    fp[key] = (fp[key] || 0) + 1;
    localStorage.finderPriority = JSON.stringify(fp);
}

/**
 * Puts the cursor at the end in an input element
 */
function putCursorAtEnd(input) {
    let pos = input.value.length;
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(pos, pos);
    }
    else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}
  
function includesSubseq(text, pattern) {
    if (pattern.length == 0) {
        return true;
    }

    let p = pattern.length - 1;
    for (let i = text.length-1; i >= 0; i--) {
        if (text[i] == pattern[p]) {
            p--;
        }

        if (p < 0) {
            return true;
        }
    }

    return false;
}

function updateGroups() {
    const handle = dom.$('.lang-chooser').children[1].children[0].innerText.trim();
    if (location.href.endsWith(`/groups/with/${handle}`)) {
        // Opportune moment to update the user's groups
        const idRegex = /\/group\/([\d\w]+)/
        let extractID = (group) => {
            return idRegex.exec(group)[1];
        };

        let groups = [].map.call(
            dom.$$('.groupName'),
            el => [el.innerText.trim(), extractID(el.href)]);
        localStorage.userGroups = JSON.stringify(groups);
    }
}

module.exports = { create, open, close, updateGroups };
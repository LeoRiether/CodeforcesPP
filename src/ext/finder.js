/**
 * @file Adds a search pop-up to navigate Codeforces
 */

import dom from '../helpers/dom';
import config from '../env/config';
import { safe, pipe, map } from '../helpers/Functional';
import env from '../env/env';

let isOpen = false;

const safeJSONParse = safe(JSON.parse, {});

// TODO: every info I need is pulled from the DOM. Refactor to have a JS model of the search that syncs with the html

/**
 * Kinda like a React component
 * I'm basically rolling my own React at this point
 */
function Result(props) {
    if (!props.href && !props.onClick) {
        console.error(`Codeforces++ Error!\n` +
                      `Please report this on the GitHub: github.com/LeoRiether/CodeforcesPP\n` +
                      `<Result> was created without any action attached. title=${props.title}.`);
    }

    return (
        <li data-key={props.key} data-search={props.title.toLowerCase()}>
            { props.href ?
                    <a href={props.href}>{props.title}</a> :
                    <a href="#" onClick={props.onClick}>{props.title}</a> }
        </li>
    )
}

let extensions = {
    common(handle) {
        // TODO: consider changing to JSON.parse for performance reasons
        return [
            { key: "contests",   title: "Contests",         href: "/contests" },
            { key: "problemset", title: "Problemset",       href: "/problemset" },
            { key: "psetting",   title: "Problemsetting",   href: `/contests/with/${handle}` },
            { key: "subms",      title: "Submissions",      href: `/submissions/${handle}` },
            { key: "groups",     title: "Groups",           href: `/groups/with/${handle}` },
            { key: "profile",    title: "Profile",          href: `/profile/${handle}` },
            { key: "cfviz",      title: "CfViz",            href: "https://cfviz.netlify.com" },
            { key: "favs",       title: "Favourites",       href: "/favourite/problems" },
            { key: "teams",      title: "Teams",            href: `/teams/with/${handle}` },
            { key: "status",     title: "Status",           href: "/problemset/status" },
            { key: "fstatus",    title: "Friends Status",   href: "/problemset/status?friends=on" },
            { key: "gym",        title: "Gym",              href: "/gyms" },
            { key: "blog",       title: "Blog",             href: `/blog/handle/${handle}` },
            { key: "mashups",    title: "Mashups",          href: "/mashups" },
            { key: "rating",     title: "Rating",           href: "/ratings" }
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
                    dom.$('#sidebar [name=sourceFile]').click();
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
            { key: "invoc",        title: `${name}: Custom Invocation`, href: `${baseURL}/customtest` },
            { key: "cstatus",      title: `${name}: Status`,            href: `${baseURL}/status` },
            { key: "virtual",      title: `${name}: Virtual`,           href: `${baseURL}/virtual` }
        ];
    },

    groups() {
        const makeRecordFromGroup = ([name, id]) => ({
            key: `group_${id}`,
            title: `Group: ${name}`,
            href: `/group/${id}/contests`
        });

        const makeGroups = pipe(
            safe(JSON.parse, []),
            map(makeRecordFromGroup)
        );
        return makeGroups(localStorage.userGroups);
    },
};

/**
 * Bind search and navigation events (Input, ArrowDown, ArrowUp, ...)
 */
function bindEvents(input, results) {
    function updateDisplay(value) {
        value = value.toLowerCase();
        return result =>
            result.style.display = includesSubseq(result.dataset.search, value) ? "" : "none";
    }

    dom.on(input, 'input', () => {
        [].forEach.call(results.children, updateDisplay(input.value));
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

async function resultList() {
    const handle = await env.userHandle;

    let data = [];
    if (/\/problemset\/problem\/|\/contest\/\d+\/problem\/\w/i.test(location.pathname)) {
        data = data.concat(extensions.problem());
    }

    const contestMatch = location.href.match(/\/contest\/(\d+)/i);
    const gymMatch = contestMatch || location.href.match(/\/gym\/(\d+)/i); // only executes if contest didn't match
    if (contestMatch) {
        // Is it a contest?
        const baseURL = location.href.substring(0, location.href.indexOf('contest'));
        data = data.concat(extensions.contest(baseURL, contestMatch[1], false));
    } else if (gymMatch) {
        // Is it a gym contest?
        const baseURL = location.href.substring(0, location.href.indexOf('gym'));
        data = data.concat(extensions.contest(baseURL, gymMatch[1], true));
    } else {
        // If it's neither, we have to put the problemset's Custom Invocation in the data
        data.push({ key: "invoc", title: "Custom Invocation", href: "/problemset/customtest" });
    }

    data = data.concat(extensions.groups());
    data = data.concat(extensions.common(handle));

    // Sort the data by priority
    let priority = safeJSONParse(localStorage.finderPriority);
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

    createPromise = new Promise(async (res, rej) => {
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

        const list = await resultList();
        results.append(...list.map(props =>
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
async function increasePriority(key) {
    let fp = safeJSONParse(await env.storage.get('finderPriority'));

    const maxValue = Object.values(fp).reduce((x, y) => Math.max(x, y), 0);
    fp[key] = maxValue + 1;
    env.storage.set('finderPriority', fp);
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

async function updateGroups() {
    const handle = await env.userHandle;
    if (location.href.endsWith(`/groups/with/${handle}`)) {
        // Opportune moment to update the user's groups
        const idRegex = /\/group\/([\d\w]+)/
        const extractID = group => {
            return idRegex.exec(group)[1];
        };

        let groups = [].map.call(
            dom.$$('.groupName'),
            el => [el.innerText.trim(), extractID(el.href)]);
        localStorage.userGroups = JSON.stringify(groups);
    }
}

export { create, open, close, updateGroups };
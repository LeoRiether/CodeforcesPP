/**
 * @file Adds a search pop-up to navigate Codeforces
 */

import dom from '../helpers/dom';
import * as config from '../env/config';
import { safe, pipe, map, once, flatten } from '../helpers/Functional';
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
                      `Please report this on GitHub: https://github.com/LeoRiether/CodeforcesPP\n` +
                      `<Result> was created without any action attached. key=${props.key}.`);
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
            { key: "rating",     title: "Rating",           href: "/ratings" },
            { key: "api",        title: "API",              href: "/apiHelp" }
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
    // Random note: this is LISP, but without the parenthesis
    const updateDisplay = value => result =>
        result.style.display =
            includesSubseq(result.dataset.search, value.toLowerCase()) ?
                "" :     // visible
                "none";  // invisible

    const focus = result => {
        let c = result.children[0]; // <a> inside the result <li>
        c.focus();
        c.scrollIntoViewIfNeeded();
    };

    dom.on(input, 'input', () => {
        [].forEach.call(results.children, updateDisplay(input.value));
    });

    dom.on(input, 'keydown', e => {
        const visibleResults =
            Array.from(results.children)
            .filter(c => c.style.display == "");

        if (visibleResults.length == 0)
            return;

        if (e.key == 'Enter') {
            let chosen = visibleResults[0];
            chosen.children[0].click();
            increasePriority(chosen.dataset.key);
            close();
        }
        else if (e.key == 'ArrowUp') {
            focus(visibleResults[visibleResults.length - 1]);
            e.preventDefault();
        }
        else if (e.key == 'ArrowDown') {
            focus(visibleResults[0]);
            e.preventDefault();
        }
    });

    dom.on(results, 'keydown', e => {
        const visibleResults =
            Array.from(results.children)
            .filter(c => c.style.display == "");

        let i = visibleResults.indexOf(document.activeElement.parentElement);

        // Move to desired sibling
        if (e.key == 'ArrowDown') {
            i++;
        } else if (e.key == 'ArrowUp') {
            i--;
        } else {
            return;
        }

        if (i < 0 || i >= visibleResults.length) {
            input.focus();
            putCursorAtEnd(input);
            results.scrollTop = 0;
            e.preventDefault(); // prevent putCursorAtEnd from not working correctly, and scrolling
        } else {
            focus(visibleResults[i]);
            e.preventDefault(); // prevent scrolling
        }
    });

    dom.on(results, 'click', e => {
        increasePriority(e.target.parentElement.dataset.key);
    });
}

async function resultList() {
    const handle = await env.userHandle();

    let data = [];
    if (/\/problemset\/problem\/|\/contest\/\d+\/problem\/\w/i.test(location.pathname)) {
        data.push(extensions.problem());
    }

    const contestMatch = location.href.match(/\/contest\/(\d+)/i);
    const gymMatch = contestMatch || location.href.match(/\/gym\/(\d+)/i); // only executes if contest didn't match
    if (contestMatch) {
        // Is it a contest?
        const baseURL = location.href.substring(0, location.href.indexOf('contest'));
        data.push(extensions.contest(baseURL, contestMatch[1], false));
    } else if (gymMatch) {
        // Is it a gym contest?
        const baseURL = location.href.substring(0, location.href.indexOf('gym'));
        data.push(extensions.contest(baseURL, gymMatch[1], true));
    } else {
        // If it's neither, we have to put the problemset's Custom Invocation in the data
        data.push([{ key: "invoc", title: "Custom Invocation", href: "/problemset/customtest" }]);
    }

    data.push(extensions.groups());
    data.push(extensions.common(handle));

    data = flatten(data);

    // Sort the data by priority
    let priority = safeJSONParse(localStorage.finderPriority);
    data = data.sort((a, b) => (priority[b.key] || 0) - (priority[a.key] || 0));

    return data;
}

const create = once(async function() {
    let input = <input type="text" className="finder-input" placeholder="Search anything"/>;
    let results = <ul className="finder-results" />;

    let modal = (
        <div className="cfpp-modal cfpp-hidden" tabindex="0">
            <div className="cfpp-modal-background" onClick={close}/>
            <div className="finder-inner" tabindex="0">
                {input}
                {results}
            </div>
        </div>
    );

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
    return { modal, input, results };
});

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
    let fp = safeJSONParse(localStorage.finderPriority);

    const maxValue = Object.values(fp).reduce((x, y) => Math.max(x, y), 0);
    fp[key] = maxValue + 1;
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
    let p = pattern.length - 1;
    for (let i = text.length-1; i >= 0 && p >= 0; i--) {
        if (text[i] == pattern[p])
            p--;
    }

    return p < 0;
}

async function updateGroups() {
    const handle = await env.userHandle();
    if (location.href.endsWith(`/groups/with/${handle}`)) {
        // Opportune moment to update the user's groups
        const idRegex = /\/group\/([\d\w]+)/
        const extractID = group => idRegex.exec(group)[1];

        let groups = [].map.call(
            dom.$$('.groupName'),
            el => [el.innerText.trim(), extractID(el.href)]);
        localStorage.userGroups = JSON.stringify(groups);
    }
}

export { create, open, close, updateGroups };
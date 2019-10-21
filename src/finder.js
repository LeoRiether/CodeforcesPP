/**
 * @file Adds a search pop-up to navigate Codeforces
 */

let dom = require('./dom');

let isOpen = false;

//! Idea: give every searchable a fuzzy distance number based on the input,
//! then sort by this criteria and hide every searchable below a certain threshold.
//! As we've gotta move stuff around, its' probably best to implement a virtual DOM system

// TODO: every info I need is pulled from the DOM. Refactor to have a JS model of the search that syncs with the html

/**
 * Kinda like a React component
 * I'm basically rolling my own React at this point
 */
function Result(props) {
    return (
        <li data-search={props.text.toLowerCase()}>
            <a href={props.href}>{props.text}</a>
        </li>
    );
}

let extensions = {
    common(handle) {
        return [
            ["Contests", "/contests"], ["Problemset", "/problemset"], ["Problemsetting", `/contests/with/${handle}`], 
            ["Submissions", `/submissions/${handle}`], ["Groups", `/groups/with/${handle}`], ["Profile", `/profile/${handle}`], 
            ["CfViz", 'https://cfviz.netlify.com'], ["Favourites", '/favourite/problems'], ["Teams", `/teams/with/${handle}`], 
            ["Status", '/problemset/status'], ["Friends Status", '/problemset/status?friends=on'], ["Gym", '/gyms'], 
            ["Blog", `/blog/${handle}`], ["Mashups", '/mashups'], ["Rating", '/ratings'],
        ];
    },

    problem() {
        return [
            ["Problem: Tutorial", "javascript:document.querySelector('.cfpp-tutorial-btn').click()"],
            ["Problem: Submit", "javascript:document.querySelector('#sidebar .submit').click()"],
        ];
    },

    contest(baseURL, id, isGym) {
        const name = isGym ? 'Gym' : 'Contest';
        baseURL += `${name.toLowerCase()}/${id}`;
        return [
            [`${name}: Standings`, `${baseURL}/standings/friends/true`], // TODO: make friends: true work with config and within groups
            [`${name}: Problems`, `${baseURL}`],
            [`${name}: Submit`, `${baseURL}/submit`],
            [`${name}: Submissions`, `${baseURL}/my`],
            [`${name}: Custom Invocation`, `${baseURL}/customtest`],
            [`${name}: Status`, `${baseURL}/status`],
        ];
    },

    groups() {
        try {
            return (JSON.parse(localStorage.userGroups) || [])
                   .map(([name, href]) => [`Groups: ${name}`, href]);
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
            if (r.dataset.search.includes(value)) {
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
                    location.href = r.children[0].href; // it's an <a>
                    close();
                    break;
                }
            }
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

    if (location.href.endsWith(`/groups/with/${handle}`)) {
        // Opportune moment to update the user's groups
        let groups = [].map.call(
            dom.$$('.groupName'),
            el => [el.innerText.trim(), el.href]);
        localStorage.userGroups = JSON.stringify(groups);
    }
    data = data.concat(extensions.groups());

    data = data.concat(extensions.common(handle));
        
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

        results.append(...resultList().map(([text, href]) => 
            <Result text={text} href={href} />
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
  

module.exports = { create, open, close };
/**
 * @file Defines keyboards shortcuts to be used on all codeforces pages
 */

import dom from '../helpers/dom';
import * as finder from './finder';
import * as config from '../env/config';
import * as events from '../helpers/events';

//
// Commands
//

// Opens the file picker and focuses the submit button
function submit() {
    // Try getting the [choose a file] input
    let fileInput = document.getElementsByName('sourceFile');
    if (fileInput.length == 0) return;

    fileInput = fileInput[0];

    dom.on(window, 'focus', () => {
        const submitBtn = dom.$('.submit', fileInput.parentNode.parentNode.parentNode); // cool huh?
        submitBtn.focus();
    }, { once: true });

    fileInput.click(); // open the file picker
}

function scrollToContent() {
    const pageContent = dom.$('#pageContent');
    if (!pageContent) return;
    pageContent.scrollIntoView();
    document.documentElement.scrollBy(0, -20);
}

const isFKey = key =>
    (key.length == 2 && key[0] == 'F' && key[1] >= '0' && key[1] <= '9');

export function install() {
    // id2Fn[an id like "darkTheme"] == a function that is called when the shortcut is pressed
    const id2Fn = {
        submit: submit,
        scrollToContent: scrollToContent,
        darkTheme: () => config.toggle('darkTheme'),
        hideTestNumber: () => config.toggle('hideTestNumber'),
        finder: finder.open,
    };

    // id2Shortcut[an id like "darkTheme"] == a shortcut like "Ctrl+I"
    let id2Shortcut = config.get('shortcuts');

    // convert(id2Shortcut, id2Fn) -> shortcut2Fn
    function convert(i2s, i2f) {
        let s2f = {};
        for (let id in i2s) {
            let shortcut = i2s[id].toLowerCase();
            let fn = i2f[id];
            s2f[shortcut] = fn;
        }
        return s2f;
    }

    // shortcut2Fn["Ctrl+I"] == a function like darkTheme()
    let shortcut2Fn = convert(id2Shortcut, id2Fn);
    events.listen('shortcuts', newId2Shortcut =>
        shortcut2Fn = convert(newId2Shortcut, id2Fn));

    dom.on(document, 'keydown', (e) => {
        const hasModifier = e.ctrlKey || e.shiftKey || e.altKey || e.metaKey || isFKey(e.key);
        if (!hasModifier) return;

        // Build the key sequence string (like 'ctrl+shift+p')
        let sc = "";
        if (e.metaKey) sc += 'meta+';
        if (e.ctrlKey) sc += 'ctrl+';
        if (e.altKey) sc += 'alt+';
        if (e.shiftKey) sc += 'shift+';

        sc += e.key == ' ' ? 'space' : e.key.toLowerCase();

        const fn = shortcut2Fn[sc];
        if (fn)  {
            e.preventDefault();
            e.stopPropagation();
            fn();
        }
    });
}

export function uninstall() { }
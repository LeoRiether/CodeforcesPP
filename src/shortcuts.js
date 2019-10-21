/**
 * @file Defines keyboards shortcuts to be used on all codeforces pages
 */

let dom = require('./dom');
let finder = require('./finder');
let config = require('./config');

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

function scrollToPageContent() {
    const pageContent = dom.$('#pageContent');
    if (!pageContent) return;
    pageContent.scrollIntoView();
    document.documentElement.scrollBy(0, -20);
}

function invertImages() {
    dom.$$('img').forEach(i => i.classList.toggle('inverted'));
}

let shortcuts = {
    'ctrl+s': submit,
    'ctrl+shift+v': scrollToPageContent, // V => view
    'ctrl+alt+v': scrollToPageContent,
    'ctrl+i': invertImages,
};
shortcuts[config.get('finder').toLowerCase()] = finder.open;

function isFKey(key) {
    return key.length == 2 && key[0] == 'F' && key[1] >= '0' && key[1] <= '9';
}

module.exports = function() {
    dom.on(document, 'keydown', (e) => {
        // Not going to use precious cycles when there's not even a ctrl or shift
        if (!e.ctrlKey && !isFKey(e.key)) return;
        
        // Build the key sequence string (like 'ctrl+shift+p')
        let key = "";
        if (e.metaKey) key += 'meta+';
        if (e.ctrlKey) key += 'ctrl+';
        if (e.altKey) key += 'alt+';
        if (e.shiftKey) key += 'shift+';

        key += e.key == ' ' ? 'space' : e.key.toLowerCase();

        const fn = shortcuts[key];
        if (fn)  {
            e.preventDefault();
            e.stopPropagation();
            fn();
        }
    });
};
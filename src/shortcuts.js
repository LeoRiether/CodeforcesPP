/**
 * @file Defines keyboards shortcuts to be used on all codeforces pages
 */

let dom = require('./dom');

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

// Opens the uuuh I don't know the name yet, it's CtrlShiftP
function ctrlShiftP() {
    alert("Coming soon!");
}

function invertImages() {
    dom.$$('img').forEach(i => i.classList.toggle('inverted'));
}

const shortcuts = {
    'ctrl+s': submit,
    'ctrl+shift+V': scrollToPageContent, // V => view
    'ctrl+alt+v': scrollToPageContent,
    'ctrl+shift+P': ctrlShiftP,
    'ctrl+i': invertImages,
};

module.exports = function() {
    dom.on(document, 'keydown', (e) => {
        // Not going to use precious cycles when there's not even a ctrl or shift
        if (!e.ctrlKey) return;

        
        // Build the key sequence string (like 'ctrl+shift+p')
        let key = "";
        if (e.ctrlKey) key += 'ctrl+';
        if (e.altKey) key += 'alt+';
        if (e.shiftKey) key += 'shift+';
        key += e.key;

        const fn = shortcuts[key];
        if (fn)  {
            e.preventDefault();
            e.stopPropagation();
            fn();
        }
    });
};
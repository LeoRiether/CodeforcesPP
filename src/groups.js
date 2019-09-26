/**
 * @file Improves navigation on /group pages. Does so by replacing the /members links by /contests 
 * links (because that's often what the user is looking for), as well as adding shortcuts to see
 * the groups contests in the /groups/with page
 */

let dom = require('./dom');

/**
 * Replaces all /members links with /contests
 */
function replaceLinks() {
    let links = dom.$$('.datatable a.groupName');
    for (let link of links)
        link.href = link.href.replace("/members", "/contests");
}

/**
 * Adds arrows on the side of a group's name that, when clicked, show the contests in that group
 * without having to render a new page
 * 
 * This method isn't called as of now (it's not finished)
 */
function createShortcuts() {
    let rows = dom.$$('#pageContent>.datatable tr');

    // We'll add <link rel="prefetch">s to the end of the page to speed up loading
    let frag = document.createDocumentFragment();

    // Add another header to keep the alignment with the rows
    rows[0].prepend(dom.element('td'));

    let shouldPrefetch = false; // TODO: remove

    // Speed-up the next page load
    // I tried prerendering, but it was still slow. This was the best alternative
    // TODO: check if this really impacts page load
    document.head.appendChild(dom.element('link', {
        rel: 'preconnect',
        href: location.origin
    }));

    // Add arrows
    for (let row of [].slice.call(rows, 1)) {
        let arrow = dom.element('td', { className: 'fas fa-caret-right fa-2x' });
        arrow.dataset.set = "false";

        dom.on(arrow, 'click', () => {
            if (arrow.dataset.set == "true") {
                arrow.dataset.set = "false";
                arrow.style.transform = "rotate(0deg)";
                
                openShortcut();
            } else {
                arrow.dataset.set = "true";
                arrow.style.transform = "rotate(90deg)";

                closeShortcut();
            }
        });

        row.prepend(arrow); // TODO: embed the contests somehow
        
        // Replacing so this code doesn't break in case I make a toggle for replaceLinks in the settings
        const href = dom.$('a.groupName', row).getAttribute('href').replace('/members', '/contests');

        //! Codeforces passes a Pragma: no-cache for these pages... what the...

        if (!shouldPrefetch) continue;
        frag.appendChild(dom.element('link', {
            rel: 'prerender',
            href: href
        }));
        shouldPrefetch = false;
    }

    document.head.append(frag);
}

function loadShortcut() {

}

function openShortcut(row) {

}

function closeShortcut(row) {

}

module.exports = function() {
    replaceLinks();
    // createShortcuts();
};
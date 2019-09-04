/**
 * @file Adds a "Show Tags" button to a problem's page
 */
let dom = require('./dom');

module.exports = function () {
    // If the user has already AC'd this problem, there's no need to hide the tags
    let hasAC = dom.$('.verdict-accepted');
    if (hasAC) { return; }

    let tbox = dom.$('.tag-box'); // individual tag
    let container = tbox.parentNode.parentNode; // actual container for all the tags
    container.style.display = 'none';
    container.classList.add('tag-container');

    // Create button
    let showTagsButton = dom.element('button', { className: 'caption' });
    showTagsButton.innerText = "Show";
    showTagsButton.addEventListener('click', () => {
        showTagsButton.remove();
        container.style.display = 'block';
    });

    Object.assign(showTagsButton.style, {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer'
    });
    
    container.parentNode.appendChild(showTagsButton);
}
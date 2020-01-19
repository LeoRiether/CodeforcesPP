/**
 * @file Adds a "Show Tags" button to a problem's page
 */
import dom from '../helpers/dom';
import config from '../env/config';
import env from '../env/env';

export const install = env.ready(function () {
    if (!config.get('showTags') || !dom.$('.tag-box')) return;

    // If the user has already AC'd this problem, there's no need to hide the tags
    let hasAC = dom.$('.verdict-accepted');
    if (hasAC) { return; }

    let tbox = dom.$('.tag-box'); // individual tag
    let container = tbox.parentNode.parentNode; // actual container for all the tags
    container.style.display = 'none';

    function ShowTagsButton() {
        let btn =
            <button className="caption showTagsBtn" style="background: transparent; border: none; cursor: pointer;">
                Show
            </button>;
        dom.on(btn, 'click', uninstall);
        return btn;
    }

    container.parentNode.appendChild( <ShowTagsButton /> );
});

export const uninstall = env.ready(function () {
    let btn = dom.$('.showTagsBtn');
    if (btn) {
        btn.remove();
        let container = dom.$('.tag-box').parentNode.parentNode; // container for all the tags
        container.style.display = 'block';
    }
});
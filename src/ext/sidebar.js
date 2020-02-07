/**
 * @file Creates an action box on the sidebar (like URI has for submitting, ranking, ...)
 */

import dom from '../helpers/dom';
import * as config from '../env/config';
import env from '../env/env';
import { flatten, pipe, forEach } from '../helpers/Functional';

// Note: each col is *moved* into the box, there's no cloneNode here.
// This is done to keep event listeners attached, but prevents uninstall() from ever existing
const addToBox = box => col =>
    box.appendChild(
        <tr className="boxRow"><td>
            <div style="display: flex;">
                <div style="display: inline-block; flex: 1;"> {col} </div>
            </div>
        </td></tr>
    );

function fixStyling(sidebar, forms, menu) {
    let pageContent = dom.$('#pageContent');

    // Hide containers that will have it's links moved to the sidebar
    menu.style.display = 'none';
    forms.forEach(e => e.closest('.sidebox').style.display = 'none');

    // Fix alignment issues
    sidebar.style.marginTop = 0;
    pageContent.style.paddingTop = 0;
}

// Move the "favourite problem" star to after the contest name
function moveStar() {
    let star = dom.$('.toggle-favourite', sidebar),
        starRow = star && star.closest('tr');
    if (!star) return;

    star.style.height = "14px";
    dom.$('tr a', sidebar).appendChild(star);
    starRow.remove();
}

let installed = false;
export const install = env.ready(function() {
    if (!config.get('sidebarBox')) return;

    let sidebar = dom.$('#sidebar'),
        rtable = dom.$('#sidebar>:first-child .rtable'),
        box = dom.$('.sidebox .rtable tbody', sidebar),
        forms = [].slice.call(dom.$$('.sidebox form', sidebar)),
        menu = dom.$('.second-level-menu'),
        menuLinks = dom.$$('.second-level-menu-list li>a', menu);
    if (!sidebar || !rtable || !box || !menu) return;

    if (installed) return notifyPageNeedsRefresh(); // can't install twice
    installed = true;

    fixStyling(sidebar, forms, menu);

    let submitForm;
    if (forms.length && dom.$('.submit', forms[forms.length-1])) {
        submitForm = forms.pop();
    }

    const addAllToBox = pipe(
        flatten,
        forEach (addToBox(box))
    );

    addAllToBox([ menuLinks, forms ]);
    if (submitForm) addToBox (box) (submitForm);

    moveStar();
});

export function uninstall() {
    notifyPageNeedsRefresh();
}

function notifyPageNeedsRefresh() {
    env.global.Codeforces.showMessage("Please refresh the page to see changes");
}
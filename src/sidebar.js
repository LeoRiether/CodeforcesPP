/**
 * @file Creates an action box on the sidebar (like URI has for submitting, ranking, ...)
 */

let dom = require('./dom');
let config = require('./config');
let { zipBy2, flatten, pipe, forEach, map } = require('./Functional');

let addToBox = box => cols => {
    // Note: each col is *moved* into the box, there's no cloneNode here.
    // This is done to keep event listeners attached, but prevents uninstall() from ever existing

    let row = <div style="display: flex;" />;
    cols
        .map(col =>
            <div style="display: inline-block; flex: 1;">
                {col || <span></span>}
            </div>)
        .forEach(div => row.appendChild(div));

    box.appendChild(<tr className="boxRow"> <td>{row}</td> </tr>);
};

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
function install() {
    if (!config.get('sidebarBox')) return;

    // TODO: try to remove this in production, or at least make a good whitelist
    if (!/\/(problem|gym)\//.test(location.href)) return;

    let sidebar = dom.$('#sidebar'),
        box = dom.$('.sidebox .rtable tbody', sidebar),
        forms = [].slice.call(dom.$$('.sidebox form', sidebar)),
        menu = dom.$('.second-level-menu'),
        menuLinks = dom.$$('.second-level-menu-list li>a', menu);
    if (!sidebar || !box || !menu) return;

    if (installed) return notifyPageNeedsRefresh(); // can't install twice
    installed = true;

    fixStyling(sidebar, forms, menu);

    let submitForm;
    if (forms.length && dom.$('.submit', forms[forms.length-1])) {
        submitForm = forms.pop();
    }

    const addAllToBox = pipe(
        flatten,
        // zipBy2,
        map(e => [e]),
        forEach(addToBox(box))
    );

    addAllToBox([ menuLinks, forms ]);
    if (submitForm) addToBox(box)([submitForm]);

    moveStar();
}

function uninstall() {
    notifyPageNeedsRefresh();
}

function notifyPageNeedsRefresh() {
    Codeforces && Codeforces.showMessage("Please refresh the page to see changes");
}

module.exports = { install, uninstall };
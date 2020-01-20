/**
 * @file Entry-point of the Codeforces++ core code a.k.a. runs the extension modules
 */

// Extension modules
import * as show_tags from './ext/show_tags';
import * as problemset from './ext/problemset';
import * as search_button from './ext/search_button';
import * as show_tutorial from './ext/show_tutorial';
import * as navbar from './ext/navbar';
import * as redirector from './ext/redirector';
import * as update_standings from './ext/update_standings';
import * as style from './ext/style';
import * as verdict_test_number from './ext/verdict_test_number';
import * as shortcuts from './ext/shortcuts';
import * as sidebar from './ext/sidebar';
import * as finder from './ext/finder';

import env from './env/env';
import config from './env/config';

(async function run() {
    console.log("Codeforces++ is running!");

    await config.load();
    config.createUI();

    (async function notifyVersionChange() {
        const v = config.get('version');
        if (v != env.version) {
            config.set('version', env.version);
            env.global.Codeforces('showMessage', `Codeforces++ was updated to version ${config.get('version')}!
            Read the <a href="https://github.com/LeoRiether/CodeforcesPP/releases/latest" style="text-decoration:underline !important;color:white;">
            changelog</a>`);
        }
    })();

    let modules = [
        [show_tags          , 'showTags'],
        [problemset         , 'showTags'],
        [search_button      , 'searchBtn'],
        [show_tutorial      , ''],
        [navbar             , ''],
        [redirector         , ''],
        [update_standings   , 'standingsItv'],
        [style              , 'style'],
        [verdict_test_number, 'hideTestNumber'],
        [shortcuts          , ''],
        [sidebar            , 'sidebarBox']
    ];

    function registerConfigCallback(m, id) {
        config.listen(id, value => {
            if (value === true || value === false) {
                value ? m.install() : m.uninstall();
            } else {
                m.uninstall();
                m.install(value);
            }
        });
    }

    modules.forEach(([m, configID], index) => {
        if (process.env.NODE_ENV == 'development') {
            if (typeof m.install !== 'function' || typeof m.uninstall !== 'function')
                return console.error(`Module #${index} needs to have both install() and uninstall() exported methods`);
        }

        m.install();
        if (configID) {
            registerConfigCallback(m, configID);
        }
    });

    style.common();
    finder.updateGroups();

})();
/**
 * @file Entry-point of the Codeforces++ core code a.k.a. runs the extension modules
 */

// "Don't inject moz-extension paths directly" https://extensionworkshop.com/documentation/develop/build-a-secure-extension/
// Immediately remove the injected script to mitigate this issue (only in extension mode, userscript managers already do this for us)
if (process.env.TARGET == 'extension')
    document.currentScript.remove();

// Extension modules
import * as style from './ext/style';
import * as dark_theme from './ext/dark_theme';
import * as show_tags from './ext/show_tags';
import * as problemset from './ext/problemset';
import * as search_button from './ext/search_button';
import * as show_tutorial from './ext/show_tutorial';
import * as navbar from './ext/navbar';
import * as redirector from './ext/redirector';
import * as update_standings from './ext/update_standings';
import * as verdict_test_number from './ext/verdict_test_number';
import * as shortcuts from './ext/shortcuts';
import * as sidebar from './ext/sidebar';
import * as finder from './ext/finder';
import * as mashup_add_all from './ext/mashup_add_all';

import env from './env/env';
import * as config from './env/config';
import * as events from './helpers/events';

import { tryCatch, profile } from './helpers/Functional';

profile(run);

async function run() {
    console.log("Codeforces++ is running!");

    config.load();
    config.createUI();

    let modules = [
        [style              , 'style'],
        [dark_theme         , 'darkTheme'],
        [show_tags          , 'showTags'],
        [problemset         , 'showTags'],
        [search_button      , 'searchBtn'],
        [show_tutorial      , ''],
        [navbar             , ''],
        [redirector         , ''],
        [update_standings   , 'standingsItv'],
        [verdict_test_number, 'hideTestNumber'],
        [shortcuts          , ''],
        [sidebar            , 'sidebarBox'],
        [mashup_add_all     , ''],
    ];

    // It works until you need to change the load order
    let moduleNames = [ 'style', 'dark_theme', 'show_tags', 'problemset', 'search_button',
                        'show_tutorial', 'navbar', 'redirector', 'update_standings',
                        'verdict_test', 'shortcuts', 'sidebar', 'mashup_add_all' ];

    function registerConfigCallback(m, id) {
        events.listen(id, value => {
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
                return console.error(`Module ${moduleNames[index]} needs to have both install() and uninstall() exported methods`);
        }

        tryCatch(m.install, e => console.log(`Error installing module #${moduleNames[index]}:`, e)) ();
        if (configID) {
            registerConfigCallback(m, configID);
        }
    });

    style.common();
    finder.updateGroups();

    env.run_when_ready(function() {
        const v = config.get('version');
        if (v != env.version) {
            config.set('version', env.version);
            env.global.Codeforces.showMessage(`Codeforces++ was updated to version ${env.version}!
            Read the <a href="https://github.com/LeoRiether/CodeforcesPP/releases/latest" style="text-decoration:underline !important;color:white;">
            changelog</a>`);
        }
    });
}
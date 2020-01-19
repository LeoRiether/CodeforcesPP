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
import { updateGroups as updateFinderGroups } from './ext/finder';

import env from './env/env';

(async function run() {
    console.log("Codeforces++ is running!");

    let config = require('./env/config');
    await config.load();
    config.createUI();

    (async function notifyVersionChange() {
        const v = config.get('version');
        if (v != env.version) {
            config.set('version', env.version);
            env.self.Codeforces('showMessage', `Codeforces++ was updated to version ${config.get('version')}!
            Read the <a href="https://github.com/LeoRiether/CodeforcesPP/releases/latest" style="text-decoration:underline !important;color:white;">
            changelog</a>`);
        }
    })();

    // old
    // let modules = [
    //     [require('./ext/show_tags')          , 'showTags'],
    //     [require('./ext/problemset')         , 'showTags'],
    //     [require('./ext/search_button')      , 'searchBtn'],
    //     [require('./ext/show_tutorial')      , ''],
    //     [require('./ext/navbar')             , ''],
    //     [require('./ext/redirector')         , ''],
    //     [require('./ext/update_standings')   , 'standingsItv'],
    //     [require('./ext/style')              , 'style'],
    //     [require('./ext/verdict_test_number'), 'hideTestNumber'],
    //     [require('./ext/shortcuts')          , ''],
    //     [require('./ext/sidebar')            , 'sidebarBox']
    // ];

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

    // require('./ext/style').common();
    // require('./ext/finder').updateGroups();
    style.common();
    updateFinderGroups();

    // Exported to a global cfpp variable
    module.exports = {
        debug: {
            resetConfig: config.reset
        },
        version: env.version,

        listen: config.listen,
        fire: config.fire,
        env: env
    };
})();
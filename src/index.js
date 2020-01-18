/**
 * @file Entry-point of the Codeforces++ core code a.k.a. runs the extension modules
 */

(async function run() {
    const env = require('./env/env');

    console.log("Codeforces++ is running!");

    env.Codeforces('showMessage', 'Welcome to youkoso Codeforces++');

    let config = require('./env/config');
    await config.load();
    config.createUI();

    (async function notifyVersionChange() {
        const v = config.get('version');
        if (v != env.version) {
            config.set('version', env.version);
            env.Codeforces('showMessage', `Codeforces++ was updated to version ${config.get('version')}!
            Read the <a href="https://github.com/LeoRiether/CodeforcesPP/releases/latest" style="text-decoration:underline !important;color:white;">
            changelog</a>`);
        }
    })();

    // ParcelJS doesn't bundle correctly without all of the requires...
    let modules = [
        [require('./ext/show_tags')          , 'showTags'],
        [require('./ext/problemset')         , 'showTags'],
        [require('./ext/search_button')      , 'searchBtn'],
        [require('./ext/show_tutorial')      , ''],
        [require('./ext/navbar')             , ''],
        [require('./ext/redirector')         , ''],
        [require('./ext/update_standings')   , 'standingsItv'],
        [require('./ext/style')              , 'style'],
        [require('./ext/verdict_test_number'), 'hideTestNumber'],
        [require('./ext/shortcuts')          , ''],
        [require('./ext/sidebar')            , 'sidebarBox']
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

    require('./ext/style').common();
    require('./ext/finder').updateGroups();

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
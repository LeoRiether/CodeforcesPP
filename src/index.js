/**
 * @file Installs the modules
 */

const env = require('./env/env');

(async function run() {

    console.log("Codeforces++ is running!");

    let config = require('./env/config');
    await config.load();
    config.createUI();

    (async function notifyVersionChange() {
        const v = await config.get('version');
        if (v != env.version) {
            config.set('version', env.version);
            config.save();
            env.Codeforces('showMessage', `Codeforces++ was updated to version ${config.get('version')}!
            Read the <a href="https://github.com/LeoRiether/CodeforcesPP/releases/latest" style="text-decoration:underline !important;color:white;">changelog</a>`);
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

    modules.forEach(([m, configID]) => {
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
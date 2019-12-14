/**
 * @file Installs the modules
 */

let tries = 0;
(function run() {
    Codeforces = unsafeWindow.Codeforces;
    if (!Codeforces && tries < 15) {
        tries++;
        setTimeout(run, 200);
        return;
    }

    console.log("Codeforces++ is running!");

    let config = require('./config');
    config.load();
    config.createUI();

    try {
        // Update version
        if (GM_info && config.get('version') != GM_info.script.version) {
            config.set('version', GM_info.script.version);
            config.save();
            if (Codeforces && Codeforces.showMessage) {
                Codeforces.showMessage(`Codeforces++ was updated to version ${config.get('version')}!
                Read the <a href="https://github.com/LeoRiether/CodeforcesPP/releases/latest" style="text-decoration:underline !important;color:white;">changelog</a>`);
            }
        }
    } catch {
        // gracefully do nothing
    }

    // ParcelJS doesn't bundle correctly without all of the requires...
    let modules = [
        [require('./show_tags')          , 'showTags'],
        [require('./problemset')         , 'showTags'],
        [require('./search_button')      , 'searchBtn'],
        [require('./show_tutorial')      , ''],
        [require('./navbar')             , ''],
        [require('./redirector')         , ''],
        [require('./update_standings')   , 'standingsItv'],
        [require('./style')              , 'style'],
        [require('./verdict_test_number'), 'hideTestNumber'],
        [require('./shortcuts')          , ''],
        [require('./sidebar')            , 'sidebarBox']
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

    require('./style').common();
    require('./finder').updateGroups();

    // Exported to a global cfpp variable
    module.exports = {
        debug: {
            resetConfig: config.reset
        },
        version: config.get('version'),

        listen: config.listen,
        fire: config.fire,
    };
})()
/**
 * @file Calls the appropriate modules according to the current page
 */

console.log("Codeforces++ is running!");

let dom = require('./dom');

// Initialize localStorage configuration
let config;
function loadConfig() {
    config = {
        showTags: true,
        style:    true,
        isOk:     true, // In case the config is overwritten by something not-JSON (e.g. a bool), this will tell us
    };
    localStorage.cfpp = JSON.stringify(config);
}

if (!localStorage.cfpp) {
    loadConfig();
} else {
    config = JSON.parse(localStorage.cfpp);
    if (!config.isOk)
        loadConfig();
}


if (config.style)
    require('./style');

// Execute features according to the current page
if (config.showTags && dom.$('.tag-box')) {
    require('./show_tags')();
} else if (config.showTags && dom.$('.problems')) {
    require('./problemset')();
}

require('./navbar')();
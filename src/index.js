/**
 * @file Calls the appropriate modules according to the current page
 */

console.log("Codeforces++ is running!");

let dom = require('./dom');

let config = require('./config');
config.load();
config.createUI();

// Update version
if (GM_info && config.get('version') != GM_info.script.version) {
    config.set('version', GM_info.script.version);
    config.save();
    if (Codeforces && Codeforces.showMessage) {
        Codeforces.showMessage(`Codeforces++ was updated to version ${config.get('version')}! 
        Read the <a href="https://github.com/LeoRiether/CodeforcesPP/releases/latest" style="text-decoration:underline !important;color:white;">changelog</a>`);
    }
} 

// Execute features according to the current page
if (config.get('showTags') && dom.$('.tag-box')) {
    require('./show_tags')();
} else if (config.get('showTags') && dom.$('.problems')) {
    require('./problemset')();
}

let searchableRegex = /\/(gym|group)\/(.?)+\/problem\/\w$/i; // Maches a problem on a /gym or /group page
if (config.get('searchBtn') && searchableRegex.test(location.pathname))
    require('./search_button')();

// Regex matches a page of a problem in the problemset (most of these have tutorials)
let problemRegex = /\/problemset\/problem\/|\/contest\/\d+\/problem\/\w/i;
if (problemRegex.test(location.pathname))
    require('./show_tutorial')();


require('./navbar')();
require('./redirector')();

const standingsItv = +config.get('standingsItv');
if (standingsItv > 0 && /\/standings/i.test(location.pathname))
    require('./update_standings')(standingsItv);

require('./shortcuts')();

const style = require('./style');
if (config.get('style')) {
    style.custom();
}
style.common();

// Exported to a global cfpp variable
module.exports = {
    debug: {
        resetConfig: config.reset
    },
    dom: dom,
    version: config.get('version')
};
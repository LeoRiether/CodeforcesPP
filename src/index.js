/**
 * @file Calls the appropriate modules according to the current page
 */

console.log("Codeforces++ is running!");

let dom = require('./dom');

let config = require('./config');
config.load();
config.createUI();

if (config.get('style'))
    require('./style');

// Execute features according to the current page
if (config.get('showTags') && dom.$('.tag-box')) {
    require('./show_tags')();
} else if (config.get('showTags') && dom.$('.problems')) {
    require('./problemset')();
}

require('./navbar')();

let searchableRegex = /\/(gym|group)\/(.?)+\/problem\/\w$/i; // Maches a problem on a /gym or /group page
if (config.get('searchBtn') && location.pathname.match(searchableRegex))
    require('./search_button')();

// Regex matches a page of a problem in the problemset (most of these have tutorials)
if (location.pathname.match(/\/problemset\/problem\//i))
    require('./show_tutorial')();

// Exported to a global cfpp variable
module.exports = {
    debug: {
        resetConfig: config.reset
    },
};

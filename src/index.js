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
if (config.get('searchBtn') && searchableRegex.test(location.pathname))
    require('./search_button')();

// Regex matches a page of a problem in the problemset (most of these have tutorials)
let problemRegex = /\/problemset\/problem\/|\/contest\/\d+\/problem\/\w/i;
if (problemRegex.test(location.pathname))
    require('./show_tutorial')();

// Replace links on groups list page (they go to /members by default, changed to /contests)
if ((/\/groups\/with\//i).test(location.pathname)) {
    let links = dom.$$('.datatable a.groupName');
    for (let link of links)
        link.href = link.href.replace("/members", "/contests");
}

// Exported to a global cfpp variable
module.exports = {
    debug: {
        resetConfig: config.reset
    },
    dom: dom
};

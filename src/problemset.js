/**
 * @file Hides tags on the /problemset page for the problems you didn't solve yet
 */

let dom = require('./dom');

module.exports = function() {
    // Get problems that don't have an AC
    let noACs = dom.$$('.problems tr:not(.accepted-problem)');
    for (let p of noACs) {
        // Hide them hackfully!
        let k = p.children[1].children[1] || {};
        k = k.style || {};
        k.display = 'none';
    }
};
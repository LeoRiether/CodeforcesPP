let dom = require('./dom');

module.exports = function() {
    // Hides tags on the problemset page for the problems you didn't solve yet
    let noACs = dom.$$('.problems tr:not(.accepted-problem)');
    for (let p of noACs) {
        // yup
        let k = p.children[1] || {};
        k = k.children[1] || {};
        k = k.style || {};
        k.display = 'none';
    }
};
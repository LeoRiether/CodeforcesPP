/**
 * @file Adds a button to query for the problem on a search engine
 * Used on /gym and /group pages
 */

let dom = require('./dom');

module.exports = function() {
    let problemName = dom.$('.problem-statement .title').innerText;
    problemName = problemName.split('.').slice(1).join('.');
    problemName += ' codeforces';

    let ul = dom.$('.second-level-menu-list');
    let li = dom.element('li');
    let a = dom.element('a');
    a.href = `https://google.com/search?q=${problemName.replace(/ /g, '+')}`;
    a.innerText = 'Google It';
    li.appendChild(a);
    ul.appendChild(li);
};
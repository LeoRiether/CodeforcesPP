/**
 * @file Adds a button to query for the problem on a search engine
 * Used on /gym and /group pages
 */

let dom = require('./dom');

module.exports = function() {
    let problemName = dom.$('.problem-statement .title').innerText;
    problemName = problemName.split('.').slice(1).join('.');
    problemName += ' codeforces';

    const href = `https://google.com/search?q=${problemName.replace(/ /g, '+')}`;
    dom.$('.second-level-menu-list').appendChild(
        <li>
            <a href={href} target="_blank"> Google It </a>
        </li>
    );
};

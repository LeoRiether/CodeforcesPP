/**
 * @file Adds a button to query for the problem on a search engine
 * Used on /gym and /group pages
 */

let dom = require('../helpers/dom');
let config = require('../env/config');

function install() {
    let searchableRegex = /\/(gym|group)\/(.?)+\/problem\/\w$/i; // Maches a problem on a /gym or /group page
    if (!config.get('searchBtn') || !searchableRegex.test(location.pathname)) return;

    let problemName = dom.$('.problem-statement .title').innerText;
    problemName = problemName.split('.').slice(1).join('.');
    problemName += ' codeforces';

    const href = `https://google.com/search?q=${problemName.replace(/ /g, '+')}`;
    dom.$('.second-level-menu-list').appendChild(
        <li>
            <a href={href} target="_blank" className="searchBtn"> Google It </a>
        </li>
    );
}

function uninstall() {
    let btn = dom.$('.searchBtn');
    if (btn) btn.remove();
}

module.exports = { install, uninstall };

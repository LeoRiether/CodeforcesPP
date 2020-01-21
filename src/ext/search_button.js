/**
 * @file Adds a button to query for the problem on a search engine
 * Used on /gym and /group pages
 */

import dom from '../helpers/dom';
import config from '../env/config';
import env from '../env/env';

export const install = env.ready(function() {
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
});

export function uninstall() {
    let btn = dom.$('.searchBtn');
    if (btn) btn.remove();
}
/**
 * @file Adds a button to query for the problem on a search engine
 * Used on /gym and /group pages
 */

import dom from '../helpers/dom';
import config from '../env/config';
import env from '../env/env';

export const install = env.ready(function() {
    let searchableRegex = /\/(gym|group)\/(.?)+\/problem\/\w$/i; // Maches a problem on a /gym or /group page
    if (!searchableRegex.test(location.pathname)) return;

    let problemTitle = dom.$('.problem-statement .title').innerText;
    problemTitle = problemTitle.split('.').slice(1).join('.');
    problemTitle += ' codeforces';

    const href = `https://google.com/search?q=${problemTitle.replace(/ /g, '+')}`;
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
/**
 * @file Makes an "add all" button to the mashup creation page that adds many problems at the same time to a mashup
 */

import dom from '../helpers/dom';
import env from '../env/env';

export const install = env.ready(function() {
    if (!dom.$('#addProblemForm')) return;

    async function addAll() {
        let input  = dom.$('#addProblemForm .ac_input');
        let button = dom.$('.addProblemLink');

        const add = problem => new Promise(res => {
            input.value = problem;
            button.click();

            (function tryRes() {
                if (input.value == '') return res();
                setTimeout(tryRes, 100);
            })();
        });

        const problems = input.value.split(/\s/).filter(p => p != "");
        for (let problem of problems) {
            await add(problem);
        }
    }

    let button = <div style="text-align: center;">
        <input type="submit" onClick={addAll} value="Add all" />
        <span style="border-radius: 50%; background: #959595; color: white; margin-left: 0.5em;
                      display: inline-block; text-align: center; width: 1em; cursor: pointer;"
              onClick={() => env.global.Codeforces.showMessage(`Input multiple problem codes separated by whitespace (like "123A 123B")
                                                                and press "Add all" to add all of them at once`)}>
               ?
        </span>
    </div>;

    dom.$('#addMashupForm')
       .insertAdjacentElement('afterend', button);
});
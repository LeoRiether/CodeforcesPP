import * as shared from './env-shared';
import * as extension from './env-extension';
import * as userscript from './env-userscript';

let env = {};
if (process.env.TARGET === 'extension') {
    env = { ...shared, ...extension };
} else {
    env = { ...shared, ...userscript };
}

export default env;
// Hopefully tree-shaking will do its thing
// if (process.env.TARGET === 'extension') {
//     module.exports = require('./env-extension');
//     module.exports.target = 'extension';
// } else {
//     module.exports = require('./env-userscript');
//     module.exports.target = 'userscript';
// }

// // Extend exports with shared environment
// module.exports = Object.create(module.exports, require('./env-shared'));

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
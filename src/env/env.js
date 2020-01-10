// Hopefully tree-shaking will do its thing
if (process.env.TARGET === 'extension') {
    module.exports = require('./env-extension');
    module.exports.target = 'extension';
} else {
    module.exports = require('./env-userscript');
    module.exports.target = 'userscript';
}

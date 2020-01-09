// Hopefully tree-shaking will do its thing
if (process.env.TARGET === 'extension') {
    module.exports = require('./env-browser');
    module.exports.target = 'extension';
} else {
    module.exports = require('./env-script');
    module.exports.target = 'userscript';
}

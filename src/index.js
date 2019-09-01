let dom = require('./dom');

let problem = require('./problem');
let problemset = require('./problemset');

require('./style');

if (dom.$('.tag-box')) {
    problem();
} else if (dom.$('.problems')) {
    problemset();
}
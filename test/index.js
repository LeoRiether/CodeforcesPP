const test = require('tape');
const tapDiff = require('tap-diff');

test.createStream()
  .pipe(tapDiff())
  .pipe(process.stdout);

test('Tape works', t => {
    t.equal(1 + 1, 2);
    t.throws(() => { throw "indeed throws"; });
    t.end();
});

global.document = {
  createElement(tag) {
    return { tag, style: {} };
  }
};

test("dom.js works", t => {
  let dom = require('../src/dom');
  let props = {
    href: 'codeforces.com',
    className: 'cfpp-link'
  };
  
  t.deepEqual(dom.element('a', props), { ...props, 'tag': 'a', style: {} });
  
  t.end();
});
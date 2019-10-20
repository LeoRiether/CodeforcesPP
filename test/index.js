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

// TODO: check if the tests broke after injecting jsx
test("dom.js works", t => {
  let dom = require('../src/dom');
  let props = {
    href: 'codeforces.com',
    className: 'cfpp-link'
  };
  
  t.deepEqual(<a {...props}/>, { ...props, 'tag': 'a', style: {} });
  
  t.end();
});
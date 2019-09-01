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
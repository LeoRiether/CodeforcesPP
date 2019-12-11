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

test('events.js works', t => {
  let events = require('../src/events');
  t.plan(3);
  events.listen('event_id', data =>
    t.equal(data, 123, "Events fire correctly 1"));
  events.listen('creative event name', data =>
    t.equal(data, 'creative data', "Events fire correctly 2"));

  events.fire('event_id', 123);
  events.fire('creative event name', 'creative data');
  events.fire('event_id', 123);
});
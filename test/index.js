// THIS DOESN'T EVEN RUN ANYMORE
// TESTS ARE FOR THE WEAK

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
  let events = require('../src/helpers/events');
  t.plan(3);
  events.listen('event_id', data =>
    t.equal(data, 123, "Events fire correctly 1"));
  events.listen('creative event name', data =>
    t.equal(data, 'creative data', "Events fire correctly 2"));

  events.fire('event_id', 123);
  events.fire('creative event name', 'creative data');
  events.fire('event_id', 123);
});

test('Functional works (but perhaps not all of it, coverage is subpar)', t => {
  const { curry, pluck } = require('../src/helpers/Functional');

  const sum = curry((x, y) => x + y);
  t.equal(sum(1, 2), sum (1) (2), `curry`);

  const sym = Symbol();
  const managers = [
    { name: 'Bob'          , human: true , [sym]: 1 },
    { name: 'Alice'        , human: true , [sym]: 2 },
    { name: 'Tampermonkey' , human: false, [sym]: 3 },
    { name: 'Violentmonkey', human: false, [sym]: 4 },
  ];

  t.deepEqual(
    managers.map (pluck('name')),
    [ 'Bob', 'Alice', 'Tampermonkey', 'Violentmonkey' ],
    'basic plucking'
  );

  t.deepEqual(
    managers.map (pluck(sym)),
    [1,2,3,4],
    'symbol plucking'
  );

  t.end();
});
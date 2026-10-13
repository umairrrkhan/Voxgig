const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const { Aontu } = require('aontu');

const article = readFileSync(__dirname + '/ARTICLE.md', 'utf8');
const blocks = [...article.matchAll(/^```(\w+)\n([\s\S]*?)^```/gm)];
const evaluate = source => new Aontu().generate(source);

test('article has the six expected code blocks', () => {
  assert.deepEqual(blocks.map(block => block[1]), ['sh', 'js', 'aontu', 'aontu', 'aontu', 'aontu']);
  assert.equal(require('aontu/package.json').version, '0.76.0');
  assert.equal(blocks[0][2].trim(), 'npm install --save-exact aontu@0.76.0');
});

test('the complete JavaScript article example executes and produces its stated output', () => {
  let output;
  runInNewContext(blocks[1][2], { require, console: { log: value => { output = value; } } });
  assert.deepEqual(output, { service: { host: 'localhost', port: 9090 } });
});

test('conflicting concrete declarations fail in either order', () => {
  assert.throws(() => evaluate(blocks[2][2]));
  assert.throws(() => evaluate(blocks[2][2].trim().split('\n').reverse().join('\n')));
});

test('the open-map typo example evaluates with the default unchanged', () => {
  assert.deepEqual(evaluate(blocks[3][2]), { service: { port: 8080, porrt: 9090 } });
});

test('closing the map rejects the same typo', () => {
  assert.throws(() => evaluate('service: close({ port: *8080 | integer })\nservice: { porrt: 9090 }'));
});

test('a positional list constrains only its declared element', () => {
  assert.deepEqual(evaluate(blocks[4][2]), { labels: ['public', 7] });
});

test('a spread rejects the second element of the wrong type', () => {
  assert.throws(() => evaluate(blocks[5][2]));
  assert.deepEqual(evaluate('labels: [&: string]\nlabels: ["public", "internal"]'), { labels: ['public', 'internal'] });
});

test('an integer constraint alone accepts a port beyond its domain', () => {
  assert.deepEqual(evaluate('service: close({ port: *8080 | integer })\nservice: { port: 70000 }'), { service: { port: 70000 } });
});

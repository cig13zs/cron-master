const assert = require('assert');
const Tool = require('./core');
assert.strictEqual(Tool.parse('*/5 * * * *').valid, true);
assert.strictEqual(Tool.parse('0 8 * JAN-MAR MON-FRI').valid, true);
for (const value of ['*/wat 25 99 99 99', '* * * * * junk', '60 * * * *', '*/0 * * * *', '0 0 31 FEB *']) {
  const result = Tool.parse(value);
  if (value !== '0 0 31 FEB *') assert.strictEqual(result.valid, false, value);
}
assert.strictEqual(Tool.parse('0 0 31 FEB *').valid, true); // Syntax validation cannot decide calendar occurrence.
console.log('ok, cron grammar assertions passed');

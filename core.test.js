const assert = require('assert');
const CronMaster = require('./core');

const res1 = CronMaster.parse('*/5 * * * *');
assert.strictEqual(res1.valid, true);
assert.strictEqual(res1.description.includes('every 5 minutes'), true);

const res2 = CronMaster.parse('0 8 * * 1-5');
assert.strictEqual(res2.valid, true);
assert.strictEqual(res2.fields.hour, '8');

console.log('ok, all CronMaster assertions passed');

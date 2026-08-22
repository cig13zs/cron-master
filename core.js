;(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CronMaster = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function parse(expr) {
    const parts = (expr || '').trim().split(/\s+/);
    if (parts.length < 5) return { valid: false, error: 'Expected 5 parts: minute hour day month day-of-week' };

    const [min, hour, dom, mon, dow] = parts;
    const human = [];

    // Minutes
    if (min === '*') human.push('every minute');
    else if (min.startsWith('*/')) human.push('every ' + min.slice(2) + ' minutes');
    else human.push('at minute ' + min);

    // Hours
    if (hour === '*') human.push('every hour');
    else if (hour.startsWith('*/')) human.push('every ' + hour.slice(2) + ' hours');
    else human.push('at ' + hour.padStart(2, '0') + ':00');

    // Day of month
    if (dom !== '*') human.push('on day ' + dom + ' of the month');

    // Month
    if (mon !== '*') human.push('in month ' + mon);

    // Day of week
    if (dow !== '*') human.push('on day-of-week ' + dow);

    return {
      valid: true,
      expression: expr,
      description: human.join(', '),
      fields: { minute: min, hour: hour, dayOfMonth: dom, month: mon, dayOfWeek: dow }
    };
  }

  return { parse: parse };
});

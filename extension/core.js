;(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CronMaster = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const FIELDS = [
    { name: 'minute', min: 0, max: 59 }, { name: 'hour', min: 0, max: 23 },
    { name: 'day of month', min: 1, max: 31 },
    { name: 'month', min: 1, max: 12, names: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'] },
    { name: 'day of week', min: 0, max: 7, names: ['SUN','MON','TUE','WED','THU','FRI','SAT'] }
  ];

  function numeric(value, field) {
    const upper = value.toUpperCase();
    const named = field.names ? field.names.indexOf(upper) : -1;
    if (named >= 0) return field.min + named;
    if (!/^\d+$/.test(value)) return null;
    const number = Number(value);
    return number >= field.min && number <= field.max ? number : null;
  }

  function validateSegment(segment, field) {
    const stepParts = segment.split('/');
    if (stepParts.length > 2 || !stepParts[0]) return false;
    if (stepParts.length === 2 && (!/^\d+$/.test(stepParts[1]) || Number(stepParts[1]) < 1 || Number(stepParts[1]) > field.max - field.min + 1)) return false;
    const base = stepParts[0];
    if (base === '*') return true;
    const range = base.split('-');
    if (range.length > 2) return false;
    const first = numeric(range[0], field);
    if (first == null) return false;
    if (range.length === 1) return stepParts.length === 1;
    const last = numeric(range[1], field);
    return last != null && first <= last;
  }

  function validateField(value, field) {
    const segments = value.split(',');
    return segments.length > 0 && segments.every(function (segment) { return validateSegment(segment, field); });
  }

  function describe(parts) {
    const min = parts[0], hour = parts[1], dom = parts[2], mon = parts[3], dow = parts[4], human = [];
    if (min === '*') human.push('every minute');
    else if (/^\*\/\d+$/.test(min)) human.push('every ' + min.slice(2) + ' minutes');
    else human.push('at minute ' + min);
    if (hour !== '*') human.push('during hour ' + hour);
    if (dom !== '*') human.push('on day ' + dom + ' of the month');
    if (mon !== '*') human.push('in month ' + mon.toUpperCase());
    if (dow !== '*') human.push('on weekday ' + dow.toUpperCase());
    return human.join(', ');
  }

  function parse(expression) {
    const clean = String(expression || '').trim();
    const parts = clean ? clean.split(/\s+/) : [];
    if (parts.length !== 5) return { valid: false, error: 'Expected exactly 5 fields: minute hour day-of-month month day-of-week.' };
    for (let i = 0; i < FIELDS.length; i++) {
      if (!validateField(parts[i], FIELDS[i])) return { valid: false, error: 'Invalid ' + FIELDS[i].name + ' field: ' + parts[i] };
    }
    return { valid: true, expression: clean, description: describe(parts), fields: { minute: parts[0], hour: parts[1], dayOfMonth: parts[2], month: parts[3], dayOfWeek: parts[4] } };
  }
  return { parse: parse, validateField: validateField };
});

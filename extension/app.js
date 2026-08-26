const sample = "*/15 9-17 * * 1-5";

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const statsEl = document.getElementById('output-stats') || document.getElementById('stats');
const emptyHint = 'Enter a 5-part cron expression';

function clearResult(message) {
  outputEl.value = '';
  if (statsEl) statsEl.textContent = message;
}

function process() {
  const txt = inputEl.value.trim();
  if (!txt) { clearResult(emptyHint); return; }
  const res = CronMaster.parse(txt);
  if (!res.valid) { clearResult('Enter 5 cron fields, e.g. */15 9-17 * * 1-5'); return; }
  outputEl.value = JSON.stringify(res, null, 2);
  if (statsEl) statsEl.textContent = res.description;
}

document.getElementById('btn-run').addEventListener('click', process);
inputEl.addEventListener('input', process);
document.getElementById('btn-sample').addEventListener('click', () => { inputEl.value = sample; process(); });
document.getElementById('btn-copy').addEventListener('click', () => { if (!outputEl.value) return; navigator.clipboard.writeText(outputEl.value); alert('Copied schedule!'); });
if (document.getElementById('btn-clear')) document.getElementById('btn-clear').addEventListener('click', () => { inputEl.value = ''; process(); });

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const sessionsUrl = moduleUrl(fs.readFileSync(new URL('../assets/js/interval-sessions.js', import.meta.url), 'utf8'));
const source = fs.readFileSync(new URL('../assets/js/mobile-cards.js', import.meta.url), 'utf8').replace('./interval-sessions.js', sessionsUrl);
const { weeklyCards } = await import(moduleUrl(source));

test('weekly cards identify interval dates without dayTypes on mobile and desktop', () => {
    const cards = { classList: { contains: () => true }, querySelectorAll: () => [] };
    globalThis.document = { querySelector: () => ({}), getElementById: () => ({ closest: () => ({ classList: { add() {} }, nextElementSibling: cards }) }) };
    const data = JSON.parse(fs.readFileSync(new URL('../assets/data/weekly-overview.json', import.meta.url)));
    weeklyCards(data.weeks, 3, data.lastUpdated);
    const weeks = cards.innerHTML.split('<article').slice(1);
    assert.deepEqual([...weeks[0].matchAll(/data-run-type="([^"]+)"/g)].map(m => m[1]), ['easy', 'interval', 'interval']);
    assert.deepEqual([...weeks[1].matchAll(/data-run-type="([^"]+)"/g)].map(m => m[1]), ['easy', 'interval', 'interval']);
    assert.match(weeks[2], /data-run-type="interval"/);
    assert.match(weeks[0], /week-session-tag"[^>]*>300m × 12 組/);
    assert.match(weeks[0], /week-session-tag"[^>]*>1km × 3 組/);
    assert.equal((weeks[0].match(/class="week-session-tag"/g) || []).length, 2);
    assert.match(weeks[4], /week-session-tag"[^>]*>7 分鐘 × 4 組/);
    assert.match(weeks[0], /href="#interval-2026-11-03"/);
    assert.match(weeks[0], /href="#interval-2026-11-05"/);
    const css = fs.readFileSync(new URL('../assets/css/styles.css', import.meta.url), 'utf8');
    assert.match(css, /data-run-type="interval"\]\{--run-color:#E1B7A0\}/);
    delete globalThis.document;
});

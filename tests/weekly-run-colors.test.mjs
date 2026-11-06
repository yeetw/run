import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const sessionsUrl = moduleUrl(fs.readFileSync(new URL('../assets/js/interval-sessions.js', import.meta.url), 'utf8'));
const source = fs.readFileSync(new URL('../assets/js/mobile-cards.js', import.meta.url), 'utf8').replace('./interval-sessions.js', sessionsUrl);
const { weeklyCards } = await import(moduleUrl(source));

test('weekly cards identify interval dates without dayTypes on mobile and desktop', () => {
    const cards = { classList: { contains: () => true }, querySelectorAll: () => [] };
    globalThis.document = { getElementById: () => ({ closest: () => ({ classList: { add() {} }, nextElementSibling: cards }) }) };
    const data = JSON.parse(fs.readFileSync(new URL('../assets/data/weekly-overview.json', import.meta.url)));
    weeklyCards(data.weeks, 3, data.lastUpdated);
    const weeks = cards.innerHTML.split('<article').slice(1);
    assert.deepEqual([...weeks[0].matchAll(/data-run-type="([^"]+)"/g)].map(m => m[1]), ['easy', 'interval', 'interval']);
    assert.deepEqual([...weeks[1].matchAll(/data-run-type="([^"]+)"/g)].map(m => m[1]), ['easy', 'interval', 'interval']);
    assert.match(weeks[2], /data-run-type="interval"/);
    const css = fs.readFileSync(new URL('../assets/css/styles.css', import.meta.url), 'utf8');
    assert.match(css, /data-run-type="interval"\]\{--run-color:#c67c79\}/);
    delete globalThis.document;
});

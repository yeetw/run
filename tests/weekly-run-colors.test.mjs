import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { weeklyCards } from '../assets/js/mobile-cards.js';
import { summarizeRuns } from '../assets/js/run-summaries.js';

test('weekly cards identify interval dates without dayTypes on mobile and desktop', t => {
    const cards = { classList: { contains: () => true }, querySelectorAll: () => [] };
    globalThis.document = { querySelector: () => ({}), getElementById: () => ({ closest: () => ({ classList: { add() {} }, nextElementSibling: cards }) }) };
    t.after(() => { delete globalThis.document; });
    const dates = [
        '2026-11-02', '2026-11-03', '2026-11-05', '2026-10-26', '2026-10-29', '2026-10-31',
        '2026-10-15', '2026-10-06', '2026-10-01', '2025-11-03'
    ];
    const log = summarizeRuns(dates.map(date => ({ date, distance: '2', duration: '12:00' })));
    weeklyCards(log.weeks, 3);
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
    assert.match(weeks[5], /2025\/11\/03/);
    assert.doesNotMatch(weeks[5], /data-run-type="interval"|undefined bpm/);
    const css = fs.readFileSync(new URL('../assets/css/styles.css', import.meta.url), 'utf8');
    assert.match(css, /data-run-type="interval"\]\{--run-color:#E1B7A0\}/);
});

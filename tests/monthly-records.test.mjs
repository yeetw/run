import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source = fs.readFileSync(new URL('../assets/js/monthly-records.js', import.meta.url), 'utf8');
const { matchingMonthlyRuns, monthlyRunDescription } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('matches the month and metric, preserving tied records and ignoring missing values', () => {
    const runs = [
        { date: '2026-10-01', distance: '5.00', pace: '08:33', heartRate: '150', cadence: '167' },
        { date: '2026-10-02', distance: '5', pace: '08:33', heartRate: '-', cadence: '160' },
        { date: '2026-09-01', distance: '5', pace: '08:33' }
    ];
    const month = { month: '2026-10', longestDistance: '5', fastestPace: '08:33', maxAvgHR: '-', maxCadence: '167' };
    assert.deepEqual(matchingMonthlyRuns(month, 'longestDistance', runs), runs.slice(0, 2));
    assert.deepEqual(matchingMonthlyRuns(month, 'fastestPace', runs), runs.slice(0, 2));
    assert.deepEqual(matchingMonthlyRuns(month, 'maxAvgHR', runs), []);
    assert.deepEqual(matchingMonthlyRuns(month, 'maxCadence', runs), [runs[0]]);
});

test('description includes all requested details and marks missing pace', () => {
    assert.equal(monthlyRunDescription({ date: '2026-10-01', distance: '5', pace: '-', heartRate: '150' }),
        '日期：2026-10-01\n距離：5 km\n配速：—\n平均心率：150 bpm');
});

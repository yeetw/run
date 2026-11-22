import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { summarizeRuns } from '../assets/js/run-summaries.js';

test('the checked-in runs have valid dates, distances and durations', () => {
    const { runs } = JSON.parse(readFileSync(new URL('../assets/data/recent-runs.json', import.meta.url)));
    assert.deepEqual(summarizeRuns(runs).errors, []);
});

test('weeks start on Monday, cross years, and count multiple runs on one day', () => {
    const runs = [
        { date: '2026-01-04', time: '07:00', distance: '1', duration: '09:00', pace: '8:59', heartRate: '144' },
        { date: '2025-12-28', distance: '2', duration: '00:11:59', pace: '-', vdot: '12' },
        { date: '2025-12-29', distance: '3', duration: '00:21:00', pace: '06:58', cadence: '151' },
        { date: '2026-01-04', time: '21:00', distance: '2', duration: '12:00', pace: '-', heartRate: '141' }
    ];
    const log = summarizeRuns(runs);
    assert.deepEqual(log.errors, []);
    assert.equal(log.runs[0], runs[3]);
    assert.deepEqual(log.weeks.map(week => week.weekStart), ['2025-12-29', '2025-12-22']);
    const [week, previous] = log.weeks;
    assert.equal(week.dateRange, '12/29–01/04');
    assert.equal(week.totalRuns, 3);
    assert.equal(week.totalDistance, '6.00');
    assert.equal(week.totalDuration, '00:42:00');
    assert.equal(week.averagePace, '07:00');
    assert.deepEqual(week.days[6], { date: '2026-01-04', distance: '3.00', pace: '07:00', heartRate: 143 });
    assert.equal(week.days[0].heartRate, null);
    assert.equal(week.days[1], null);
    assert.equal(previous.averagePace, '06:00');
    assert.deepEqual(log.months[0], {
        month: '2026-01', totalDistance: '3.0', totalRuns: 2, totalDuration: '00:21:00',
        fastestPace: '08:59', longestDistance: 2, maxAvgHR: 144, maxCadence: '-'
    });
    assert.equal(log.months[1].fastestPace, '06:58');
    assert.equal(log.months[1].maxCadence, 151);
});

test('missing pace stays missing, empty periods are omitted and distance rounds after summing', () => {
    const { weeks, months } = summarizeRuns([
        { date: '2025-05-16', distance: '1.24', duration: '00:10:00' },
        { date: '2025-05-16', distance: '1.21', duration: '00:10:00', pace: '-', heartRate: '150' },
        { date: '2025-01-01', distance: '5', duration: '00:30:00' }
    ]);
    assert.equal(weeks.length, 2);
    assert.equal(weeks[0].days[4].heartRate, 150);
    assert.deepEqual(months.map(month => month.month), ['2025-05', '2025-01']);
    assert.equal(months[0].fastestPace, '-');
    assert.equal(months[0].totalDistance, '2.5');
    assert.equal(months[0].maxCadence, '-');
});

test('adding fractional distances preserves the monthly rounding boundary', () => {
    const runs = Array.from({ length: 25 }, () => ({ date: '2026-01-01', distance: '3.07', duration: '20:00' }));
    const { months } = summarizeRuns(runs);
    assert.equal(months[0].totalDistance, '76.8');
});

test('invalid rows report their index and field while valid runs still contribute', () => {
    const valid = { date: '2024-02-29', distance: 5, duration: '25:00:00' };
    const log = summarizeRuns([
        { ...valid, date: '2025-02-29' }, { ...valid, distance: '-' }, { ...valid, duration: '2:60' }, valid
    ]);
    assert.match(log.errors[0], /runs\[0\].*date/);
    assert.match(log.errors[1], /runs\[1\].*distance/);
    assert.match(log.errors[2], /runs\[2\].*duration/);
    assert.deepEqual(log.runs, [valid]);
    assert.equal(log.months[0].totalDuration, '25:00:00');
    assert.deepEqual(summarizeRuns([]), { runs: [], weeks: [], months: [], errors: [] });
});

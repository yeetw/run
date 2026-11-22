import { metricValue } from './monthly-records.js';

export function parseDuration(value) {
    if (typeof value !== 'string' || !/^\d+:(?:[0-5]\d:)?[0-5]\d$/.test(value)) return NaN;
    return value.split(':').reduce((total, part) => total * 60 + Number(part), 0);
}

function formatClock(seconds, withHours = false) {
    const minutes = Math.floor(seconds / 60);
    const parts = withHours
        ? [Math.floor(minutes / 60), minutes % 60, seconds % 60]
        : [minutes, seconds % 60];
    return parts.map(part => String(part).padStart(2, '0')).join(':');
}

function groupBy(records, keyFor) {
    const groups = new Map();
    for (const record of records) {
        const key = keyFor(record);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(record);
    }
    return groups;
}

function totals(records) {
    let distance = 0;
    let roundingError = 0;
    let seconds = 0;
    for (const record of records) {
        // Carry the rounding error into the next addition so 25 × 3.07 km rounds to 76.8 km.
        const increment = record.distance - roundingError;
        const nextDistance = distance + increment;
        roundingError = (nextDistance - distance) - increment;
        distance = nextDistance;
        seconds += record.seconds;
    }
    return { distance, seconds };
}

function formatDistance(distance, digits) {
    const scale = 10 ** digits;
    return (Math.round((distance + distance * Number.EPSILON) * scale) / scale).toFixed(digits);
}

function metricValues(records, field) {
    return records.map(({ run }) => metricValue(run[field], field))
        .filter(value => Number.isFinite(value) && value > 0);
}

function weeklySummary(weekStart, records) {
    const days = Array(7).fill(null);
    for (const [weekday, sessions] of groupBy(records, record => record.weekday)) {
        const { distance, seconds } = totals(sessions);
        const rates = metricValues(sessions, 'heartRate');
        days[weekday] = {
            date: sessions[0].run.date,
            distance: formatDistance(distance, 2),
            pace: formatClock(Math.round(seconds / distance)),
            heartRate: rates.length ? Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length) : null
        };
    }

    const sunday = new Date(weekStart);
    sunday.setUTCDate(sunday.getUTCDate() + 6);
    const monthDay = isoDate => isoDate.slice(5, 10).replace('-', '/');
    const { distance, seconds } = totals(records);
    return {
        weekStart,
        dateRange: monthDay(weekStart) + '–' + monthDay(sunday.toISOString()),
        totalDistance: formatDistance(distance, 2),
        totalDuration: formatClock(seconds, true),
        averagePace: formatClock(Math.round(seconds / distance)),
        totalRuns: records.length,
        days
    };
}

function monthlySummary(month, records) {
    const { distance, seconds } = totals(records);
    const paces = metricValues(records, 'pace');
    const maximum = field => {
        const values = metricValues(records, field);
        return values.length ? Math.max(...values) : '-';
    };
    return {
        month,
        totalDistance: formatDistance(distance, 1),
        totalRuns: records.length,
        totalDuration: formatClock(seconds, true),
        fastestPace: paces.length ? formatClock(Math.min(...paces)) : '-',
        longestDistance: maximum('distance'),
        maxAvgHR: maximum('heartRate'),
        maxCadence: maximum('cadence')
    };
}

export function summarizeRuns(runs) {
    const records = [];
    const errors = [];
    for (const [index, run] of runs.entries()) {
        const date = new Date(run?.date + 'T00:00:00Z');
        const distance = metricValue(run?.distance, 'distance');
        const seconds = parseDuration(run?.duration);
        const invalid = [];
        if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== run.date) invalid.push('date');
        if (!Number.isFinite(distance) || distance <= 0) invalid.push('distance');
        if (!Number.isFinite(seconds) || seconds <= 0) invalid.push('duration');
        if (invalid.length) {
            errors.push(`runs[${index}] (${run?.date ?? '?'}): ${invalid.join(', ')}`);
            continue;
        }

        const weekday = (date.getUTCDay() + 6) % 7;
        date.setUTCDate(date.getUTCDate() - weekday);
        records.push({ run, distance, seconds, weekday, weekStart: date.toISOString().slice(0, 10) });
    }

    records.sort(({ run: a }, { run: b }) =>
        b.date.localeCompare(a.date) || String(b.time ?? '').localeCompare(String(a.time ?? '')));
    const weeks = groupBy(records, record => record.weekStart);
    const months = groupBy(records, record => record.run.date.slice(0, 7));
    return {
        runs: records.map(record => record.run),
        weeks: Array.from(weeks, ([start, entries]) => weeklySummary(start, entries)),
        months: Array.from(months, ([month, entries]) => monthlySummary(month, entries)),
        errors
    };
}

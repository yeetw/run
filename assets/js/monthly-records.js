const recordFields = { fastestPace: 'pace', longestDistance: 'distance', maxAvgHR: 'heartRate', maxCadence: 'cadence' };

function metricValue(value, field) {
    if (value == null || String(value).trim() === '' || value === '-') return NaN;
    if (field === 'pace') {
        if (!/^\d+:\d{2}$/.test(value)) return NaN;
        const [minutes, seconds] = value.split(':').map(Number);
        return minutes * 60 + seconds;
    }
    return Number(value);
}

export function matchingMonthlyRuns(month, metric, runs) {
    const field = recordFields[metric];
    if (!field) return [];
    const target = metricValue(month[metric], field);
    if (!Number.isFinite(target)) return [];
    return runs.filter(run => run.date?.startsWith(`${month.month}-`) && metricValue(run[field], field) === target);
}

export function monthlyRunDescription(run) {
    const display = (value, unit = '') => value && value !== '-' ? `${value}${unit}` : '—';
    return `日期：${display(run.date)}${run.time ? ` ${run.time}` : ''}\n距離：${display(run.distance, ' km')}\n配速：${display(run.pace, ' /km')}\n平均心率：${display(run.heartRate, ' bpm')}`;
}

const SORT_ICONS = { none: '↕', asc: '↑', desc: '↓' };

// Update stats function
function updateStats(newStats) {
    if (newStats.latest) document.getElementById('latest-stat').textContent = newStats.latest;
    if (newStats.week) document.getElementById('week-stat').textContent = newStats.week;
    if (newStats.month) document.getElementById('month-stat').textContent = newStats.month;
}

function parseDate(value) {
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? NaN : timestamp;
}

function parseYearMonth(value) {
    if (!value) return NaN;
    const [yearStr, monthStr] = value.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    if (Number.isNaN(year) || Number.isNaN(month)) return NaN;
    const date = new Date(year, month - 1, 1);
    return date.getTime();
}

function parseTime(value) {
    if (!value) return NaN;
    const parts = value.split(':').map(part => parseInt(part, 10));
    if (parts.length < 2) return NaN;
    const [hours, minutes] = parts;
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return NaN;
    return (hours * 60 + minutes) * 60;
}

function parseDuration(value) {
    if (!value) return NaN;
    const parts = value.split(':').map(part => parseInt(part, 10));
    if (parts.length === 3) {
        const [hours, minutes, seconds] = parts;
        if ([hours, minutes, seconds].some(Number.isNaN)) return NaN;
        return hours * 3600 + minutes * 60 + seconds;
    }
    if (parts.length === 2) {
        const [minutes, seconds] = parts;
        if (Number.isNaN(minutes) || Number.isNaN(seconds)) return NaN;
        return minutes * 60 + seconds;
    }
    return NaN;
}

function parsePace(value) {
    if (!value) return NaN;
    const parts = value.split(':').map(part => parseInt(part, 10));
    if (parts.length < 2) return NaN;
    const [minutes, seconds] = parts;
    if (Number.isNaN(minutes) || Number.isNaN(seconds)) return NaN;
    return minutes * 60 + seconds;
}

function parseNumber(value) {
    if (typeof value !== 'string') return NaN;
    const normalized = value.trim().replace(/[^0-9.-]/g, '');
    const number = parseFloat(normalized);
    return Number.isNaN(number) ? NaN : number;
}

const TABLE_COLUMN_PARSERS = {
    'recent-runs-table': [
        parseDate,
        parseTime,
        parseDuration,
        parseNumber,
        parsePace,
        parseNumber,
        parseNumber,
        parseNumber
    ],
    'monthly-summary-table': [
        parseYearMonth,
        parseNumber,
        parseNumber,
        parseDuration,
        parsePace,
        parseNumber,
        parseNumber,
        parseNumber
    ]
};

function sortTableByColumn(table, columnIndex, direction) {
    const tbody = table?.tBodies?.[0];
    if (!tbody) return;

    const rows = Array.from(tbody.rows);
    const parserList = TABLE_COLUMN_PARSERS[table.id];
    const parser = parserList?.[columnIndex] || (value => value);
    const multiplier = direction === 'asc' ? 1 : -1;

    const sortedRows = rows.sort((rowA, rowB) => {
        const aText = rowA.cells[columnIndex]?.textContent.trim() || '';
        const bText = rowB.cells[columnIndex]?.textContent.trim() || '';

        const aValue = parser(aText);
        const bValue = parser(bText);

        const aInvalid = Number.isNaN(aValue);
        const bInvalid = Number.isNaN(bValue);

        if (aInvalid && bInvalid) return 0;
        if (aInvalid) return 1;
        if (bInvalid) return -1;

        if (aValue === bValue) return 0;
        return aValue > bValue ? multiplier : -multiplier;
    });

    sortedRows.forEach(row => tbody.appendChild(row));
}

// Function to update stats from loaded data
function updateStatsFromData(recentRunsData, weeklyData, monthlyData) {
    const latestDistance = parseFloat(recentRunsData.runs[0]?.distance || '0').toFixed(1);
    const weekSummary = weeklyData.weeks[0]?.summary || '';
    const weekDistance = parseFloat(weekSummary.split('/')[0]?.trim().replace('km', '') || '0').toFixed(1);
    const monthDistance = parseFloat(monthlyData.months[0]?.totalDistance || '0').toFixed(1);

    updateStats({
        latest: `${latestDistance}K`,
        week: `${weekDistance}K`,
        month: `${monthDistance}K`
    });
}

// Function to update recent runs table (limit parameter for controlling display count)
function updateRecentRuns(runs = [], limit = 5) {
    const tbody = document.getElementById('recent-runs-tbody');
    tbody.innerHTML = '';

    const runsArray = Array.isArray(runs) ? runs : [];
    const sortedRuns = [...runsArray].sort((runA = {}, runB = {}) => {
        const aValue = parseDate(runA.date || '');
        const bValue = parseDate(runB.date || '');

        const aInvalid = Number.isNaN(aValue);
        const bInvalid = Number.isNaN(bValue);

        if (aInvalid && bInvalid) return 0;
        if (aInvalid) return 1;
        if (bInvalid) return -1;

        return bValue - aValue;
    });

    // Show entries based on limit (0 means show all)
    const displayRuns = limit > 0 ? sortedRuns.slice(0, limit) : sortedRuns;

    // Find the maximum Vdot among the displayed runs
    const maxVdot = displayRuns.reduce((maxValue, run) => {
        const vdotValue = parseFloat(run.vdot);
        if (Number.isNaN(vdotValue)) {
            return maxValue;
        }
        return vdotValue > maxValue ? vdotValue : maxValue;
    }, Number.NEGATIVE_INFINITY);

    displayRuns.forEach(run => {
        const row = document.createElement('tr');
        const vdotValue = parseFloat(run.vdot);

        if (maxVdot !== Number.NEGATIVE_INFINITY && !Number.isNaN(vdotValue)) {
            if (Math.abs(vdotValue - maxVdot) < 0.0001) {
                row.classList.add('highlight-max-vdot');
            }
        }

        row.innerHTML = `
            <td>${run.date}</td>
            <td>${run.time}</td>
            <td>${run.duration}</td>
            <td>${run.distance}</td>
            <td>${run.pace}</td>
            <td>${run.heartRate}</td>
            <td>${run.cadence}</td>
            <td>${run.vdot}</td>
        `;
        tbody.appendChild(row);
    });
}

// Function to update weekly overview table (limit parameter for controlling display count)
function updateWeeklyOverview(weeks, limit = 5) {
    const tbody = document.getElementById('weekly-overview-tbody');
    tbody.innerHTML = '';

    // Show entries based on limit (0 means show all)
    const displayWeeks = limit > 0 ? weeks.slice(0, limit) : weeks;

    displayWeeks.forEach(week => {
        const row = document.createElement('tr');

        // Format date range: "mm/dd–mm/dd" to "mm/dd<br>~<br>mm/dd"
        const dateRangeFormatted = week.dateRange.replace(/–/, '<br>~<br>');

        // Parse summary data: "distance / duration / pace"
        const summaryParts = week.summary.split('/').map(p => p.trim());
        const summaryHTML = `
            <div class="weekly-data">
                ${summaryParts.map(part => `<span class="data-badge">${part}</span>`).join('')}
            </div>
        `;

        const daysCells = week.days.map(day => {
            if (!day) {
                return '<td></td>';
            }

            // Parse the day data: "distance / pace / heartRate"
            const parts = day.split('/').map(p => p.trim());

            return `<td class="weekly-cell">
                <div class="weekly-data">
                    ${parts.map(part => `<span class="data-badge">${part}</span>`).join('')}
                </div>
            </td>`;
        }).join('');

        row.innerHTML = `
            <td class="weekly-date-range">${dateRangeFormatted}</td>
            <td class="weekly-summary">${summaryHTML}</td>
            ${daysCells}
        `;
        tbody.appendChild(row);
    });
}

// Function to update monthly summary table (limit parameter for controlling display count)
function updateMonthlySummary(months, limit = 5) {
    const tbody = document.getElementById('monthly-summary-tbody');
    tbody.innerHTML = '';

    // Show entries based on limit (0 means show all)
    const displayMonths = limit > 0 ? months.slice(0, limit) : months;

    displayMonths.forEach(month => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${month.month}</td>
            <td>${month.totalDistance}</td>
            <td>${month.totalRuns}</td>
            <td>${month.totalDuration}</td>
            <td>${month.fastestPace}</td>
            <td>${month.longestDistance}</td>
            <td>${month.maxAvgHR}</td>
            <td>${month.maxCadence}</td>
        `;
        tbody.appendChild(row);
    });
}

// Function to update achievements table (no limit, always shows all)
function updateAchievements(races) {
    const tbody = document.getElementById('achievements-tbody');
    tbody.innerHTML = '';

    races.forEach((race, index) => {
        // Main row
        const row = document.createElement('tr');
        row.className = 'achievement-row';
        row.dataset.index = index;
        row.style.cursor = 'pointer';

        row.innerHTML = `
            <td>${race.no}</td>
            <td>${race.race}</td>
            <td>${race.date}</td>
            <td>${race.distance}</td>
            <td>${race.duration}</td>
            <td>${race.avgPace}</td>
            <td>${race.avgHeartRate}</td>
            <td>${race.avgCadence}</td>
        `;

        // Add click event to toggle splits
        row.addEventListener('click', function() {
            toggleSplits(index, race.splits);
        });

        tbody.appendChild(row);

        // Detail row (initially hidden)
        const detailRow = document.createElement('tr');
        detailRow.className = 'achievement-detail-row';
        detailRow.id = `detail-row-${index}`;
        detailRow.style.display = 'none';
        detailRow.innerHTML = `
            <td colspan="8" class="detail-cell">
                <div class="splits-container" id="splits-${index}"></div>
            </td>
        `;
        tbody.appendChild(detailRow);
    });
}

// Function to toggle splits display
function toggleSplits(index, splits) {
    const detailRow = document.getElementById(`detail-row-${index}`);
    const splitsContainer = document.getElementById(`splits-${index}`);

    if (detailRow.style.display === 'none') {
        // Show splits
        if (splits && splits.length > 0) {
            let splitsHTML = `
                <table class="splits-table">
                    <thead>
                        <tr>
                            <th>KM</th>
                            <th>Pace</th>
                            <th>Time</th>
                            <th>Heart Rate</th>
                            <th>Cadence</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            splits.forEach(split => {
                splitsHTML += `
                    <tr>
                        <td>${split.km}</td>
                        <td>${split.pace}</td>
                        <td>${split.time}</td>
                        <td>${split.heartRate}</td>
                        <td>${split.cadence}</td>
                    </tr>
                `;
            });

            splitsHTML += `
                    </tbody>
                </table>
            `;

            splitsContainer.innerHTML = splitsHTML;
        } else {
            splitsContainer.innerHTML = '<p class="no-splits">No split data available</p>';
        }
        detailRow.style.display = 'table-row';
    } else {
        // Hide splits
        detailRow.style.display = 'none';
    }
}

function initializeSortableTable(tableSelector) {
    const table = document.querySelector(tableSelector);
    if (!table) return;

    const headers = Array.from(table.querySelectorAll('thead th'));
    if (!headers.length) return;

    let activeColumnIndex = null;

    headers.forEach((header, index) => {
        const baseLabel = header.dataset.baseLabel || header.textContent.trim();
        header.dataset.baseLabel = baseLabel;
        header.dataset.sortDirection = 'none';
        header.style.cursor = 'pointer';

        if (!header.querySelector('.sort-icon')) {
            const labelSpan = document.createElement('span');
            labelSpan.className = 'sort-label';
            labelSpan.textContent = baseLabel;

            const iconSpan = document.createElement('span');
            iconSpan.className = 'sort-icon';
            iconSpan.setAttribute('aria-hidden', 'true');

            header.textContent = '';
            header.appendChild(labelSpan);
            header.appendChild(iconSpan);
        }

        header.addEventListener('click', () => {
            const isNewColumn = activeColumnIndex !== index;
            const currentDirection = header.dataset.sortDirection || 'none';
            const nextDirection = isNewColumn
                ? 'desc'
                : currentDirection === 'desc'
                    ? 'asc'
                    : 'desc';

            activeColumnIndex = index;

            headers.forEach((th, headerIndex) => {
                const icon = th.querySelector('.sort-icon');
                if (headerIndex === index) {
                    th.dataset.sortDirection = nextDirection;
                    th.classList.add('is-sorted');
                    if (icon) icon.textContent = SORT_ICONS[nextDirection];
                } else {
                    th.dataset.sortDirection = 'none';
                    th.classList.remove('is-sorted');
                    if (icon) icon.textContent = '';
                }
            });

            sortTableByColumn(table, index, nextDirection);
        });
    });
}

// Main initialization function - load all data once
async function initializePage() {
    try {
        // Fetch all JSON files once in parallel
        const [recentRunsData, weeklyData, monthlyData, achievementsData] = await Promise.all([
            fetch('/assets/data/recent-runs.json').then(res => res.json()),
            fetch('/assets/data/weekly-overview.json').then(res => res.json()),
            fetch('/assets/data/monthly-summary.json').then(res => res.json()),
            fetch('/assets/data/running-achievements.json').then(res => res.json())
        ]);

        // Update all sections with the loaded data
        updateStatsFromData(recentRunsData, weeklyData, monthlyData);
        updateRecentRuns(recentRunsData.runs);
        updateWeeklyOverview(weeklyData.weeks);
        updateMonthlySummary(monthlyData.months);
        updateAchievements(achievementsData.achievements);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Initialize page for index (with stats)
async function initializeIndexPage() {
    await initializePage();
}

// Initialize page for detail pages (without stats, with custom limit)
async function initializeDetailPage(pageType) {
    try {
        let data;
        let updateFunction;
        let limit = 0; // 0 means show all

        switch(pageType) {
            case 'recent-runs':
                data = await fetch('/assets/data/recent-runs.json').then(res => res.json());
                updateRecentRuns(data.runs, limit);
                break;
            case 'weekly-overview':
                data = await fetch('/assets/data/weekly-overview.json').then(res => res.json());
                updateWeeklyOverview(data.weeks, limit);
                break;
            case 'monthly-summary':
                data = await fetch('/assets/data/monthly-summary.json').then(res => res.json());
                updateMonthlySummary(data.months, limit);
                break;
            case 'achievements':
                data = await fetch('/assets/data/running-achievements.json').then(res => res.json());
                updateAchievements(data.achievements);
                break;
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on
    const path = window.location.pathname;

    initializeSortableTable('#recent-runs-table');
    initializeSortableTable('#monthly-summary-table');

    if (path === '/' || path === '/index.html') {
        initializeIndexPage();
    } else if (path.includes('recent-runs')) {
        initializeDetailPage('recent-runs');
    } else if (path.includes('weekly-overview')) {
        initializeDetailPage('weekly-overview');
    } else if (path.includes('monthly-summary')) {
        initializeDetailPage('monthly-summary');
    } else if (path.includes('achievements')) {
        initializeDetailPage('achievements');
    }
});

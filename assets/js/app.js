// Update stats function
function updateStats(newStats) {
    if (newStats.latest) document.getElementById('latest-stat').textContent = newStats.latest;
    if (newStats.week) document.getElementById('week-stat').textContent = newStats.week;
    if (newStats.month) document.getElementById('month-stat').textContent = newStats.month;
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
function updateRecentRuns(runs, limit = 5) {
    const tbody = document.getElementById('recent-runs-tbody');
    tbody.innerHTML = '';

    // Show entries based on limit (0 means show all)
    const displayRuns = limit > 0 ? runs.slice(0, limit) : runs;

    displayRuns.forEach(run => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${run.date}</td>
            <td>${run.time}</td>
            <td>${run.duration}</td>
            <td>${run.distance}</td>
            <td>${run.pace}</td>
            <td>${run.heartRate}</td>
            <td>${run.cadence}</td>
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

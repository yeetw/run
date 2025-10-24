# Marathon Landing Page Project

## Project Overview
This is a simple landing page with a marathon theme featuring the quote "Life is a Marathon - I'm looking for a water station." The page displays statistics in three categories: Latest, Week, and Month.

> **⚠️ Important**: When making changes to `index.html`, `*.html` pages, `assets/css/styles.css`, or `assets/js/app.js`, **ALWAYS update this CLAUDE.md file** to reflect the changes. This ensures the documentation stays in sync with the codebase.

## File Structure
- `index.html` - Main landing page
- `recent-runs.html` - Complete recent runs data page
- `weekly-overview.html` - Complete weekly overview data page
- `monthly-summary.html` - Complete monthly summary data page
- `achievements.html` - Complete achievements data page
- `assets/css/styles.css` - Shared stylesheet for all pages
- `assets/js/app.js` - Shared JavaScript functions for all pages
- `assets/images/tag-bg.png` - Green background image for statistic tags
- `assets/images/cover.jpg` - Cover image for social sharing
- `assets/data/recent-runs.json` - Recent running activities data
- `assets/data/weekly-overview.json` - Weekly overview and calendar data
- `assets/data/monthly-summary.json` - Monthly statistics and performance metrics
- `assets/data/running-achievements.json` - Race achievements and competition results
- `tmp/` - Design mockups and temporary files

## Key Features
- Responsive design that works on desktop and mobile
- Clean, modern typography using system fonts
- Statistics display with green background tags
- Multiple data tables with hover effects and clean design
- Easy-to-modify structure for future updates
- Dynamic data updating capabilities for all sections
- JSON-based data loading for all data tables (with fallback support)
- Comprehensive running analytics across different time periods
- Race achievement tracking with expandable per-kilometer split details
- **Display Limits**: Index page shows only the latest 5 entries for Recent Runs, Weekly Overview, and Monthly Summary (achievements show all entries)
- **Detail Pages**: Click the dots separator below each table to navigate to dedicated pages showing all data
- **Interactive Features**: Click achievement rows to expand/collapse detailed kilometer-by-kilometer performance data
- **Shared Resources**: All pages use the same CSS and JavaScript files for consistency and easy maintenance

## How to Modify

### Updating Statistics
Statistics (Latest/Week/Month) are **automatically calculated** from the JSON data files:
- **Latest**: Extracted from the first run in `recent-runs.json`
- **Week**: Extracted from the first week's summary in `weekly-overview.json`
- **Month**: Extracted from the first month in `monthly-summary.json`

All statistics are automatically formatted to display **one decimal place** (e.g., "3.2K", "31.0K") using rounding.

To update the statistics, simply update the respective JSON files and refresh the page.

You can also manually update stats using the `updateStats()` function:
```javascript
updateStats({ latest: '4.1K', week: '25K', month: '120K' });
```

### Updating Recent Runs Data
Recent runs data is now loaded from `/assets/data/recent-runs.json`. To update the data:

1. **Edit the JSON file directly:**
```json
{
  "lastUpdated": "2025-09-23",
  "runs": [
    {
      "date": "2025/9/16",
      "time": "06:30",
      "duration": "00:44:48",
      "distance": "3.24",
      "pace": "13:48",
      "heartRate": "104",
      "cadence": "131"
    }
  ]
}
```

2. **JSON File Structure:**
   - `lastUpdated`: ISO date string for tracking when data was last modified
   - `runs`: Array of run objects with the following fields:
     - `date`: Date in "YYYY/M/D" format
     - `time`: Start time in "HH:MM" format
     - `duration`: Run duration in "HH:MM:SS" format
     - `distance`: Distance as string (km)
     - `pace`: Average pace in "MM:SS" format
     - `heartRate`: Average heart rate as string
     - `cadence`: Average cadence as string

3. **Or update programmatically using the function:**
```javascript
updateRecentRuns([
    { date: '2025/9/20', time: '07:00', duration: '00:50:00', distance: '5.0', pace: '10:00', heartRate: '150', cadence: '160' },
    // ... new runs data
]);
```

**Note**: The page automatically loads all data from JSON files on page load using a single fetch operation for optimal performance. The table displays only the latest 5 entries from the data.

### Updating Weekly Overview Data
Weekly overview data is now loaded from `/assets/data/weekly-overview.json`. To update the data:

1. **Edit the JSON file directly:**
```json
{
  "lastUpdated": "2025-09-23",
  "weeks": [
    {
      "dateRange": "09/15–09/21",
      "summary": "3.24km / 00:44:48 / 13:50",
      "days": [
        "",
        "3.24km / 13:50 / 104",
        "",
        "",
        "",
        "",
        ""
      ]
    }
  ]
}
```

2. **JSON File Structure:**
   - `lastUpdated`: ISO date string for tracking when data was last modified
   - `weeks`: Array of week objects with the following fields:
     - `dateRange`: Date range in "MM/DD–MM/DD" format (plain text)
       - **Visual Display**: Automatically formatted to multi-line display: "MM/DD<br>~<br>MM/DD"
     - `summary`: Weekly summary string with format "distance / duration / pace"
       - **Visual Display**: Each part is displayed as a separate gray badge pill
     - `days`: Array of 7 strings representing Monday to Sunday
       - Empty string `""` for days with no activity
       - Format for active days: "distance / pace / heartRate"
       - **Visual Display**: Each day's data is automatically parsed and displayed as separate gray badge pills for better readability

3. **Or update programmatically using the function:**
```javascript
updateWeeklyOverview([
    {
        dateRange: '09/22–09/28',
        summary: '15.5km / 02:30:00 / 9:41',
        days: ['5km / 25:00 / 140', '', '10.5km / 60:00 / 150', '', '', '', '']
    },
    // ... new weekly data
]);
```

**Note**: The page automatically loads all data from JSON files on page load using a single fetch operation for optimal performance. The table displays only the latest 5 entries from the data.

### Updating Monthly Summary Data
Monthly summary data is now loaded from `/assets/data/monthly-summary.json`. To update the data:

1. **Edit the JSON file directly:**
```json
{
  "lastUpdated": "2025-09-23",
  "months": [
    {
      "month": "2025-09",
      "totalDistance": "31",
      "totalRuns": "5",
      "totalDuration": "05:48:41",
      "fastestPace": "10:07",
      "longestDistance": "12.27",
      "maxAvgHR": "162",
      "maxCadence": "155"
    }
  ]
}
```

2. **JSON File Structure:**
   - `lastUpdated`: ISO date string for tracking when data was last modified
   - `months`: Array of month objects with the following fields:
     - `month`: Month identifier in "YYYY-MM" format
     - `totalDistance`: Total distance as string
     - `totalRuns`: Total number of runs as string
     - `totalDuration`: Total duration in "HH:MM:SS" format
     - `fastestPace`: Fastest pace in "MM:SS" format
     - `longestDistance`: Longest single run distance as string
     - `maxAvgHR`: Maximum average heart rate as string
     - `maxCadence`: Maximum cadence as string (use "-" for no data)

3. **Or update programmatically using the function:**
```javascript
updateMonthlySummary([
    {
        month: '2025-10',
        totalDistance: '75.5',
        totalRuns: '15',
        totalDuration: '12:30:45',
        fastestPace: '08:45',
        longestDistance: '15.0',
        maxAvgHR: '165',
        maxCadence: '180'
    },
    // ... new monthly data
]);
```

**Note**: The page automatically loads all data from JSON files on page load using a single fetch operation for optimal performance. The table displays only the latest 5 entries from the data.

### Updating Running Achievements Data
Running achievements data is now loaded from `/assets/data/running-achievements.json`. To update the data:

1. **Edit the JSON file directly:**
```json
{
  "lastUpdated": "2025-09-23",
  "achievements": [
    {
      "no": "1",
      "race": "2025 Panasonic 台北城市路跑賽",
      "date": "2025/9/14",
      "distance": "12.5",
      "duration": "02:04:06",
      "avgPace": "10:07",
      "avgHeartRate": "162",
      "avgCadence": "155",
      "splits": [
        { "km": "1", "pace": "09:30", "time": "00:09:30", "heartRate": "150", "cadence": "152" },
        { "km": "2", "pace": "10:00", "time": "00:19:30", "heartRate": "160", "cadence": "155" }
      ]
    }
  ]
}
```

2. **JSON File Structure:**
   - `lastUpdated`: ISO date string for tracking when data was last modified
   - `achievements`: Array of achievement objects with the following fields:
     - `no`: Achievement number as string (e.g., "1", "2", "3")
     - `race`: Race name as plain text string
     - `date`: Race date in "YYYY/M/D" format
     - `distance`: Race distance as string
     - `duration`: Race duration in "HH:MM:SS" format
     - `avgPace`: Average pace in "MM:SS" format
     - `avgHeartRate`: Average heart rate as string
     - `avgCadence`: Average cadence as string
     - `splits`: (Optional) Array of split objects for kilometer-by-kilometer data
       - `km`: Kilometer number as string (e.g., "1", "2", "3")
       - `pace`: Pace for this kilometer in "MM:SS" format
       - `time`: Cumulative time at this kilometer in "HH:MM:SS" format
       - `heartRate`: Average heart rate for this kilometer as string
       - `cadence`: Average cadence for this kilometer as string

3. **Or update programmatically using the function:**
```javascript
updateAchievements([
    {
        no: '1',
        race: '2025 Taiwan Marathon 半程馬拉松',
        date: '2025/12/15',
        distance: '21.1',
        duration: '01:45:30',
        avgPace: '05:00',
        avgHeartRate: '170',
        avgCadence: '185',
        splits: [
            { km: '1', pace: '04:50', time: '00:04:50', heartRate: '165', cadence: '180' },
            { km: '2', pace: '05:00', time: '00:09:50', heartRate: '170', cadence: '182' }
        ]
    },
    // ... new achievements data
]);
```

**Expandable Detail Feature:**
- Click on any achievement row to expand/collapse detailed per-kilometer split data
- Split data displays kilometer number, pace, cumulative time, heart rate, and cadence for each kilometer
- If no split data is available, the message "No split data available" will be shown
- The splits array is optional - achievements without splits will still display normally

Note: The page automatically loads all data from JSON files on page load using a single fetch operation for optimal performance.

### Styling Modifications

All CSS is located in `/assets/css/styles.css`:

- Main title: `.main-title` class
- Subtitle: `.subtitle` class
- Stat labels: `.stat-label` class
- Stat values: `.stat-value` and `.stat-number` classes
- Section titles: `.section-title` class
- Table wrapper: `.table-wrapper` class - enables horizontal scrolling on mobile devices only (≤768px)
- Data tables: `.data-table` class with `.data-table th` and `.data-table td`
  - First column auto-width for `#recent-runs-table`, `#weekly-overview-table`, and `#monthly-summary-table`
  - Desktop: tables fit container width without scrolling
  - Mobile: tables have `min-width: 600px` and allow horizontal scrolling
  - `#weekly-overview-table` uses `table-layout: fixed` with percentage-based widths for date (8%) and summary (20%) columns to prevent overlap while maintaining consistent table width
- Weekly overview cells: `.weekly-cell` class (font-size: 0.85rem, line-height: 1.3)
  - Weekly data badges: `.weekly-data` container with flex column layout
  - `.data-badge` class for individual data pills:
    - Background color: #7e848a (gray)
    - Desktop: min-width 60px, padding 0.3rem 0.8rem
    - Mobile: min-width 30px, padding 0.25rem 0.6rem, smaller font
  - Both summary column and day cells use the same badge styling
- Weekly date ranges: `.weekly-date-range` class (centered, font-weight: 600, line-height: 1.4)
- Weekly summaries: `.weekly-summary` class (contains badges, blue background #e6f3ff, font-weight: 600)
- Dots separator: `.dots-separator` class with `.dot` elements for section dividers (clickable with hover effect)
- Page header: `.page-header` class for detail page header layout (contains back button and title)
- Back button: `.back-button` class - small arrow (←) positioned to the left of page title
- Background colors and spacing can be adjusted in the CSS file

### Background Image
The green tag backgrounds use `/assets/images/tag-bg.png`. To change:
1. Replace the image file in the `assets/images/` folder, or
2. Update the `background-image` property in `.stat-value` class

## Design Notes
- Font sizes are responsive (smaller on mobile)
- Stats layout changes to vertical stack on mobile devices
- Data tables support horizontal scrolling **only on mobile devices** (≤768px) to preserve all columns
- Desktop view displays full tables without horizontal scrolling
- First column (Date/Month) in Recent Runs, Weekly Overview, and Monthly Summary tables auto-adjusts to content width
- Color scheme uses neutral grays with green accent backgrounds
- Clean table design with hover effects and rounded corners
- Gray dots separators between sections for visual organization
- Typography emphasizes the motivational marathon theme

## Page Structure

### Index Page (`index.html`)
1. **Hero Section**: Main title with motivational quote and statistics
2. **Recent Runs**: Table showing latest 5 running activities with detailed metrics
3. **Weekly Overview**: Calendar-style table showing latest 5 weekly summaries and daily run data
   - Table columns: Date, Sum (summary), Mon., Tue., Wed., Thu., Fri., Sat., Sun.
   - Date column displays multi-line format: "MM/DD" "~" "MM/DD"
   - Sum column and day columns display data as colored badge pills
4. **Monthly Summary**: Comprehensive monthly statistics for the latest 5 months including totals and performance metrics
5. **Running Achievements**: Race participation records and competition results (shows all achievements)

Each section has a clickable dots separator that navigates to the dedicated detail page.

### Detail Pages
- **`/recent-runs.html`**: Shows all recent running activities without any limit
- **`/weekly-overview.html`**: Shows all weekly overview data without any limit
  - Same table structure as index page with Date, Sum, and weekday columns
- **`/monthly-summary.html`**: Shows all monthly summary data without any limit
- **`/achievements.html`**: Shows all running achievements (same as index page)

All detail pages include:
- Page header with small back arrow (←) on the left and page title in the center
- Complete data table with all entries from the respective JSON file
- Click the back arrow to return to index page

## Development

This project consists of multiple static HTML pages that share common CSS and JavaScript files.

**Important:** Due to the JSON data loading feature, when developing locally you should serve the page through a web server rather than opening the HTML file directly (file://) to avoid CORS issues.

Options for local development:
- Use Jekyll: `bundle exec jekyll serve`
- Use Python: `python -m http.server 8000`
- Use Node.js: `npx http-server`
- Use any other local web server

### Code Organization

- **CSS**: All styles are in `/assets/css/styles.css` and shared across all pages
- **JavaScript**: All functions are in `/assets/js/app.js` with automatic page detection
  - Functions support an optional `limit` parameter to control display count
  - `limit = 0` means show all data (used in detail pages)
  - `limit = 5` means show only 5 entries (used in index page)

All data is loaded from JSON files on page initialization. If JSON files cannot be loaded, an error will be logged to the console.

### Navigation

- **To Detail Pages**: Click on dots separator (three gray dots) below any table on the index page
- **Back to Index**: Click the back arrow (←) at the top left of any detail page to return to the index page

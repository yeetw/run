# Marathon Landing Page Project

## Project Overview
This is a simple landing page with a marathon theme featuring the quote "Life is a Marathon - I'm looking for a water station." The page displays statistics in three categories: Latest, Week, and Month.

## File Structure
- `index.html` - Main landing page
- `assets/images/tag-bg.png` - Green background image for statistic tags
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
- Race achievement tracking
- **Display Limits**: Recent Runs, Weekly Overview, and Monthly Summary tables show only the latest 5 entries (achievements show all entries)

## How to Modify

### Updating Statistics
Statistics (Latest/Week/Month) are **automatically calculated** from the JSON data files:
- **Latest**: Extracted from the first run in `recent-runs.json`
- **Week**: Extracted from the first week's summary in `weekly-overview.json`
- **Month**: Extracted from the first month in `monthly-summary.json`

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
     - `summary`: Weekly summary string with format "distance / duration / pace"
     - `days`: Array of 7 strings representing Monday to Sunday
       - Empty string `""` for days with no activity
       - Format for active days: "distance / pace / heartRate"

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
      "race": "2025 Panasonic 台北城市路跑賽",
      "date": "2025/9/14",
      "distance": "12.5",
      "duration": "02:04:06",
      "avgPace": "10:07",
      "avgHeartRate": "162",
      "avgCadence": "155"
    }
  ]
}
```

2. **JSON File Structure:**
   - `lastUpdated`: ISO date string for tracking when data was last modified
   - `achievements`: Array of achievement objects with the following fields:
     - `race`: Race name as plain text string
     - `date`: Race date in "YYYY/M/D" format
     - `distance`: Race distance as string
     - `duration`: Race duration in "HH:MM:SS" format
     - `avgPace`: Average pace in "MM:SS" format
     - `avgHeartRate`: Average heart rate as string
     - `avgCadence`: Average cadence as string

3. **Or update programmatically using the function:**
```javascript
updateAchievements([
    {
        race: '2025 Taiwan Marathon 半程馬拉松',
        date: '2025/12/15',
        distance: '21.1',
        duration: '01:45:30',
        avgPace: '05:00',
        avgHeartRate: '170',
        avgCadence: '185'
    },
    // ... new achievements data
]);
```

Note: The page automatically loads all data from JSON files on page load using a single fetch operation for optimal performance.

### Styling Modifications
- Main title: `.main-title` class
- Subtitle: `.subtitle` class
- Stat labels: `.stat-label` class
- Stat values: `.stat-value` and `.stat-number` classes
- Section titles: `.section-title` class
- Data tables: `.data-table` class with `.data-table th` and `.data-table td`
- Weekly overview cells: `.weekly-cell` class for highlighted run days
- Weekly date ranges: `.weekly-date-range` class
- Weekly summaries: `.weekly-summary` class
- Dots separator: `.dots-separator` class with `.dot` elements for section dividers
- Background colors and spacing can be adjusted in the CSS section

### Background Image
The green tag backgrounds use `/assets/images/tag-bg.png`. To change:
1. Replace the image file in the `assets/images/` folder, or
2. Update the `background-image` property in `.stat-value` class

## Design Notes
- Font sizes are responsive (smaller on mobile)
- Stats layout changes to vertical stack on mobile devices
- Data tables are responsive with smaller text on mobile
- Color scheme uses neutral grays with green accent backgrounds
- Clean table design with hover effects and rounded corners
- Gray dots separators between sections for visual organization
- Typography emphasizes the motivational marathon theme

## Current Sections
1. **Hero Section**: Main title with motivational quote and statistics
2. **Recent Runs**: Table showing latest 5 running activities with detailed metrics
3. **Weekly Overview**: Calendar-style table showing latest 5 weekly summaries and daily run data
4. **Monthly Summary**: Comprehensive monthly statistics for the latest 5 months including totals and performance metrics
5. **Running Achievements**: Race participation records and competition results (shows all achievements)

## Development
This is a static HTML page that can be opened directly in a browser or served through any web server.

**Important:** Due to the JSON data loading feature, when developing locally you should serve the page through a web server rather than opening the HTML file directly (file://) to avoid CORS issues.

Options for local development:
- Use Jekyll: `bundle exec jekyll serve`
- Use Python: `python -m http.server 8000`
- Use Node.js: `npx http-server`
- Use any other local web server

All data is loaded from JSON files on page initialization. If JSON files cannot be loaded, an error will be logged to the console.